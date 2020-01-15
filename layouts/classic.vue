<template>
  <div class="columns">
    <div class="column is-one-fifth"><nuxt /></div>
    <div class="column"><Video /></div>
    <div class="column is-one-fifth">Auto</div>
  </div>
</template>

<script>
import Video from '~/components/Video.vue'
export default {
  head: {
    script: [
      { src: '../js/socket.io.js', defer: true },
      { src: '../js/adapter-7.0.0.js', defer: true },
      { src: '../js/owt.js', defer: true },
      { src: '../js/classic.js', defer: true },
      { src: '../js/rest.sample.js', defer: true }
    ]
  },
  components: {
    Video
  },
  data() {
    return {
      test: ''
    }
  }
}
</script>
<style scope>
body {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  text-shadow: 0px 0px 0px rgba(0, 0, 0, 0) !important;
  color: #333;
}

body::-webkit-scrollbar {
  display: none;
}

body::scrollbar {
  display: none;
}

.column {
  border: 1px solid red;
}
</style>
