<template>
  <div class="meetinginfo">
    <div v-if="participantsNumber > 1">
      {{ participantsNumber }} participants online
    </div>
    <div v-else>{{ participantsNumber }} participant online</div>
  </div>
</template>
<script>
import axios from 'axios'
import config from '../config'

export default {
  name: 'MeetingInfo',
  data() {
    return {
      test: ''
    }
  },
  computed: {
    participantsNumber() {
      return this.$store.state.participants.number
    }
  },
  mounted() {
    this.fetchParticipant()

    // will try websocket in the future
    setInterval(() => {
      this.fetchParticipant()
    }, 5000)
  },
  methods: {
    async fetchParticipant() {
      const url =
        'https://' +
        location.host.split(':')[0] +
        ':' +
        config.restapiserver.httpsport +
        config.restapiserver.sampleroomparticipantspath
      const res = await axios.get(url)
      const participantsnumber = Object.keys(res.data).length
      console.log(participantsnumber)
      this.$store.commit('setParticipantsnumber', participantsnumber)
    }
  },
  destoryed() {
    clearTimeout(this.fetchParticipant)
  }
}
</script>
<style scope>
.meetinginfo,
.meetinginfo div {
  display: inline-block;
  padding: 0 8px;
}
</style>
