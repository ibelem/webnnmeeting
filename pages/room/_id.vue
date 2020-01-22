<template>
  <section class="section">
    <div class="home-center">{{ $route.params.id }}</div>
    <section class="section">
      <MeetingInfo />
      <div>
        {{ this.$store.state.subscribetype }}<br />
        {{ this.$store.state.enablevideo }}<br />
        {{ this.$store.state.resolution }}<br />
      </div>
      <div>{{ this.$store.state.users }}</div>
    </section>
  </section>
</template>

<script>
import MeetingInfo from '~/components/MeetingInfo.vue'
export default {
  name: 'Room',
  layout: 'classic',
  components: {
    MeetingInfo
  },
  data() {
    return {
      test: ''
    }
  },
  computed: {},
  methods: {}
}
</script>
<style scope></style>
