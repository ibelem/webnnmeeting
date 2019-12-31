<template>
  <div class="webnnbadge">
    <span v-if="webmlstatus" class="webnn-supported">
      Supported
    </span>
    <span v-else class="webnn-not-supported">
      Not Supported
    </span>
  </div>
</template>
<script>
export default {
  name: 'WebNNBadge',
  data() {
    return {
      webmlstatus: false
    }
  },
  mounted() {
    setTimeout(this.updateWebNNStatus, 100)
  },
  methods: {
    updateWebNNStatus() {
      if (navigator.ml && navigator.ml.getNeuralNetworkContext()) {
        this.webmlstatus = true
      } else {
        this.webmlstatus = false
      }
    }
  },
  destoryed() {
    clearTimeout(this.updateWebMLStatus)
  }
}
</script>
<style>
.webnnbadge {
  display: inline-block;
  text-transform: uppercase;
}

.webnn-supported {
  background-color: rgb(204, 255, 144);
}

.webnn-not-supported {
  background-color: rgb(255, 144, 204);
}
</style>
