<template>
  <div>
    <div class="columns user">
      <div
        v-show="showparticipants || showconversation"
        class="column cl nopadding is-one-fifth"
      >
        <div id="layoutparticipants" v-show="showparticipants">
          <div class="isleft pd">PARTICIPANTS</div>
          <div class="isleft pd2">
            Presenters ({{ this.$store.state.participants.number }})
          </div>

          <div class="userlist">
            <div v-for="u in users" class="columns">
              <div class="column ull isleft is-three-quarters">
                <b-icon class="ulicon" icon="account" size="is-small"> </b-icon>
                <span class="ulu">{{ u.userId }}</span>
              </div>
              <div class="column ulr">
                <b-icon v-if="u.video" icon="video" size="is-small"> </b-icon>
                <b-icon v-else icon="video-off" size="is-small"> </b-icon>
                <b-icon v-if="u.muted" icon="microphone-off" size="is-small">
                </b-icon>
                <b-icon v-else icon="microphone-high" size="is-small"> </b-icon>
                <b-icon icon="projector-screen" size="is-small"> </b-icon>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="showparticipants && showconversation"
          class="issplit"
        ></div>
        <div id="layoutconversation" v-show="showconversation">
          <div class="isleft pd">CONVERSATION</div>
          <div class="conversation">
            <div class="cslist">
              Conversation List
            </div>
            <b-field>
              <b-input placeholder="..." type="text"></b-input>
              <b-button icon-left="send"> </b-button>
            </b-field>
          </div>
        </div>
      </div>
      <div class="column columncenter">
        <div class="videos">
          <div v-show="localuser.srcObject" class="videoset">
            <canvas id="localcanvas" ref="localcanvas"></canvas>
            <div class="user">{{ localuser.userId }} CANVAS</div>
          </div>
          <div v-show="localuser.srcObject" class="videoset">
            <video
              id="localvideo"
              ref="localvideo"
              :src-object.prop.camel="localuser.srcObject"
              playsinline
              autoplay
            ></video>
            <div class="user">{{ localuser.userId }} VIDEO</div>
          </div>
          <div
            v-show="users.length > 0 && u.srcObject && !u.local"
            v-for="u in users"
            class="videoset"
          >
            <video
              v-show="u.srcObject && !u.local"
              :src-object.prop.camel="u.srcObject"
              playsinline
              autoplay
            ></video>
            <div v-show="u.srcObject && !u.local" class="user">
              {{ u.userId }}
            </div>
          </div>
        </div>
        <div class="videocontrol">
          <div v-show="showaimenu" class="videocontrolai">
            <b-button v-if="this.$store.state.supportwenmm" icon-left="blur"
              >Blur background</b-button
            >
            <b-button v-else icon-left="blur" disabled
              >Blur background</b-button
            >
            <b-button
              v-if="this.$store.state.supportwenmm"
              icon-left="image-multiple"
              >Change background</b-button
            >
            <b-button v-else icon-left="image-multiple" disabled
              >Change background</b-button
            >
            <b-button icon-left="fullscreen">Enter full screen</b-button>
          </div>
          <b-button class="date"><Clock /></b-button>
          <b-button icon-left="video"></b-button>
          <b-button icon-left="microphone"></b-button>
          <b-button icon-left="projector-screen"></b-button>
          <b-button @click="showAiMenu" icon-left="dots-horizontal"></b-button>
          <b-button
            @click="toggleConversation"
            icon-left="message-reply-text"
          ></b-button>
          <b-button
            @click="toggleParticipants"
            icon-left="account-group"
          ></b-button>
          <b-button @click="leaveMeeting" icon-left="phone-hangup"></b-button>
        </div>
      </div>
      <div class="column is-one-fifth">
        {{ mode }}
        <div class="home-center">{{ $route.params.user }}</div>
        <MeetingInfo />
        <div>
          {{ showfps }}<br />
          {{ subscribeType }}<br />
          EnableVideo: {{ enablevideo }}<br />
          {{ resolutionwidth }} x {{ resolutionheight }} <br />
        </div>
        <div>{{ users }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Owt from '~/assets/js/owt/owt'
import { Stats, fps } from '~/assets/js/fps'
import { mixStream, createToken, getStreams } from '~/assets/js/rest'
import MeetingInfo from '~/components/MeetingInfo.vue'
import Clock from '~/components/Clock.vue'

export default {
  name: 'User',
  // middleware: 'layout',
  layout: ({ dynamiclayout }) => {
    return dynamiclayout
  },
  // layout: 'classic',
  // layout: 'userbgimg',
  components: {
    MeetingInfo,
    Clock
  },
  data() {
    return {
      showfps: 0,
      timer: null,
      stats: null,
      ctx: null,
      showparticipants: false,
      showconversation: false,
      showaimenu: false,
      conversation: {},
      thatName: '',
      bandwidth: 1000,
      avTrackConstraint: {},
      localStream: null,
      localScreen: null,
      localName: 'Anonymous',
      localId: null,
      localScreenId: null,
      users: [],
      localuser: {
        id: null,
        userId: null,
        role: null,
        local: null,
        muted: null,
        srcObject: null
      },
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
    showparticipantsandconversation() {
      return this.showparticipants && this.showconversation
    },
    subscribeType() {
      return this.$route.query.t
      // return this.$store.state.subscribetype
    },
    resolutionwidth() {
      let w
      switch (this.$route.query.r) {
        case '0':
          w = 320
          break
        case '1':
          w = 640
          break
        case '2':
          w = 1280
          break
        default:
          w = 1280
      }
      return w
    },
    resolutionheight() {
      let h
      switch (this.$route.query.r) {
        case '0':
          h = 240
          break
        case '1':
          h = 480
          break
        case '2':
          h = 720
          break
        default:
          h = 720
      }
      return h
    },
    enablevideo() {
      if (this.$route.query.v === '0') {
        return false
      } else {
        return true
      }
      // return this.$store.state.enablevideo
    },
    srcobject(mediasource) {
      return mediasource
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  mounted() {
    this.userExit()
    this.initStats()
    this.initConference()
    // this.$nextTick(() => {
    //   this.videoToCanvas()
    // })
    this.videoToCanvas()
  },
  created() {
    if (process.browser) {
      addEventListener('beforeunload', this.userExit, false)
    }
  },
  // destroyed() {
  //   this.userExit()
  // },
  methods: {
    videoToCanvas() {
      console.log(this.$refs)
      console.log(this.$refs.localcanvas)
      console.log(this.$refs.localvideo)
      this.ctx = this.$refs.localcanvas.getContext('2d')
      this.ctx.imageSmoothingQuality = 'high'
      this.ctx.imageSmoothingEnabled = true
      this.animate()
      // let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
    },
    animate() {
      const localcanvas = this.$refs.localcanvas
      const localvideo = this.$refs.localvideo

      try {
        localcanvas.width = localvideo.offsetWidth
        localcanvas.height = localvideo.offsetHeight
        this.stats.begin()
        this.ctx.drawImage(
          localvideo,
          0,
          0,
          localcanvas.width,
          localcanvas.height
        )
        this.showfps = fps
        this.stats.end()
        this.timer = requestAnimationFrame(this.animate)
      } catch (err) {
        console.log(err)
      }
    },
    stopAnimate() {
      cancelAnimationFrame(this.timer)
    },
    initStats() {
      this.stats = new Stats()
    },
    setUsers() {
      this.$store.commit('setUsers', this.users)
    },
    leaveMeeting() {
      this.userExit()
      // this.$router.push({ name: 'index' })
      location.href = '../../'
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
        this.isAudioOnly = true
      }
      console.log(this.enablevideo)
      console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
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
                muted: true,
                srcObject: null
              })
              _this.localuser.id = participant.id
              _this.localuser.userId = participant.userId
              _this.localuser.role = participant.role
              _this.localuser.local = local
              _this.localuser.muted = true
              _this.localuser.srcObject = null
              // _this.setUsers()
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
      if (!this.localPublication || this.isAudioOnly) {
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
          this.localuser.srcObject = stream.mediaStream

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
      console.log(
        'TODO, change MutePic -----------------' + clientId + ' muted: ' + muted
      )
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
        try {
          this.room.leave()
        } catch (ex) {
          console.log('>>>>>>>>>>>>> room.leave error: ' + ex)
        }
      }

      this.users = []
      this.subList = {}
      this.streamObj = {}
      this.streamIndices = {}
      this.localStream = null
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

      console.log('TOTO change to new model: ' + this.model)
      // update canvas size in all video panels
      // $('.player').trigger('resizeVideo')
      // setTimeout(resizeStream, 500, newMode)
    },
    subscribeStream(stream) {
      console.log('=====  subscribeStream(stream) =====')
      console.log('stream.id: ' + stream.id)
      const videoOption = !this.isAudioOnly
      this.room.subscribe(stream, { video: videoOption }).then(
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
            // video: event.participant.permission.publish.video,
            muted: true,
            srcObject: null
          })

          // this.setUsers()
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
    },
    showAiMenu() {
      if (!this.showaimenu) {
        this.showaimenu = true
      } else {
        this.showaimenu = false
      }
    },
    toggleParticipants() {
      this.showparticipants = !this.showparticipants
    },
    toggleConversation() {
      this.showconversation = !this.showconversation
    }
  }
}
</script>
<style scope>
body {
  background: transparent;
}

.content {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh !important;
  margin-top: 0rem;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}

.videoset {
  display: inline-block;
  margin-bottom: -13px;
  width: calc(100% / 4);
  overflow: hidden;
}

video {
  width: 100%;
}

.videoset .user {
  position: relative;
  text-align: center;
  top: -7px;
  padding: 4px 0.75rem;
  margin-top: -20px;
  font-size: 0.6rem;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.videoset .user:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.columncenter {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  border-right: 0px;
  padding: 0px;
  text-align: left;
  min-height: 60vh;
}

.cl {
  border-right: 0px;
}

.indicator {
  height: 60px;
  width: 100%;
}
</style>
