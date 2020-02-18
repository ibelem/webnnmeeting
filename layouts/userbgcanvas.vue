<template>
  <section class="hero is-fullheight home content--canvas">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <section class="section container">
        <b-navbar>
          <template slot="brand">
            <b-navbar-item :to="{ path: '/' }" class="logo" tag="router-link">
              <div class="titlea">
                WebNN Meeting
                <div class="slogan lg">meet you, meet happy</div>
              </div>
            </b-navbar-item>
          </template>
          <template slot="end">
            <b-navbar-dropdown label="Theme">
              <b-navbar-item @click="setBgImg" href="#">
                Classic
              </b-navbar-item>
              <b-navbar-item @click="setCanvas" href="#">
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

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <div class="container has-text-centered">
        <nuxt />
      </div>
    </div>
    <HomeFooter />

    <div id="shadow"></div>
  </section>
</template>

<script>
import HomeFooter from '~/components/HomeFooter.vue'

export default {
  head: {
    script: [
      { src: '../js/socket.io.js', defer: true },
      { src: '../js/adapter-7.0.0.js', defer: true },
      { src: '../js/canvasbg/noise.min.js', defer: true },
      { src: '../js/canvasbg/shift.js', defer: true }
    ]
  },
  components: {
    HomeFooter
  },
  method: {
    setBgImg() {
      this.$store.commit('setLayout', 'userbgimg')
    },
    setCanvas() {
      this.$store.commit('setLayout', 'userbgcanvas')
    }
  }
}
</script>
<style scope>
.leave:focus,
.leave:hover,
.leave.is-active {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

.navbar-menu.is-active {
  background-color: rgba(0, 0, 0, 0.2);
}

.navbar-dropdown .navbar-item:hover,
.navbar-link:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

@media screen and (min-width: 1024px) {
  .navbar-dropdown {
    padding: 0;
  }

  .navbar-item:focus,
  .navbar-item:hover,
  .navbar-item.is-active {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .navbar-item.has-dropdown:focus .navbar-link,
  .navbar-item.has-dropdown:hover .navbar-link,
  .navbar-item.has-dropdown.is-active .navbar-link {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .navbar-dropdown a.navbar-item {
    padding: 0.375rem 1rem;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .navbar-dropdown a.navbar-item:hover {
    padding: 0.375rem 1rem;
    background-color: rgba(0, 0, 0, 0.2);
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
</style>
