<template>
  <section class="section">
    <div class="home-center">{{ $route.params.user }}</div>
    <section class="section">
      <MeetingInfo />
      <div>
        {{ this.$store.state.subscribetype }}<br />
        {{ this.$store.state.enablevideo }}<br />
        {{ this.$store.state.resolution }}<br />
      </div>
    </section>
  </section>
</template>

<script>
import MeetingInfo from '~/components/MeetingInfo.vue'
export default {
  name: 'User',
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
