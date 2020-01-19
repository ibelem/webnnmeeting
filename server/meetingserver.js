/*
 * Copyright © 2018 Intel Corporation. All Rights Reserved.
 */
'use strict'

const fs = require('fs')
const path = require('path')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const config = require('../config')
const rest = require('./authrequest')

// Directory 'public' for static files
// app.use(express.static(__dirname + '/html'))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

// Set rejectUnauthorized to true for production use
const request = rest(
  config.webrtcserver.id,
  config.webrtcserver.key,
  config.webrtcserver.url,
  false
)

// Prepare sample room before start-up
const prepareSampleRoom = new Promise((resolve, reject) => {
  const checkResponse = (resp) => {
    const rooms = JSON.parse(resp)
    let sampleRoomId = null
    // Find sample room
    for (const room of rooms) {
      if (room.name === 'sampleRoom') {
        sampleRoomId = room._id
        break
      }
    }
    if (sampleRoomId) {
      resolve(sampleRoomId)
    } else {
      // Try create
      const createBody = JSON.stringify({
        name: 'sampleRoom',
        options: {}
      })
      const createOk = (resp) => {
        resolve(JSON.parse(resp)._id)
      }
      request('POST', '/v1/rooms', createBody, createOk, reject)
    }
  }

  request('GET', '/v1/rooms?page=1&per_page=100', null, checkResponse, reject)
})

function onRequestFail(err) {
  console.log('Request Fail:', err)
}

prepareSampleRoom
  .then((sampleRoom) => {
    console.log('Get sampleRoom Id:', sampleRoom)

    // Create token API with default room
    app.post('/createToken/', function(req, res) {
      const tokenRoom = req.body.room || sampleRoom
      request('POST', '/v1/rooms/' + tokenRoom + '/tokens', req.body)
        .then((imRes) => {
          res.writeHead(imRes.statusCode, imRes.headers)
          imRes.pipe(res)
        })
        .catch(onRequestFail)
    })

    // Route internal REST interface
    app.use(function(req, res) {
      request(req.method, '/v1' + req.path, req.body)
        .then((imRes) => {
          res.writeHead(imRes.statusCode, imRes.headers)
          imRes.pipe(res)
        })
        .catch(onRequestFail)
    })

    // Start HTTP server
    app.listen(config.restapiserver.httpport)

    // Start HTTPS server
    try {
      https
        .createServer(
          {
            cert: fs.readFileSync(path.resolve(__dirname, '../webnn-cert.pem')),
            key: fs.readFileSync(path.resolve(__dirname, '../webnn-key.pem'))
          },
          app
        )
        .listen(config.restapiserver.httpsport)
    } catch (e) {
      console.log(e)
    }
  })
  .catch((e) => {
    console.log('Failed to intialize sampleRoom', e)
  })
