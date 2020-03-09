<template>
  <div class="meetingcontrol">
    <div v-show="showaimenu" class="meetingcontrolai">
      <b-button
        @click="ss('blur')"
        v-if="this.$parent.blurdone"
        icon-left="blur"
        type="is-twitter"
        class="btneffect"
        >
        Blur background
        <div class="outer-circle c">
          <div class="inner-circle">  
          </div>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </b-button>
      <b-button
        v-else
        @click="ss('blur')"
        icon-left="blur"
        type="is-twitter"
        >Blur background
      </b-button> 
      <b-progress
          v-if="isblur"
          :value="this.$parent.progress"
          type="is-twitter"
          show-value
          class="nnprogress">
      </b-progress>
      <b-button
        @click="ss('image')"
        v-if="this.$parent.bgimgdone"
        icon-left="image-multiple"
        type="is-twitter"
        class="btneffect"
        >
        Change background 
        <div class="outer-circle m">
          <div class="inner-circle">  
          </div>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </b-button>
      <b-button
        @click="ss('image')"
        v-else
        icon-left="image-multiple"
        type="is-twitter"
        >Change background
      </b-button> 
      <b-progress
          v-if="isbgimg"
          :value="this.$parent.progress"
          type="is-twitter"
          show-value
          class="nnprogress">
      </b-progress>
    </div>
    <div class="hcontrol">
      <b-button class="date"><Clock /></b-button>
      <b-button icon-left="video"></b-button>
      <b-button icon-left="microphone"></b-button>
      <b-button icon-left="projector-screen"></b-button>

      <b-button
        v-if="this.showaimenu"
        @click="showAiMenu"
        icon-left="dots-horizontal"
        class="btnactive"
      ></b-button>
      <b-button
        v-else
        @click="showAiMenu"
        icon-left="dots-horizontal"
      ></b-button>

      <b-button
        v-if="this.$parent.showconversation" @click="toggleConversation" class="btnactive"
        icon-left="message-reply-text"
      ></b-button>
      <b-button
        v-else @click="toggleConversation"
        icon-left="message-reply-text"
      ></b-button>

      <b-button
        @click="toggleParticipants" 
        v-if="this.$parent.showparticipants"
        class="btnactive"
        icon-left="account-group"
      ></b-button>
      <b-button
        @click="toggleParticipants" 
        v-else
        icon-left="account-group"
      ></b-button>
      <b-button @click="leaveMeeting" icon-left="phone-hangup"></b-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showaimenu: false,
      isblur: false,
      isbgimg: false
    }
  },
  methods: {
    ss(effect) {
      if (effect == "blur") {
        this.isblur = !this.isblur
        if (this.isblur) { this.isbgimg = false }
      }

      if (effect == "image") {
        this.isbgimg = !this.isbgimg
        if (this.isbgimg) { this.isblur = false }
      }

      if (this.isblur || this.isbgimg) {
        this.$parent.ss(effect)
      } else {
        this.$parent.stopSS()
      }
    },
    leaveMeeting() {
      this.$parent.leaveMeeting()
    },
    showAiMenu() {
      this.showaimenu = !this.showaimenu
    },
    toggleParticipants() {
      this.$parent.showparticipants = !this.$parent.showparticipants
    },
    toggleConversation() {
      this.$parent.showconversation = !this.$parent.showconversation
    }
  }
}
</script>

<style scope>
.progress-wrapper:not(:last-child) {
  margin-bottom: 0;
}

.nnprogress .progress {
  height: 1px;
  border-radius: 0px;
  background: transparent;
  border: 0px;
}

.progress-wrapper .progress-value {
  display: block;
  height: 100px;
}

.sseffect {
  width: 120px;
  display: inline-block;
  text-align: left;
  color: rgba(204, 255, 144, 1.0);
}

.btneffect {
  color: rgba(204, 255, 144, 1.0);
}

.c {
  position: relative;
  left: 26px;
  top: 3px;
}

.m {
  position: relative;
  left: 8px;
  top: 3px;
}

.outer-circle {
  height: 17px;
  width: 17px;
  background: linear-gradient(#14ffe9, #ffeb3b, #ff00e0);
  border-radius: 50%;
  animation: rotate 1.5s linear infinite;
  display: inline-block;
}

.outer-circle span {
  height: 10px;
  width: 10px;
  background: linear-gradient(#14ffe9, #ffeb3b, #ff00e0);
  border-radius: 50%;
}

.outer-circle span:nth-child(1) {
  filter: blur(3px);
}

.outer-circle span:nth-child(2) {
  filter: blur(6px);
}

.outer-circle span:nth-child(3) {
  filter: blur(9px);
}

.outer-circle span:nth-child(4) {
  filter: blur(8px);
}

.inner-circle {
  height: 12px;
  width: 12px;
  position: absolute;
  background: black;
  top: 2.5px;
  left: 2.5px;
  border-radius: 50%;
  z-index: 9;
  background-image: linear-gradient(to bottom,#3c3c3c 0,#222 100%);
}

@keyframes rotate {
  0% {
    filter: hue-rotate(0deg);
  }

  100% {
    filter: hue-rotate(360deg);
  }
}
</style>
