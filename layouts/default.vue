<template>
  <div>
    <div class="container">
      <b-navbar position="is-centered">
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
        </template>
      </b-navbar>
    </div>
    <section>
      <b-carousel
        v-model="carousel"
        :animated="animated"
        :autoplay="autoPlay"
        :pause-hover="pauseHover"
        :pause-info="pauseInfo"
        :interval="interval"
      >
        <b-carousel-item v-for="(carousel, i) in carousels" :key="i">
          <section :class="`hero is-medium is-${carousel.color} is-bold`">
            <div class="hero-body has-text-centered">
              <h1 class="title">{{ carousel.title }}</h1>
            </div>
          </section>
        </b-carousel-item>
      </b-carousel>
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          &copy;2020
          <a href="https://github.com/intel/webml-polyfill/">WebNN API</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carousel: 0,
      animated: 'slide',
      autoPlay: true,
      pauseHover: true,
      pauseInfo: true,
      interval: 5000,
      carousels: [
        { title: 'Slide 1', color: 'white' },
        { title: 'Slide 2', color: 'white' }
      ]
    }
  }
}
</script>
