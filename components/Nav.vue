<template>
  <div class="hero-head">
    <section class="section container">
      <b-navbar>
        <template slot="brand">
          <b-navbar-item :to="{ path: '/' }" class="logo" tag="router-link">
            <div class="titlea">
              WebNN Meeting
              <div class="slogan lg">
                meet you, meet happy
              </div>
            </div>
          </b-navbar-item>
        </template>
        <template slot="end">
          <b-navbar-dropdown label="Theme">
            <b-navbar-item id="scenery" @click="setLayout" href="#">
              Scenery
            </b-navbar-item>
            <b-navbar-item id="dynamic" @click="setLayout" href="#">
              Dynamic
            </b-navbar-item>
            <b-navbar-item id="immersive" href="#">
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
</template>
<script>
export default {
  methods: {
    setLayout(e) {
      this.$store.commit('setLayout', e.target.id)
      this.$router.go(0)
    }
  }
}
</script>
<style scope>
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
  font-size: 0.8rem;
  letter-spacing: -0.01em;
  width: 100%;
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
    border-top: 1px solid rgba(204, 255, 144, 1.0);
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
