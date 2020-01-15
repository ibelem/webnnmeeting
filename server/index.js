const https = require('https')
const express = require('express')
// const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const authrequest = require('./authrequest')
const webrtcconfig = require('./webrtcconfig')

config.dev = process.env.NODE_ENV !== 'production'

const request = authrequest(
  webrtcconfig.id,
  webrtcconfig.key,
  webrtcconfig.url,
  false
)

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

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)
  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
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
    })
    .catch((e) => {
      console.log('Failed to intialize sampleRoom', e)
    })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  // app.listen(port, host)
  // consola.ready({
  //   message: `Server listening on http://${host}:${port}`,
  //   badge: true
  // })
  https.createServer(nuxt.options.server.https, app).listen(port, host)
}

start()
