import config from '~/config'
import Owt from '~/assets/js/owt/owt'
import { Stats, fps } from '~/assets/js/fps'
import {
  deleteStream,
  mixStream,
  createToken,
  getStreams
} from '~/assets/js/rest'
import getTime from '~/assets/js/user/time'
import {
  baseRunner,
  semanticSegmentationRunner
} from '~/assets/js/webnn/util/runner'
import Renderer from '~/assets/js/webnn/webgl/DrawOutputs'
import Control from '~/components/Control.vue'
import MeetingInfo from '~/components/MeetingInfo.vue'

export default {
  name: 'User',
  // middleware: 'layout',
  layout: ({ dynamiclayout }) => {
    return dynamiclayout
  },
  // layout: 'classic',
  // layout: 'userbgimg',
  components: {
    Control,
    MeetingInfo
  },
  data() {
    return {
      localfullscreen: false,
      videofullscreen: -1,
      ssbgimg: [
        '../../img/ssbg/00.jpg',
        '../../img/ssbg/01.jpg',
        '../../img/ssbg/02.jpg',
        '../../img/ssbg/03.jpg',
        '../../img/ssbg/04.jpg',
        '../../img/ssbg/05.jpg'
      ],
      defaultbgimg: '../../img/ssbg/04.jpg',
      isblur: false,
      isbgimg: false,
      showrightsidebar: false,
      showparticipants: false,
      showconversation: false,
      baserunner: null,
      runner: null,
      ssmode: false,
      videostream: null,
      ssstream: null,
      sstimer: null,
      sspublishtimer: null,
      inferencetime: null,
      renderer: null,
      progress: 0,
      blurdone: false,
      bgimgdone: false,
      loadedsize: 0,
      totalsize: 0,
      textmsg: null,
      textmsgs: [],
      showfps: 0,
      timer: null,
      stats: null,
      ctx: null,
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
    isFullscreen() {
      if (this.localfullscreen === true || this.videofullscreen !== -1) {
        this.$store.commit('setFullscreen', true)
        return true
      } else {
        this.$store.commit('setFullscreen', false)
        return false
      }
    },
    showparticipantsandconversation() {
      return this.showparticipants && this.showconversation
    },
    backend() {
      return this.$route.query.b
    },
    prefer() {
      return this.$route.query.p
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
    // if (this.sstimer) {
    //   clearTimeout(this.sstimer)
    // }
  },
  mounted() {
    this.scrollToBottom()
    this.userExit()
    this.initStats()
    this.initConference()
  },
  created() {
    if (process.browser) {
      addEventListener('beforeunload', this.userExit, false)
    }
  },
  updated() {
    this.scrollToBottom()
  },
  // destroyed() {
  //   this.userExit()
  // },
  methods: {
    snackbar(msg) {
      this.$buefy.snackbar.open({
        duration: 5000,
        message: msg,
        type: 'is-twitter',
        position: 'is-bottom-right',
        actionText: 'OK',
        queue: false
      })
    },
    fullscreen() {
      if (!this.isFullscreen) {
        const doc = window.document
        const docEl = doc.body

        const requestFullScreen = docEl.requestFullscreen
        const cancelFullScreen = doc.exitFullscreen

        if (!doc.fullscreenElement) {
          requestFullScreen.call(docEl)
        } else {
          cancelFullScreen.call(doc)
        }
      }
    },
    exitFullScreen() {
      const doc = window.document
      const cancelFullScreen = doc.exitFullscreen
      cancelFullScreen.call(doc)
      this.localfullscreen = false
      this.videofullscreen = -1
    },
    localFullscreen() {
      this.fullscreen()
      this.localfullscreen = true
      this.videofullscreen = -1
    },
    videoFullscreen(index) {
      this.fullscreen()
      this.localfullscreen = false
      this.videofullscreen = index
    },
    closeRightSideBar() {
      this.showrightsidebar = false
    },
    selectImg(event) {
      console.log(event.target)
      this.renderer.backgroundImageSource = event.target
    },
    updateProgress(ev) {
      if (ev.lengthComputable) {
        this.totalsize = ev.total / (1000 * 1000)
        this.totalsize = this.totalsize.toFixed(1)
        this.loadedsize = ev.loaded / (1000 * 1000)
        this.loadedsize = this.loadedsize.toFixed(1)
        this.progress = (ev.loaded / ev.total) * 100
        this.progress = Number(this.progress.toFixed(0))
        // this.updateLoadingComponent(loadedSize.toFixed(1), totalSize.toFixed(1), percentComplete);
      }
    },
    initRenderer(effect) {
      this.renderer = new Renderer(this.$refs.sscanvas)
      this.renderer.refineEdgeRadius = 10
      this.renderer.blurRadius = 10
      this.renderer.effect = effect
      this.renderer.setup()
    },
    updateSSBackground() {
      const files = this.$refs.bgimg.files
      console.log(files)
      if (files.length > 0) {
        const img = new Image()
        img.onload = () => {
          this.renderer.backgroundImageSource = img
        }
        img.src = URL.createObjectURL(files[0])
      } else {
        this.renderer.backgroundImageSource = this.$refs.defaultbgimg
      }
    },
    getClippedSize(source) {
      const width = config.semanticsegmentation.inputSize[0]
      const imWidth = source.naturalWidth | source.videoWidth
      const imHeight = source.naturalHeight | source.videoHeight
      const resizeRatio = Math.max(Math.max(imWidth, imHeight) / width, 1)
      const scaledWidth = Math.floor(imWidth / resizeRatio)
      const scaledHeight = Math.floor(imHeight / resizeRatio)
      return [scaledWidth, scaledHeight]
    },
    async drawResultComponents(data, source) {
      this.renderer.uploadNewTexture(source, this.getClippedSize(source))
      await this.renderer.drawOutputs(data)
    },
    initRunner() {
      // eslint-disable-next-line new-cap
      this.baserunner = new baseRunner(
        config.semanticsegmentation,
        this.updateProgress
      )
      // eslint-disable-next-line new-cap
      this.runner = new semanticSegmentationRunner(
        config.semanticsegmentation,
        this.updateProgress
      )
    },
    getSSStream() {
      this.ssstream = this.$refs.sscanvas.captureStream()
      const audiotrack = this.videostream.getTracks().filter((track) => {
        return track.kind === 'audio'
      })[0]
      this.ssstream.addTrack(audiotrack)
    },
    // showSSStream() {
    //   // this.ssstream = this.renderer.canvasStream
    //   this.getSSStream()
    //   this.$refs.ssvideo.srcObject = this.ssstream
    // },
    async handleInferencedResult(result, source) {
      const showInferenceTime = (time) => {
        try {
          this.inferencetime = time.toFixed(2)
          console.log(`Inference time: ${this.inferencetime} ms`)
        } catch (e) {
          console.log(e)
        }
      }
      try {
        showInferenceTime(result.time)
        this.stats.begin()
        await this.drawResultComponents(result.drawData, source)
        this.showfps = fps
        this.stats.end()
      } catch (e) {
        console.log(e)
      }
    },
    async runPredict(source) {
      // const inputSize = config.semanticsegmentation.inputSize
      const options = {
        inputSize: config.semanticsegmentation.inputSize,
        preOptions: config.semanticsegmentation.preOptions || {},
        imageChannels: 4, // RGBA
        drawWH: this.getClippedSize(source)
      }
      const ret = await this.runner.predict(source, options)
      return ret
    },
    async startPredictCamera() {
      const ret = await this.runPredict(this.$refs.localvideo)
      await this.handleInferencedResult(ret, this.$refs.localvideo)
      // this.sstimer = requestAnimationFrame(this.startPredictCamera)
      // not using nAF because that limites us to 60FPS
      this.sstimer = setTimeout(this.startPredictCamera, 0)
    },
    async stopSS() {
      this.ssmode = false
      this.blurdone = false
      this.bgimgdone = false
      try {
        this.ssstream = this.videostream
        deleteStream(this.roomId, this.localPublication.id)
        await this.publishLocal()
        // updateStream(this.roomId, this.localPublication.id)
        // cancelAnimationFrame(this.sstimer)
        // clearTimeout(this.sstimer)
        this.baserunner.deleteAll()
      } catch (e) {}
    },
    async ss(effect) {
      this.bgimgdone = false
      this.blurdone = false
      // this.progress = 0
      this.initRunner()
      if (this.runner) {
        await this.initRenderer(effect)
        await this.runner.loadModel()
        // await this.runner.initModel('WebML', 'sustained')
        if (this.backend === 'webml') {
          this.backend = 'WebML'
        }
        await this.runner.initModel(this.backend, this.prefer)
        // this.showSSStream()
        this.ssmode = true
        this.getSSStream()
        if (effect === 'blur') {
          this.blurdone = true
        }
        if (effect === 'image') {
          this.bgimgdone = true
          this.renderer.backgroundImageSource = this.$refs.defaultbgimg
        }
        await this.startPredictCamera()
        deleteStream(this.roomId, this.localPublication.id)
        await this.publishLocal()
        // updateStream(this.roomId, this.localPublication.id)
      }
    },
    initStats() {
      this.stats = new Stats()
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
              _this.snackbar(signalingHost)
            }
          }
        )
      })
      console.log('==== END initConference END ====')
    },
    async publishLocal() {
      console.log('===== publishLocal =====')
      this.localStream = new Owt.Base.LocalStream(
        this.ssstream,
        new Owt.Base.StreamSourceInfo('mic', 'camera')
      )

      const publication = await this.room.publish(this.localStream)
      this.localPublication = publication
      this.isPauseAudio = false
      this.toggleAudio()
      this.isPauseVideo = true
      this.toggleVideo()
      mixStream(this.roomId, this.localPublication.id, 'common')
      this.streamObj[this.localStream.id] = this.localStream
      publication.addEventListener('error', (err) => {
        // console.log('createLocal: Publication error: ' + err.error.message)
        this.snackbar(err.error.message)
      })

      // this.room.publish(this.localStream).then(
      //   (publication) => {
      //     this.localPublication = publication
      //     // this.isPauseAudio = false
      //     // this.toggleAudio()
      //     // this.isPauseVideo = true
      //     // this.toggleVideo()
      //     mixStream(this.roomId, this.localPublication.id, 'common')
      //     this.streamObj[this.localStream.id] = this.localStream
      //     publication.addEventListener('error', (err) => {
      //       console.log(
      //         'createLocal: Publication error: ' + err.error.message
      //       )
      //     })
      //   },
      //   (err) => {
      //     console.log('createLocal: Publish error: ' + err)
      //   }
      // )
    },
    async createLocal() {
      console.log('==== createLocal ====')

      try {
        const stream = await Owt.Base.MediaStreamFactory.createMediaStream(
          this.avTrackConstraint
        )

        this.videostream = stream
        this.ssstream = this.videostream

        this.localStream = new Owt.Base.LocalStream(
          this.ssstream,
          new Owt.Base.StreamSourceInfo('mic', 'camera')
        )

        this.localId = this.localStream.id
        this.addVideo(this.localStream, true)

        await this.publishLocal()
      } catch (ex) {
        if (ex.name === 'NotFoundError') {
          this.$buefy.snackbar.open({
            duration: 10000,
            message: `No camera detected, please check your camera settings and rejoin the meeting.`,
            type: 'is-twitter',
            position: 'is-bottom-right',
            actionText: 'OK',
            queue: false,
            onAction: () => {
              this.leaveMeeting()
            }
          })
        }

        if (ex.name === 'OverconstrainedError') {
          this.$buefy.snackbar.open({
            duration: 20000,
            message: `Your camera can't support the resolution constraints. Please select a lower resolution or check if the camera is occupied by other applications.`,
            type: 'is-twitter',
            position: 'is-bottom-right',
            actionText: 'Accept',
            queue: false,
            onAction: () => {
              this.leaveMeeting()
            }
          })
        }
      }

      // Todo Better Try ... Catch ... for await
      console.log('==== END createLocal END ====')
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
      const uid = stream.origin
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
          this.localuser.srcObject = this.ssstream
          this.users = newusers
        }

        if (!isLocal) {
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
    editMute(users, id, newnuted) {
      return users.map((item) => {
        const temp = Object.assign({}, item)
        if (temp.id === id) {
          temp.muted = newnuted
        }
        return temp
      })
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
                // eslint-disable-next-line no-unused-vars
                const clientId = stream.info.owner
                // eslint-disable-next-line no-unused-vars
                const ismuted = stream.media.audio.status === 'inactive'
                // this.users.map((p) => {
                //   p.id === clientId ? (p.muted = ismuted) : p
                // })

                this.users = this.editMute(this.users, clientId, ismuted)

                console.log(clientId)
                console.log(ismuted)
                console.log(this.users[0])
              }
            }
          }
        })
      }, 4000)
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
      if (this.textmsg) {
        const sendMsgInfo = JSON.stringify({
          type: 'msg',
          data: this.textmsg
        })
        sender = this.localId
        console.log(sender)
        console.info('ready to send message')
        if (this.localName !== null) {
          this.room.send(sendMsgInfo).then(
            () => {
              console.info('begin to send message')
              console.info(this.localName + ' send message: ' + msg)
            },
            (err) => {
              console.error(this.localName + ' send failed: ' + err)
            }
          )
        }
      } else {
        console.log('sendIm: no message')
      }
    },
    addRoomEventListener() {
      this.room.addEventListener('streamadded', (streamEvent) => {
        console.log('==== room.addEventListener streamadded ====')
        const stream = streamEvent.stream
        if (this.localStream && this.localStream.id === stream.id) {
          return
        }

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
            const msg = {
              time: getTime(),
              user: user.userId,
              message: receivedMsg.data
            }
            this.textmsgs.push(msg)
            console.log('messagereceived')
          }
        }
      })
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const conversation = this.$refs.conversation
        const userlist = this.$refs.userlist
        conversation.scrollTop = conversation.scrollHeight
        userlist.scrollTop = userlist.scrollHeight
      })
    }
  }
}
