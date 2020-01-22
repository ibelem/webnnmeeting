<template>
  <div class="video-panel">
    <a @click="leaveMeeting" href="/" class="button is-info">
      Leave
    </a>

    <div class="tile is-ancestor">
      <div v-if="users.length > 0" v-for="u in users" class="tile is-4">
        <video
          v-if="u.srcObject"
          :id="u.id"
          :src-object.prop.camel="u.srcObject"
          playsinline
          autoplay
          class="tile"
        ></video>
        <div v-if="u.srcObject" class="user">{{ u.userId }}</div>
      </div>
    </div>
    {{ mode }}
    <div style="margin: 10px; font-size: 11px;">{{ users }}</div>
  </div>
</template>
<script>
import Owt from '~/assets/js/owt/owt'
import { mixStream, createToken, getStreams } from '~/assets/js/rest'

export default {
  name: 'Video',
  data() {
    return {
      thatName: '',
      bandwidth: 1000,
      avTrackConstraint: {},
      localStream: null,
      localScreen: null,
      localName: 'Anonymous',
      localId: null,
      localScreenId: null,
      users: [],
      progressTimeOut: null,
      smallRadius: 60,
      largeRadius: 120,
      isMouseDown: false,
      mouseX: null,
      mouseY: null,
      MODES: {
        GALAXY: 'galaxy',
        MONITOR: 'monitor',
        LECTURE: 'lecture'
      },
      mode: 'galaxy',
      SUBSCRIBETYPES: {
        FORWARD: 'forward',
        MIX: 'mix'
      },
      isScreenSharing: false,
      isLocalScreenSharing: false,
      remoteScreen: null,
      remoteScreenName: null,
      isMobile: false,
      streamObj: {},
      streamIndices: {},
      hasMixed: false,
      isSmall: false,
      isPauseAudio: true,
      isPauseVideo: false,
      isOriginal: true,
      isAudioOnly: false,

      showInfo: null,
      showLevel: null,
      scaleLevel: 3 / 4,
      refreshMute: null,

      currentRegions: null,

      localPublication: null,
      localScreenPubliction: null,
      joinResponse: null,

      localResolution: null,
      remoteMixedSub: null,
      subList: {},
      screenSub: null,

      room: null,
      roomId: null,

      remoteStreamMap: new Map(),
      forwardStreamMap: new Map(),

      localVideo: [],
      remoteVideo: []
    }
  },
  computed: {
    subscribeType() {
      return this.$store.state.subscribetype
    },
    resolutionwidth() {
      return this.$store.state.resolution.width
    },
    resolutionheight() {
      return this.$store.state.resolution.height
    },
    enablevideo() {
      return this.$store.state.enablevideo
    },
    srcobject(mediasource) {
      return mediasource
    }
  },
  mounted() {
    this.userExit()
    this.initConference()
  },
  created() {
    if (process.browser) {
      addEventListener('beforeunload', this.userExit, false)
    }
  },
  destroyed() {
    this.userExit()
  },
  methods: {
    l(data) {
      console.log(data)
    },
    leaveMeeting() {
      this.userExit()
      this.$router.push({ name: 'index' })
    },
    initConference() {
      console.log('==== initConference ====')
      this.localName = this.$route.params.id
      if (this.subscribeType === 'mix') {
        this.mode = this.MODES.LECTURE
      } else {
        this.mode = this.MODES.GALAXY
      }

      this.localResolution = new Owt.Base.Resolution(
        this.resolutionwidth,
        this.resolutionheight
      )

      if (this.resolutionwidth >= 1280) {
        this.bandwidth = 1000
      } else if (this.resolutionwidth >= 720 && this.resolutionwidth < 1280) {
        this.bandwidth = 500
      } else {
        this.bandwidth = 100
      }

      if (this.enablevideo) {
        this.avTrackConstraint = {
          audio: {
            source: 'mic'
          },
          video: {
            resolution: this.localResolution,
            frameRate: 24,
            source: 'camera'
          }
        }
      } else {
        this.avTrackConstraint = {
          audio: {
            source: 'mic'
          },
          video: false
        }
      }
      console.log(this.avTrackConstraint)
      const _this = this
      createToken(this.roomId, this.localName, 'presenter', function(response) {
        console.log('==== createToken ====')
        let room
        if (!room) {
          room = new Owt.Conference.ConferenceClient()
          _this.room = room
          _this.addRoomEventListener()
        }
        console.log(_this.room)
        _this.room.join(response).then(
          (resp) => {
            _this.roomId = resp.id
            console.log('resp.participants')
            console.log(resp.participants)
            resp.participants.map(function(participant) {
              participant.addEventListener('left', () => {
                // TODO:send message for notice everyone the participant has left maybe no need
                _this.deleteUser(participant.id)
              })
              let local = false
              _this.localName === participant.userId
                ? (local = true)
                : (local = false)

              _this.users.push({
                id: participant.id,
                userId: participant.userId,
                role: participant.role,
                local,
                srcObject: null
              })
            })
            _this.createLocal()
            _this.streamObj = {}

            const streams = resp.remoteStreams
            for (const stream of streams) {
              if (
                stream.source.audio === 'mixed' &&
                stream.source.video === 'mixed'
              ) {
                console.log('Mix stream id: ' + stream.id)
                stream.addEventListener('layoutChanged', function(regions) {
                  console.info('stream', stream.id, 'VideoLayoutChanged')
                  this.currentRegions = regions
                })
              }
              console.info('stream in conference:', stream.id)
              _this.streamObj[stream.id] = stream

              const isMixStream = stream.source.audio === 'mixed'
              if (
                (_this.subscribeType === _this.SUBSCRIBETYPES.FORWARD &&
                  !isMixStream) ||
                (_this.subscribeType === _this.SUBSCRIBETYPES.MIX &&
                  isMixStream) ||
                stream.source.video === 'screen-cast'
              ) {
                _this.subscribeStream(stream)
              }
            }

            _this.refreshMuteState()
            console.log('==== END createToken END ====')
          },
          (err) => {
            console.log('server connect failed: ' + err)
            if (err.message.includes('connect_error:')) {
              const signalingHost = err.message.replace('connect_error:', '')
              _this.alertCert(signalingHost)
            }
          }
        )
      })
      console.log('==== END initConference END ====')
    },
    createLocal() {
      console.log('==== createLocal ====')
      const _this = this
      let mediaStream
      Owt.Base.MediaStreamFactory.createMediaStream(
        _this.avTrackConstraint
      ).then(
        (stream) => {
          mediaStream = stream
          _this.localStream = new Owt.Base.LocalStream(
            mediaStream,
            new Owt.Base.StreamSourceInfo('mic', 'camera')
          )
          _this.localId = _this.localStream.id
          console.log('this.localId: ' + _this.localId)
          console.log('this.localStream')
          console.log(_this.localStream)
          _this.addVideo(_this.localStream, true)

          _this.room.publish(_this.localStream).then(
            (publication) => {
              _this.localPublication = publication
              // _this.isPauseAudio = false
              // _this.toggleAudio()
              // _this.isPauseVideo = true
              // _this.toggleVideo()
              mixStream(_this.roomId, _this.localPublication.id, 'common')
              _this.streamObj[this.localStream.id] = _this.localStream
              publication.addEventListener('error', (err) => {
                console.log(
                  'createLocal: Publication error: ' + err.error.message
                )
              })
            },
            (err) => {
              console.log('createLocal: Publish error: ' + err)
            }
          )
        },
        (err) => {
          console.error('createLocal: Failed to create MediaStream, ' + err)
          if (err.name === 'OverconstrainedError') {
            // if (
            //   confirm(
            //     "your camrea can't support the resolution constraints, please leave room and select a lower resolution"
            //   )
            // ) {
            //   userExit()
            // }
            this.$buefy.snackbar.open({
              duration: 20000,
              message: `Your camrea can't support the resolution constraints, select a lower resolution?`,
              type: 'is-danger',
              position: 'is-bottom-left',
              actionText: 'Accept',
              queue: false,
              onAction: () => {
                // Need to exit user
                this.userExit()
                if (this.resolutionwidth === 1280) {
                  this.$store.commit('setResolutionWidth', 640)
                  this.$store.commit('setResolutionHeight', 480)
                } else if (this.resolutionwidth === 640) {
                  this.$store.commit('setResolutionWidth', 320)
                  this.$store.commit('setResolutionHeight', 240)
                }
                this.initConference()
              }
            })
          }
        }
      )
      console.log('==== END createLocal END ====')
    },
    alertCert(signalingHost) {
      console.log(signalingHost + ' TOTO: alertCert')
      // const $d = $('#m-dialog')
      // $d.empty()
      // const infoText =
      //   'The security certificate of the following url ' +
      //   "is not trusted by your computer's operating system. " +
      //   'If you confirm to continue, click the url and proceed to the unsafe host, then come back' +
      //   'to this page and refresh.'
      // const info = $('<div/>', {
      //   text: infoText
      // })
      // const anchor = $('<a/>', {
      //   text: `${signalingHost}/socket.io/`,
      //   target: '_blank',
      //   href: `${signalingHost}/socket.io/`
      // })
      // info.appendTo($d)
      // anchor.appendTo($d)
      // $d.show()
      // $d.dialog()
    },
    getUserFromName(name) {
      for (let i = 0; i < this.users.length; ++i) {
        if (this.users[i] && this.users[i].userId === name) {
          return this.users[i]
        }
      }
      return null
    },
    getUserFromId(id) {
      for (let i = 0; i < this.users.length; ++i) {
        if (this.users[i] && this.users[i].id === id) {
          return this.users[i]
        }
      }
      return null
    },
    deleteUser(id) {
      let index = 0
      for (let i = 0; i < this.users.length; ++i) {
        if (this.users[i] && this.users[i].id === id) {
          index = i
          break
        }
      }

      this.users.splice(index, 1)
      console.log(this.users)
      console.log('====== END deleteUser END ' + id + '=====')
    },
    toggleAudio() {
      if (!this.localPublication) {
        return
      }

      if (!this.isPauseAudio) {
        this.localPublication.mute(Owt.Base.TrackKind.AUDIO).then(
          () => {
            console.info('mute successfully')
            this.isPauseAudio = !this.isPauseAudio
          },
          (err) => {
            console.error('mute failed' + err)
          }
        )
      } else {
        this.localPublication.unmute(Owt.Base.TrackKind.AUDIO).then(
          () => {
            console.info('unmute successfully')
            this.isPauseAudio = !this.isPauseAudio
          },
          (err) => {
            console.error('unmute failed' + err)
          }
        )
      }
    },
    toggleVideo() {
      if (!this.localPublication || !this.enablevideo) {
        return
      }

      if (!this.isPauseVideo) {
        // TODO: pause all video?
        // remoteMixedSub.mute(Owt.Base.TrackKind.VIDEO);
        for (const temp in this.subList) {
          if (this.subList[temp] === this.screenSub) {
            continue
          }
          this.subList[temp].mute(Owt.Base.TrackKind.VIDEO)
        }
        this.localStream.mediaStream.getVideoTracks()[0].enabled = false
        this.localPublication.mute(Owt.Base.TrackKind.VIDEO).then(
          () => {
            console.info('mute video')
            this.isPauseVideo = !this.isPauseVideo
          },
          (err) => {
            console.error('mute video failed' + err)
          }
        )
      } else {
        // remoteMixedSub.unmute(Owt.Base.TrackKind.VIDEO);
        for (const temp in this.subList) {
          if (this.subList[temp] === this.screenSub) {
            continue
          }
          this.subList[temp].unmute(Owt.Base.TrackKind.VIDEO)
        }
        this.localStream.mediaStream.getVideoTracks()[0].enabled = true
        this.localPublication.unmute(Owt.Base.TrackKind.VIDEO).then(
          () => {
            console.info('unmute video')
            this.isPauseVideo = !this.isPauseVideo
          },
          (err) => {
            console.error('unmute video failed' + err)
          }
        )
      }
    },
    addVideo(stream, isLocal) {
      console.log('==== addVideo ====')
      console.log('this.localId: ' + this.localId)
      console.log('this.localName: ' + this.localName)
      console.log('this.users: ')
      console.log(this.users)
      const uid = stream.origin
      console.log(uid)

      // const id = stream.id
      // const uid = stream.origin

      // check if is screen sharing
      if (stream.source.video === 'screen-cast') {
        console.log('handling screen sharing')
      }

      if (stream.source.video !== 'screen-cast') {
        if (isLocal) {
          const newusers = this.users.map((p) =>
            p.local === true ? { ...p, srcObject: stream.mediaStream } : p
          )
          console.log('newusers')
          console.log(newusers)
          this.users = newusers
          console.log(this.users)
        }

        if (!isLocal) {
          console.log('$$$$$$$$$$$$$$$$$ ' + uid)
          if (uid) {
            const remoteusers = this.users.map((p) =>
              p.id === uid ? { ...p, srcObject: stream.mediaStream } : p
            )
            this.users = remoteusers
          }
        }

        // append to global users
        // const thisUser = this.getUserFromId(uid) || {}
        // thisUser.id = uid
        // console.log(thisUser)
        // const videoinfo = {}
        // videoinfo.id = uid
        // videoinfo.username = thisUser.userId
        // videoinfo.role = thisUser.role
        // if (stream.mediaStream) {
        //   videoinfo.srcObject = stream.mediaStream
        // } else {
        //   videoinfo.srcObject = null
        // }
        // if (isLocal) {
        //   this.localVideo.push(videoinfo)
        // } else {
        //   this.remoteVideo.push(videoinfo)
        // }
        // console.log('localVideo')
        // console.log(this.localVideo)
        // console.log('remoteVideo')
        // console.log(this.remoteVideo)
      }
      console.log('==== END addVideo END ====')
    },
    chgMutePic(clientId, muted) {
      console.log('TODO, change MutePic')
    },
    refreshMuteState() {
      this.refreshMute = setInterval(() => {
        getStreams(this.roomId, (streams) => {
          this.forwardStreamMap.clear()
          for (const stream of streams) {
            // console.log(stream);
            if (stream.type === 'forward') {
              this.forwardStreamMap.set(stream.id, stream)
              if (stream.media.audio) {
                const clientId = stream.info.owner
                const muted = stream.media.audio.status === 'inactive'
                this.chgMutePic(clientId, muted)
              }
            }
          }
        })
      }, 1000)
    },
    userExit() {
      if (this.localScreen) {
        this.localScreen.mediaStream.getTracks().forEach((track) => {
          track.stop()
        })
      }

      if (this.room) {
        this.room.leave()
      }

      this.users = []
      this.subList = {}
      this.streamObj = {}
      this.streamIndices = {}
      this.isAudioOnly = false
      clearInterval(this.refreshMute)
    },
    changeMode(newMode, enlargeElement) {
      if (this.localStream) {
        console.log('localStream changeMode' + newMode)
      }
      switch (newMode) {
        case this.MODES.GALAXY:
          this.mode = this.MODES.GALAXY
          break
        case this.MODES.MONITOR:
          this.mode = this.MODES.MONITOR
          break
        case this.MODES.LECTURE:
          this.mode = this.MODES.LECTURE
          break
        default:
          console.error('Illegal mode name')
      }

      console.log('TOTO changeto new model: ' + this.model)
      // update canvas size in all video panels
      // $('.player').trigger('resizeVideo')
      // setTimeout(resizeStream, 500, newMode)
    },
    subscribeStream(stream) {
      console.log('=====  subscribeStream(stream) =====')
      console.log('stream.id: ' + stream.id)
      this.room.subscribe(stream, { video: this.enablevideo }).then(
        (subscription) => {
          console.log(stream)
          const uid = stream.orgin
          console.log(uid)
          this.addVideo(stream, false)
          this.subList[subscription.id] = subscription
          this.streamObj[stream.id] = stream

          console.log(this.subList)

          if (stream.source.video === 'mixed') {
            this.remoteMixedSub = subscription
          }
          if (stream.source.video === 'screen-cast') {
            this.screenSub = subscription
            stream.addEventListener('ended', function(event) {
              this.changeMode(this.MODES.LECTURE)
              setTimeout(function() {
                // this.shareScreenChanged(false, false)
                this.changeMode(this.mode)
              }, 800)
            })
          }
          setTimeout(function() {
            subscription.getStats().then(
              (report) => {
                console.info(report)
                report.forEach(function(item, index) {
                  if (item.type === 'ssrc' && item.mediaType === 'video') {
                    this.scaleLevel =
                      parseInt(item.googFrameHeightReceived) /
                      parseInt(item.googFrameWidthReceived)
                    console.info(this.scaleLevel)
                  }
                })
                // this.resizeStream(this.mode)
              },
              (err) => {
                console.error('stats error: ' + err)
              }
            )
          }, 1000)
          // monitor(subscription);
        },
        (err) => {
          console.error('subscribe error: ' + err)
        }
      )
      console.log('===== END subscribeStream(stream) END =====')
    },
    sendIm(msg, sender) {
      console.log('sendIm: To DO, msg: ' + msg + ' ' + 'sender: ' + sender)
      // const time = new Date()
      // let hour = time.getHours()
      // hour = hour > 9 ? hour.toString() : '0' + hour.toString()
      // let mini = time.getMinutes()
      // mini = mini > 9 ? mini.toString() : '0' + mini.toString()
      // let sec = time.getSeconds()
      // sec = sec > 9 ? sec.toString() : '0' + sec.toString()
      // const timeStr = hour + ':' + mini + ':' + sec
      // if (msg === undefined) {
      //   // send local msg
      //   if ($('#text-send').val()) {
      //     msg = $('#text-send').val()
      //     const sendMsgInfo = JSON.stringify({
      //       type: 'msg',
      //       data: msg
      //     })
      //     $('#text-send')
      //       .val('')
      //       .height('18px')
      //     $('#text-content').css('bottom', '30px')
      //     sender = localId
      //     console.info('ready to send message')
      //     // send to server
      //     if (localName !== null) {
      //       room.send(sendMsgInfo).then(
      //         () => {
      //           console.info('begin to send message')
      //           console.info(localName + 'send message: ' + msg)
      //         },
      //         (err) => {
      //           console.error(localName + 'sned failed: ' + err)
      //         }
      //       )
      //     }
      //   } else {
      //     return
      //   }
      // }

      // const color = getColor(sender)
      // const user = getUserFromId(sender)
      // const name = user ? user['userId'] : 'System'
      // if (name !== 'System') {
      //   $('<p class="' + color + '">')
      //     .html(timeStr + ' ' + name + '<br />')
      //     .append(document.createTextNode(msg))
      //     .appendTo('#text-content')
      //   // scroll to bottom of text content
      //   $('#text-content').scrollTop($('#text-content').prop('scrollHeight'))
      // }
    },
    addRoomEventListener() {
      this.room.addEventListener('streamadded', (streamEvent) => {
        console.log('==== room.addEventListener streamadded ====')
        const stream = streamEvent.stream
        console.log('this.LocalStream')
        console.log(this.localStream)
        console.log(stream.id)
        if (this.localStream && this.localStream.id === stream.id) {
          return
        }

        console.log(stream.source.audio)
        console.log(stream.source.video)

        if (
          stream.source.audio === 'mixed' &&
          stream.source.video === 'mixed'
        ) {
          if (this.subscribeType !== this.SUBSCRIBETYPES.MIX) {
            return
          }
          // // subscribe mix stream
          this.thatName = 'MIX Stream'
        } else if (stream.source.video === 'screen-cast') {
          this.thatName = 'Screen Sharing'
          if (this.isLocalScreenSharing) {
            return
          }
        } else if (this.subscribeType !== this.SUBSCRIBETYPES.FORWARD) {
          return
        }

        const thatId = stream.id
        if (
          stream.source.audio === 'mixed' &&
          stream.source.video === 'mixed'
        ) {
          this.thatName = 'MIX Stream'
        } else if (stream.source.video === 'screen-cast') {
          this.thatName = 'Screen Sharing'
        }
        // add video of non-local streams
        if (this.getUserFromId(stream.origin)) {
          if (
            this.localId !== thatId &&
            this.localScreenId !== thatId &&
            this.localName !== this.getUserFromId(stream.origin).userId
          ) {
            this.subscribeStream(stream)
          }
        } else {
          this.subscribeStream(stream)
        }
      })
      this.room.addEventListener('participantjoined', (event) => {
        console.log('participantjoined', event)
        if (
          // Do not comment this line when ask colleagues to test in webnnteam
          // event.participant.userId !== 'user' &&
          this.getUserFromId(event.participant.id) === null
        ) {
          let local = false
          this.localName === event.participant.userId
            ? (local = true)
            : (local = false)

          this.users.push({
            id: event.participant.id,
            userId: event.participant.userId,
            role: event.participant.role,
            local,
            srcObject: null
          })

          event.participant.addEventListener('left', () => {
            if (
              event.participant.id !== null &&
              event.participant.userId !== undefined
            ) {
              this.sendIm(
                event.participant.userId + ' has left the room ',
                'System'
              )
              this.deleteUser(event.participant.id)
            } else {
              this.sendIm('Anonymous has left the room.', 'System')
            }
          })
          console.log('join user: ' + event.participant.userId)
          // no need: send message to all for initId
        }
      })

      this.room.addEventListener('messagereceived', (event) => {
        console.log('messagereceived', event)
        const user = this.getUserFromId(event.origin)
        if (!user) return
        const receivedMsg = JSON.parse(event.message)
        if (receivedMsg.type === 'msg') {
          if (receivedMsg.data !== undefined) {
            // const time = new Date()
            // let hour = time.getHours()
            // hour = hour > 9 ? hour.toString() : '0' + hour.toString()
            // let mini = time.getMinutes()
            // mini = mini > 9 ? mini.toString() : '0' + mini.toString()
            // let sec = time.getSeconds()
            // sec = sec > 9 ? sec.toString() : '0' + sec.toString()
            // const timeStr = hour + ':' + mini + ':' + sec
            // const color = getColor(user.userId)
            // $('<p class="' + color + '">')
            //   .html(timeStr + ' ' + user.userId + '<br />')
            //   .append(document.createTextNode(receivedMsg.data))
            //   .appendTo('#text-content')
            // $('#text-content').scrollTop(
            //   $('#text-content').prop('scrollHeight')
            // )
            console.log('messagereceived to do')
          }
        }
      })
    }
  }
}
</script>
<style scope>
video {
  width: 240px;
  height: 180px;
}

.user {
  display: block;
  height: 20px;
  position: relative;
  left: -50%;
  transform: translateX(-50%);
  bottom: -70%;
  color: rgba(255, 255, 255, 1);
}
</style>
