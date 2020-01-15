let localStream = null
let localScreen = null
let localName = 'Anonymous'
let localId = null
let localScreenId = null
let users = []
let progressTimeOut = null
let smallRadius = 60
let largeRadius = 120
let isMouseDown = false
let mouseX = null
let mouseY = null
let MODES = {
  GALAXY: 'galaxy',
  MONITOR: 'monitor',
  LECTURE: 'lecture'
}
let mode = MODES.GALAXY
let SUBSCRIBETYPES = {
  FORWARD: 'forward',
  MIX: 'mix'
}
let subscribeType = SUBSCRIBETYPES.FORWARD
let isScreenSharing = false
let isLocalScreenSharing = false
let remoteScreen = null
let remoteScreenName = null
let isMobile = false
let streamObj = {}
let streamIndices = {}
let hasMixed = false
let isSmall = false
let isPauseAudio = true
let isPauseVideo = false
let isOriginal = true
let isAudioOnly = false

let showInfo = null
let showLevel = null
let scaleLevel = 3 / 4
let refreshMute = null

let currentRegions = null

let localPublication = null
let localScreenPubliction = null
let joinResponse = null

let localResolution = null
let remoteMixedSub = null
let subList = {}
let screenSub = null

let room = null
let roomId = null

const remoteStreamMap = new Map()
const forwardStreamMap = new Map()

const initConference = () => {
  if (true) {
    subscribeType = SUBSCRIBETYPES.MIX
    mode = MODES.LECTURE
  } else {
    subscribeType = SUBSCRIBETYPES.FORWARD
    mode = MODES.GALAXY
  }

  console.log('Logged in as: ' + localName)

  let bandWidth = 1000
  localResolution = new Owt.Base.Resolution(1280, 720)

  let avTrackConstraint = {}
  if (true) {
    avTrackConstraint = {
      audio: {
        source: 'mic'
      },
      video: {
        resolution: localResolution,
        frameRate: 24,
        source: 'camera'
      }
    }
    console.log(avTrackConstraint)
  } else {
    avTrackConstraint = {
      audio: {
        source: 'mic'
      },
      video: false
    }
    isAudioOnly = true
  }
}
