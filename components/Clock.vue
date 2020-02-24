<template>
  <span id="clock">
    <span>{{ clock }}</span>
    :
    <span class="mill">{{ mill }}</span>
  </span>
</template>

<script>
export default {
  data() {
    return {
      clock: new Date(),
      mill: 0
    }
  },
  mounted() {
    setInterval(() => {
      const d = new Date()
      this.clock = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      this.mill = d.getMilliseconds()
    }, 1)
  }
}
</script>

<style scope>
.mill {
  width: 24px;
  display: inline-block;
}
</style>
