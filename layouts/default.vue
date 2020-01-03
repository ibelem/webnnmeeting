<template>
  <section class="hero is-fullheight home">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <section class="section container">
        <b-navbar>
          <template slot="brand">
            <b-navbar-item :to="{ path: '/' }" class="logo" tag="router-link">
              <div class="titlea">
                WebNN Meeting
                <div class="slogan lg">meet happy, meet everywhere</div>
              </div>
            </b-navbar-item>
          </template>
          <template slot="end">
            <b-navbar-dropdown label="Theme">
              <b-navbar-item href="#">
                Classic
              </b-navbar-item>
              <b-navbar-item href="#">
                Immersive
              </b-navbar-item>
            </b-navbar-dropdown>
            <b-navbar-dropdown label="EN">
              <b-navbar-item href="#">
                English
              </b-navbar-item>
              <b-navbar-item href="#">
                Simplified Chinese
              </b-navbar-item>
            </b-navbar-dropdown>
          </template>
        </b-navbar>
      </section>
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
          <div><WebNNBadge /> <MeetingInfo /></div>
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
    </div>
  </section>
</template>

<script>
import WebNNBadge from '~/components/WebNNBadge.vue'
import MeetingInfo from '~/components/MeetingInfo.vue'

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
    WebNNBadge,
    MeetingInfo
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
  height: calc(100vh - 11rem);
  margin-top: 0rem;
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

@media screen and (min-width: 1024px) {
  .navbar-dropdown {
    padding: 0;
  }

  .navbar-item.has-dropdown:focus .navbar-link,
  .navbar-item.has-dropdown:hover .navbar-link,
  .navbar-item.has-dropdown.is-active .navbar-link {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .navbar-dropdown a.navbar-item {
    padding: 0.375rem 1rem;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .navbar-dropdown a.navbar-item:hover {
    padding: 0.375rem 1rem;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .navbar-dropdown {
    background-color: transparent;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    border-top: 1px solid rgb(204, 255, 144);
    box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1);
    display: none;
    font-size: 0.875rem;
    left: 0;
    min-width: 100%;
    position: absolute;
    top: 100%;
    z-index: 20;
  }
}

@media (max-width: 768px) {
  .navbar-menu {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .logo {
    background-color: transparent;
  }

  a.navbar-item:focus,
  a.navbar-item:focus-within,
  a.navbar-item:hover,
  a.navbar-item.is-active,
  .navbar-link:focus,
  .navbar-link:focus-within,
  .navbar-link:hover,
  .navbar-link.is-active {
    background-color: rgba(0, 0, 0, 0.4);
  }

  .navbar-dropdown {
    padding: 0;
  }
}

.footerbrackets a {
  color: #fff;
  text-decoration: none;
  margin: 0px 6px;
  padding: 10px 10px;
  position: relative;
  z-index: 0;
  cursor: pointer;
}

.brackets a:before,
.brackets a:after {
  position: absolute;
  opacity: 0;
  font-size: 1.2rem;
  top: 4px;
  transition: all 0.3s;
}

.brackets a:before {
  content: '(';
  left: 0px;
  transform: translateX(10px);
}

.brackets a:after {
  content: ')';
  right: 0px;
  transform: translateX(-10px);
}

.brackets a:hover:before,
.brackets a:hover:after {
  opacity: 1;
  transform: translateX(0px);
}
</style>
