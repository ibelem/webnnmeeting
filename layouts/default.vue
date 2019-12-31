<template>
  <section class="hero is-fullheight">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <header class="navbar">
        <div class="container">
          <b-navbar>
            <template slot="brand">
              <b-navbar-item :to="{ path: '/' }" tag="router-link">
                WebNN Meeting
              </b-navbar-item>
            </template>
            <template slot="end">
              <b-navbar-item tag="div">
                <div class="buttons">
                  <a class="button is-light">
                    Join
                  </a>
                </div>
              </b-navbar-item>
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
                  English (EN-US)
                </b-navbar-item>
                <b-navbar-item href="#">
                  简体中文 (ZH-CN)
                </b-navbar-item>
              </b-navbar-dropdown>
            </template>
          </b-navbar>
        </div>
      </header>
    </div>

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
  </section>
</template>

<script>
import WebNNBadge from '~/components/WebNNBadge.vue'

export default {
  components: {
    WebNNBadge
  },
  data() {
    return {
      animated: 'slide',
      autoPlay: true,
      pauseHover: true,
      pauseInfo: false,
      arrow: false,
      arrowHover: false,
      indicator: false,
      interval: 5000,
      carousels: [
        { title: 'Slide 1', color: 'white' },
        { title: 'Slide 2', color: 'info' }
      ]
    }
  }
}
</script>
