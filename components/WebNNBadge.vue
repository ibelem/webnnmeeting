<template>
  <div class="webnnbadge">
    <div v-if="webmlstatus" class="webnn-supported">
      Supported
    </div>
    <div v-else class="webnn-not-supported">
      Not Supported
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
}

.webnn-supported {
  background-color: #4ec7f3;
}

.webnn-supported:hover {
  background-color: #3eb7e3;
}

.webnn-not-supported {
  background-color: #dc143c;
}

.webnn-not-supported:hover {
  background-color: #cc042c;
}
</style>
