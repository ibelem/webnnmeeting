<template>
  <section class="section">
    <div class="home-center control-scale">
      <b-field position="is-centered homecontrol">
        <b-input
          v-model="user"
          v-on:keyup.native.enter="join"
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
      <div class="settings">
        <b-field>
          <b-radio-button v-model="radio" native-value="forward">
            <span>Forward</span>
          </b-radio-button>
          <b-radio-button v-model="radio" native-value="mix">
            Mix
          </b-radio-button>
        </b-field>
        <b-tabs type="is-toggle" class="three">
          <b-tab-item label="320x240"></b-tab-item>
          <b-tab-item label="640x480"></b-tab-item>
          <b-tab-item label="1280x720"></b-tab-item>
        </b-tabs>
        <b-tabs type="is-toggle" class="two">
          <b-tab-item label="Audio Only"></b-tab-item>
          <b-tab-item label="Video and Audio"></b-tab-item>
        </b-tabs>
      </div>
    </div>
    <div>
      <MeetingInfo />
    </div>
  </section>
</template>

<script>
import MeetingInfo from '~/components/MeetingInfo.vue'

export default {
  name: 'Home',
  components: {
    MeetingInfo
  },
  data() {
    return {
      user: '',
      radio: 'forward'
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
      this.$router.push({ name: 'user-id', params: { id: this.user } })
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
  width: 360px;
  align-items: center !important;
  padding: 0 8px;
  transform: scale(0.8);
}

.field.has-addons {
  margin-bottom: 0;
}

.settings .b-tabs:not(:last-child) {
  margin-bottom: 0rem;
}

.settings {
  border: 2px solid rgba(255, 255, 255, 0.2);
  margin: -7px auto 0 auto;
  padding: 1rem;
  width: 250px;
  border-top: 0px;
}

.settings .field,
.settings .field span,
.settings .field label,
.settings .tabs ul {
  justify-content: center;
  font-size: 0.7rem;
}

.settings .b-radio,
.settings .tabs ul li a {
  border-radius: 0px !important;
  border: 0px;
}

.settings .tabs ul {
  margin: 4px 0 0 0;
}

.settings .b-radio {
  background-color: transparent;
  width: 90px;
}

.settings .three .tabs ul li a {
  width: 60px;
}

.settings .two .tabs ul li a {
  width: 90px;
}

.settings .button.is-primary:focus:not(:active),
.settings .button.is-primary.is-focused:not(:active) {
  background-color: rgba(0, 0, 0, 0.2) !important;
  color: rgb(204, 255, 144) !important;
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
}

.settings .button.is-primary {
  background-color: rgba(0, 0, 0, 0.2) !important;
  color: rgb(204, 255, 144) !important;
}

.settings .b-radio:hover {
  background-color: rgba(0, 0, 0, 0.4);
  color: rgb(204, 255, 144) !important;
}

.settings .is-focused {
  background-color: rgba(0, 0, 0, 0.2);
  color: rgb(204, 255, 144) !important;
}

.settings .b-radio,
.settings .tabs ul li a {
  color: rgba(255, 255, 255, 1);
}

.settings .tabs ul li.is-active a {
  color: rgb(204, 255, 144);
  background-color: rgba(0, 0, 0, 0.2);
}

.settings .tabs ul li:hover a {
  background-color: rgba(0, 0, 0, 0.4);
}

.settings .b-tabs .tab-content {
  display: none;
}

.control-scale {
  transform: scale(0.8);
}

.control-scale:hover,
.control-scale:focus {
  transition: all 0.5s ease;
  transform: scale(1);
}

.control-scale:not(:hover) {
  transition: all 1s ease;
  transform: scale(0.8);
}

.homecontrol:hover,
.homecontrol:focus {
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.homecontrol .input,
.homecontrol input {
  background-color: transparent !important;
  border: 0px solid transparent !important;
  height: 56px;
  color: rgba(255, 255, 255, 1);
  font-size: 22px;
  font-weight: 500;
  outline: 0 !important;
  box-shadow: 0px 0px 0px rgba(255, 255, 255, 0);
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
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
