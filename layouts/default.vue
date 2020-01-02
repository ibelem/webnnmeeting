<template>
  <section class="hero is-fullheight home">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <header class="navbar">
        <section class="section container">
          <div
            id="menu-icon-wrapper"
            class="menu-icon-wrapper"
            style="visibility: hidden"
          >
            <svg width="1000px" height="1000px">
              <path
                id="pathA"
                d="M 300 400 L 700 400 C 900 400 900 750 600 850 A 400 400 0 0 1 200 200 L 800 800"
              ></path>
              <path id="pathB" d="M 300 500 L 700 500"></path>
              <path
                id="pathC"
                d="M 700 600 L 300 600 C 100 600 100 200 400 150 A 400 380 0 1 1 200 800 L 800 200"
              ></path>
            </svg>
            <button id="menu-icon-trigger" class="menu-icon-trigger"></button>
          </div>
          <!-- menu-icon-wrapper -->
          <div id="dummy" class="dummy">
            <div class="dummy__item"></div>
            <div class="dummy__item"></div>
            <div class="dummy__item"></div>
            <div class="dummy__item"></div>
          </div>
          <div class="titlea">
            webnn meeting
            <div class="slogan lg">meet happy, meet everywhere</div>
          </div>
        </section>
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
          <div><a href="">webnn </a> <WebNNBadge /></div>
          &copy;2020 <a href="">WebNN API</a>
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
      { src: '../js/slide.js', defer: true },
      { src: '../js/segment.min.js', defer: true },
      { src: '../js/ease.min.js', defer: true },
      { src: '../js/main.js', defer: true }
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
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
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

.titlea {
  font-size: 1.5rem;
  font-style: italic;
  display: block;
  width: 100%;
}

.slogan {
  display: block;
  font-weight: 300;
  font-style: italic;
  font-size: 1rem;
  letter-spacing: -0.01em;
  width: 100%;
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
  height: calc(100vh - 0rem);
  margin-top: -13rem;
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

.dummy__item {
  z-index: 100;
  height: 3em;
  margin: 1em 1.25em;
  pointer-events: none;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.1);
  -webkit-transition: -webkit-transform 0.5s;
  transition: transform 0.5s;
  -webkit-transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
}

.dummy__item {
  transform: translate3d(-100%, 0, 0) translate3d(-2em, 0, 0) scale3d(0.5, 1, 1);
  transform-origin: 100% 50%;
}

.device--alt .dummy__item {
  transform: translate3d(0, 260px, 0) scale3d(1, 0.2, 1);
}

.dummy--active .dummy__item {
  transition-timing-function: cubic-bezier(0.56, 1.19, 0.2, 1.05);
  transform: translate3d(0, 0, 0);
}

.dummy__item:nth-child(4),
.dummy--active .dummy__item:first-child {
  transition-delay: 0.05s;
}

.dummy__item:nth-child(3),
.dummy--active .dummy__item:nth-child(2) {
  transition-delay: 0.1s;
}

.dummy__item:nth-child(2),
.dummy--active .dummy__item:nth-child(3) {
  transition-delay: 0.15s;
}

.dummy__item:first-child,
.dummy--active .dummy__item:nth-child(4) {
  transition-delay: 0.2s;
}

.menu-icon-wrapper {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 34px;
  margin: 2em;
  pointer-events: none;
  transition: 0.1s;
}

.menu-icon-wrapper.scaled {
  -webkit-transform: scale(0.5);
  -ms-transform: scale(0.5);
  transform: scale(0.5);
}

.menu-icon-wrapper svg {
  position: absolute;
  top: -33px;
  left: -33px;
  -webkit-transform: scale(0.1);
  -ms-transform: scale(0.1);
  transform: scale(0.1);
  -webkit-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  transform-origin: 0 0;
}

.menu-icon-wrapper svg path {
  stroke: #fff;
  stroke-width: 60px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: transparent;
}

.menu-icon-wrapper .menu-icon-trigger {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  pointer-events: auto;
  background: none;
  border: none;
  margin: 0;
  padding: 0;
}

.menu-icon-wrapper .menu-icon-trigger:hover,
.menu-icon-wrapper .menu-icon-trigger:focus {
  outline: none;
}
</style>
