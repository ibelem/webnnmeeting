<template>
  <span id="clock">{{ this.clock }}:<span class="mill">{{ mill }}</span></span>
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
    this.timer = setInterval(() => {
      const d = new Date()
      this.clock = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
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
