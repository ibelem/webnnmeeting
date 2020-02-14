// export const strict = false

export const state = () => ({
  participants: {
    number: 0
  },
  subscribetype: 'forward',
  mode: 'galaxy',
  resolution: {
    width: 1280,
    height: 720
  },
  enablevideo: true,
  users: [],
  layout: 'userbgimg'
})

export const mutations = {
  setParticipantsnumber(state, data) {
    state.participants.number = data
  },
  setSubscribeType(state, data) {
    state.subscribetype = data
  },
  setMode(state, data) {
    state.mode = data
  },
  setResolutionWidth(state, data) {
    state.resolution.width = data
  },
  setResolutionHeight(state, data) {
    state.resolution.height = data
  },
  setEnableVideo(state, data) {
    state.enablevideo = data
  },
  setUsers(state, data) {
    state.users = data
  },
  setLayout(state, data) {
    state.layout = data
  }
}
