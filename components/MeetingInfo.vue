<template>
  <div class="meetinginfo">
    <div v-if="this.participantsnumber > 1">
      {{ this.participantsnumber }} participants online
    </div>
    <div v-else>{{ this.participantsnumber }} participant online</div>

    <div v-if="this.participantsnumber >0" id="flips">
      {{ this.participantsname }}
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import config from '../config'

export default {
  name: 'MeetingInfo',
  data() {
    return {
      participantsnumber: 0,
      participantsname: []
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
    }, 3000)
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
      this.participantsnumber = Object.keys(res.data).length
      this.participantsname = res.data.map((d)=> { return d.user })
      this.$store.commit('setParticipantsnumber', this.participantsnumber)
      this.$store.commit('setParticipantsname', this.participantsname)
    }
  },
  destoryed() {
    clearTimeout(this.fetchParticipant)
  }
}
</script>
<style scope>
.meetinginfo {
  margin-top: 2.5rem;
}

.meetinginfo,
.meetinginfo div {
  display: inline-block;
  padding: 0 8px;
}
</style>
