<template>
  <section class="hero is-fullheight home">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <header class="navbar">
        <div class="container">
          <div>WebNNMeeting</div>
          <a href="">Immersive</a>
          <a href="">EN</a>
        </div>
      </header>
    </div>

    <div id="shadow"></div>
    <div id="content" class="content">
      <div id="slider" :data-images="slideimage"></div>
      <!-- Hero content: will be in the middle -->
      <div class="hero-body">
        <div class="container has-text-centered">
          <nuxt />
        </div>
      </div>
      <!-- Hero footer: will stick at the bottom -->
      <div class="hero-foot">
        <div class="container has-text-centered section">
          &copy;2020 <a href="">WebNN API</a> <WebNNBadge />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import WebNNBadge from '~/components/WebNNBadge.vue'

export default {
  head: {
    script: [
      { src: '../js/three.js', defer: true },
      { src: '../js/gsap.js', defer: true },
      { src: '../js/sketch.js', defer: true },
      { src: '../js/slide.js', defer: true }
    ]
  },
  components: {
    WebNNBadge
  },
  data() {
    return {
      slideimage: [
        '../img/00.jpg',
        '../img/01.jpg',
        '../img/02.jpg',
        '../img/03.jpg',
        '../img/04.jpg'
      ]
    }
  }
}
</script>
<style scope>
body {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

body::-webkit-scrollbar {
  display: none;
}

body::scrollbar {
  display: none;
}

.home,
.navbar-item,
.navbar-link {
  color: rgba(255, 255, 255, 1);
}

#shadow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: rgba(0, 0, 0, 0.5);
}

.content {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: calc(100vh - 13rem);
  position: relative;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}

#slider {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -2;
}
</style>
