<template>
  <div class="video-panel">
    <video playsinline muted autoplay></video>
  </div>
</template>
<script>
// import axios from 'axios'

export default {
  name: 'Video',
  data() {
    return {
      test: ''
    }
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>
<style scope>
video {
  width: 320px;
  height: 240px;
}
</style>
