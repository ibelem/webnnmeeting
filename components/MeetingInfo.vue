<template>
  <div class="meetinginfo">
    <div>
      {{ usernumber }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'MeetingInfo',
  data() {
    return {
      usernumber: ''
    }
  },
  mounted() {
    this.fetchSomething()
  },
  methods: {
    async fetchSomething() {
      const ip = await this.$axios.$get(
        'https://webnnteam.sh.X.com:3004/rooms/5df9d3661b3282c0ef1a5ee3/participants'
      )
      this.usernumber = ip
    }
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
