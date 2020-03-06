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
        <span class="circle c1"></span>
        <span class="circle c2"></span>
        <span class="circle c3"></span>
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
        class="btneffect btnbgimg"
        >
        Change background 
        <span class="circle m1"></span>
        <span class="circle m2"></span>
        <span class="circle m3"></span>
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
      if (!this.showaimenu) {
        this.showaimenu = true
      } else {
        this.showaimenu = false
      }
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

.circle {
  display: inline-block;
  border-radius: 5px;
  width: 10px;
  height: 10px;
  background-color: rgba(204, 255, 144, 1.0);
  opacity: 0;
  animation: scaleIn 2s infinite cubic-bezier(.36, .11, .5, .32);
}

.btnbgimg {
  margin-left: 6px !important;
}

.c1 {
  position: relative;
  left: 30px;
  animation-delay: 0s;
}

.m1 {
  position: relative;
  left: 14px;
  animation-delay: 0s;
}

.c2 {
  position: relative;
  left: 18px;
  animation-delay: 1s;
}

.m2 {
  position: relative;
  left: 2px;
  animation-delay: 1s;
}

.c3 {
  position: relative;
  left: 5.5px;
  animation-delay: 2s;
}

.m3 {
  position: relative;
  left: -10.5px;
  animation-delay: 2s;
}

@keyframes scaleIn {
  from {
    transform: scale(.5, .5);
    opacity: .5;
  }

  to {
    transform: scale(2.5, 2.5);
    opacity: 0;
  }
}

.cbgimg {
  position: relative;
  left: 10px;
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

</style>
