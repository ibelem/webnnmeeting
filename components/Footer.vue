<template>
  <div class="hero-foot">
    <div class="container has-text-centered section">
      <div><WebNNBadge /></div>
      <div class="footerbrackets brackets">
        <a
          href="https://intel.github.io/webml-polyfill/examples/"
          title="Web Neural Network API Examples"
          >Examples</a
        >
        <a
          href="https://webmachinelearning.github.io/webnn"
          title="W3C Web Neural Network API Specification"
          >W3C Spec</a
        >
        <a
          href="https://www.w3.org/community/webmachinelearning/"
          title="W3C Machine Learning for the Web Community Group"
          >W3C CG</a
        >
      </div>
      &copy;2020
      <a
        href="https://github.com/intel/webml-polyfill"
        title="Web Neural Network API"
        >WebNN API</a
      >
    </div>
  </div>
</template>

<script>
import WebNNBadge from '~/components/WebNNBadge.vue'

export default {
  components: {
    WebNNBadge
  }
}
</script>

<style scope>
.hero-foot .section {
  padding: 0 0 1rem 0 !important;
}
</style>
