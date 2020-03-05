<template>
  <div class="meetingcontrol">
    <div v-show="showaimenu" class="meetingcontrolai">
      {{ this.$parent.progress }}
      <b-button
        @click="ss('blur')"
        v-if="this.progressstatus"
        icon-left="blur"
        class="btnactive"
        >Blur background</b-button
      >
      <b-button
        @click="ss('blur')"
        v-else
        icon-left="blur"
        >Blur background</b-button
      > 
      <b-progress
          v-if="isblur"
          :value="this.$parent.progress"
          type="is-twitter"
          show-value
          class="nnprogress">
      </b-progress>


      <b-button
        @click="ss('image')"
        icon-left="image-multiple"
        >Change background</b-button
      >

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
    }
  },
  computed: {
    progressstatus() {
      this.$nextTick(() => {
        if (this.$parent.progress == 100) {
          return ture
        } else {
          return false
        }
      })
    }
  },
  methods: {
    ss(effect) {
      if(effect == "blur") {
        this.isblur = !this.isblur
      }
      if(this.isblur) {
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
</style>
