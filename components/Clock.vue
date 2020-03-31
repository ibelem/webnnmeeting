<template>
  <div class="clock">
    <span>{{ clock }}</span>
    <span class="mill">{{ mill }}</span>
  </div>
</template>

<script>
import getTime from '~/assets/js/user/time'
export default {
  data() {
    return {
      clock: null,
      mill: 0
    }
  },
  mounted() {
    setInterval(() => {
      const d = new Date()
      this.clock = getTime() + ':'
      this.mill = d.getMilliseconds()
    }, 1)
  }
}
</script>

<style scope>
.mill {
  width: 24px;
  display: inline-block;
  text-align: left;
  margin-left: -3px;
}

.clock {
  display: inline-block;
}
</style>
