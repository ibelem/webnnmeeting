export const state = () => ({
  server: {
    url: 'https://10.239.47.52:3004'
  },
  participants: {
    url: '/rooms/5df9d3661b3282c0ef1a5ee3/participants',
    number: 0
  },
  subscribe: 'forward'
})

export const mutations = {
  setParticipantsnumber(state, data) {
    state.participants.number = data
  }
}
