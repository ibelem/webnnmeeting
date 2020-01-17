<template>
  <div class="video-panel">
    <video playsinline muted autoplay></video>
  </div>
</template>
<script>
import Owt from '~/assets/js/owt/owt'

export default {
  name: 'Video',
  data() {
    return {
      mode: 'galaxy',
      localResolution: '',
      bandwidth: 1000
    }
  },
  computed: {
    subscribetype() {
      return this.$store.state.subscribetype
    },
    resolutionwidth() {
      return this.$store.state.resolution.width
    },
    resolutionheight() {
      return this.$store.state.resolution.height
    },
    enablevideo() {
      return this.$store.state.enablevideo
    }
  },
  mounted() {
    this.initConference()
  },
  methods: {
    initConference() {
      this.localResolution = new Owt.Base.Resolution(
        this.resolutionwidth,
        this.resolutionheight
      )

      if (this.resolutionwidth >= 1280) {
        this.bandwidth = 1000
      } else if (this.resolutionwidth >= 720 && this.resolutionwidth < 1280) {
        this.bandwidth = 500
      } else {
        this.bandwidth = 100
      }

      let avTrackConstraint = {}
      if (this.enablevideo) {
        // TODO: maybe the room constraint,need to test a new room for more information
        avTrackConstraint = {
          audio: {
            source: 'mic'
          },
          video: {
            resolution: this.localResolution,
            frameRate: 24,
            source: 'camera'
          }
        }
      } else {
        avTrackConstraint = {
          audio: {
            source: 'mic'
          },
          video: false
        }
      }
      console.log(avTrackConstraint)
    }
  }
}
</script>
<style scope>
video {
  width: 640px;
  height: 480px;
}
</style>
