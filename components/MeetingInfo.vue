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

export default {
  name: 'MeetingInfo',
  data() {
    return {
      test: ''
    }
  },
  computed: {
    participantsNumber() {
      return this.$store.state.participantsnumber
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
        this.$store.state.serverurl + this.$store.state.participantsurl
      const res = await axios.get(url)
      const participantsnumber = Object.keys(res.data).length - 1
      console.log(participantsnumber)
      this.$store.commit('setParticipantsnumber', participantsnumber)
    }
  },
  destoryed() {
    clearTimeout(this.fetchParticipant)
  }
}
</script>
<style>
.meetinginfo,
.meetinginfo div {
  display: inline-block;
  padding: 0 8px;
}
</style>
