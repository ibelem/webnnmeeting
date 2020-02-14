<template>
  <div class="webnnbadge">
    <div v-if="webmlstatus" class="webnn-supported">
      Your browser supports Web Neural Network API.
    </div>
    <div v-else class="webnn-not-supported">
      Your browser doesn't support Web Neural Network API, machine learning
      features are disabled.
    </div>
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
.webnnbadge,
.webnnbadge div {
  display: inline-block;

  /* text-transform: uppercase; */
  padding: 0 8px;
  font-style: italic;
  font-size: 0.8rem;
  color: rgb(204, 255, 144);
}
</style>
