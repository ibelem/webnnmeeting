<template>
  <div class="columns">
    <div class="column is-one-fifth">is-four-fifths</div>
    <div class="column"><nuxt /></div>
    <div class="column is-one-fifth">Auto</div>
  </div>
</template>

<script>
export default {
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
