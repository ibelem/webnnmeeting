<template>
  <section class="section">
    <div class="home-center">
      <b-field position="is-centered homecontrol">
        <b-input
          v-model="user"
          placeholder="type your name"
          type="text"
          icon="account"
        ></b-input>
        <p class="control">
          <button @click="join" class="button join">
            <div class="insider"></div>
            <i class="mdi mdi-near-me mdi-24px"></i>
          </button>
        </p>
      </b-field>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      user: ''
    }
  },
  methods: {
    join() {
      if (this.user.length <= 0) {
        this.emptyName()
      }
      if (this.user.length > 0 && this.user.length < 2) {
        this.shortName()
      }
      if (this.user.length > 48) {
        this.longName()
      }
      if (this.user.length >= 2 && this.user.length <= 48) {
        this.goodToGo()
      }
    },
    emptyName() {
      this.$buefy.toast.open({
        duration: 3000,
        message: `type name to join the meeting`,
        position: 'is-bottom',
        type: 'is-warning'
      })
    },
    shortName() {
      this.$buefy.toast.open({
        duration: 3000,
        message: `too short name`,
        position: 'is-bottom',
        type: 'is-warning'
      })
    },
    longName() {
      this.$buefy.toast.open({
        duration: 3000,
        message: `too long name`,
        position: 'is-bottom',
        type: 'is-warning'
      })
    },
    goodToGo() {
      this.$buefy.toast.open({
        duration: 3000,
        message: `great`,
        position: 'is-bottom',
        type: 'is-info'
      })
    }
  }
}
</script>
<style>
.home-center {
  margin: 0 auto;
  text-align: center;
  display: block;
}

.homecontrol {
  margin: 0 auto;
  background-color: transparent !important;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px !important;
  height: 60px;
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
  width: 300px;
  align-items: center !important;
  padding: 0 8px;
  transform: scale(0.8);
}

.homecontrol:hover,
.homecontrol:focus {
  border: 2px solid rgba(255, 255, 255, 0.4);
  transition: all 0.5s ease;
  transform: scale(1);
}

.homecontrol:not(:hover) {
  transition: all 1s ease;
  transform: scale(0.8);
}

.homecontrol .input,
.homecontrol input {
  background-color: transparent !important;
  border: 0px solid transparent !important;
  height: 56px;
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
  outline: 0 !important;
  box-shadow: 0px 0px 0px rgba(255, 255, 255, 0);
  font-weight: 400;
}

.homecontrol input::placeholder {
  color: rgba(255, 255, 255, 0.8) !important;
}

.homecontrol input::placeholder::after {
  color: rgba(255, 255, 255, 0.8) !important;
}

.homecontrol .control.has-icons-left .icon,
.control.has-icons-right .icon {
  height: 56px;
  color: rgba(255, 255, 255, 0.8);
}

.mdi-24px.mdi-set,
.mdi-24px.mdi:before {
  color: rgba(255, 255, 255, 0.8);
}

.homecontrol .join {
  height: 47px;
  width: 47px;
  border-radius: 24px !important;
  border: 2px solid rgb(204, 255, 144);
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 24px !important;
  overflow: hidden;
  transform: scale(0.6);
  transition: all 350ms ease-in-out;
}

.join .insider {
  background-color: rgba(255, 255, 255, 0.8);
  width: 10px;
  height: 100px;
  position: absolute;
  left: -135px;
  transform: rotateZ(135deg);
}

.join:hover {
  border-color: rgb(204, 255, 144);
  color: #fff;
  transform: scale(1);
}

.join:hover .insider {
  transition: all 1s ease;
  left: 135px;
}
</style>
