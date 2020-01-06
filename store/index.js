export const state = () => ({
  serverurl: 'https://webnnteam.sh.x.com:3004',
  participantsurl: '/rooms/5df9d3661b3282c0ef1a5ee3/participants',
  participantsnumber: 0
})

export const mutations = {
  setParticipantsnumber(state, participantsnumber) {
    state.participantsnumber = participantsnumber
  }
}
