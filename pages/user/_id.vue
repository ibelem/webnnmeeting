<template>
  <div>
    <div class="columns user">
      <div
        v-show="showparticipants || showconversation"
        class="column cl nopadding is-one-fifth"
      >
        <div id="layoutparticipants" v-show="showparticipants">
          <div class="isleft pd">PARTICIPANTS</div>
          <div class="isleft pd2">
            Presenters ({{ this.$store.state.participants.number }})
          </div>

          <div class="userlist">
            <div v-for="u in users" class="columns">
              <div class="column ull isleft is-three-quarters">
                <b-icon class="ulicon" icon="account" size="is-small"> </b-icon>
                <span class="ulu">{{ u.userId }}</span>
              </div>
              <div class="column ulr">
                <b-icon v-if="u.video" icon="video" size="is-small"> </b-icon>
                <b-icon v-else icon="video-off" size="is-small"> </b-icon>
                <b-icon v-if="u.muted" icon="microphone-off" size="is-small">
                </b-icon>
                <b-icon v-else icon="microphone-high" size="is-small"> </b-icon>
                <b-icon icon="projector-screen" size="is-small"> </b-icon>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="showparticipants && showconversation"
          class="issplit"
        ></div>
        <div id="layoutconversation" v-show="showconversation">
          <div class="isleft pd">CONVERSATION</div>
          <div class="conversation">
            <div class="cslist">
              Conversation List
            </div>
            <b-field>
              <b-input placeholder="..." type="text"></b-input>
              <b-button icon-left="send"> </b-button>
            </b-field>
          </div>
        </div>
      </div>
      <div class="column columncenter">
        <div class="videos">
          <div v-show="localuser.srcObject" class="videoset">
            <canvas id="localcanvas" ref="localcanvas"></canvas>
            <div class="user">{{ localuser.userId }} CANVAS</div>
          </div>
          <div v-show="localuser.srcObject" class="videoset">
            <video
              id="localvideo"
              ref="localvideo"
              :src-object.prop.camel="localuser.srcObject"
              playsinline
              autoplay
            ></video>
            <div class="user">{{ localuser.userId }} VIDEO</div>
          </div>
          <div
            v-show="users.length > 0 && u.srcObject && !u.local"
            v-for="u in users"
            class="videoset"
          >
            <video
              v-show="u.srcObject && !u.local"
              :src-object.prop.camel="u.srcObject"
              playsinline
              autoplay
            ></video>
            <div v-show="u.srcObject && !u.local" class="user">
              {{ u.userId }}
            </div>
          </div>
        </div>
        <div class="videocontrol">
          <div v-show="showaimenu" class="videocontrolai">
            <b-button v-if="this.$store.state.supportwenmm" icon-left="blur"
              >Blur background</b-button
            >
            <b-button v-else icon-left="blur" disabled
              >Blur background</b-button
            >
            <b-button
              v-if="this.$store.state.supportwenmm"
              icon-left="image-multiple"
              >Change background</b-button
            >
            <b-button v-else icon-left="image-multiple" disabled
              >Change background</b-button
            >
            <b-button icon-left="fullscreen">Enter full screen</b-button>
          </div>
          <b-button class="date"><Clock /></b-button>
          <b-button @click="ssBlur" icon-left="account-box"></b-button>
          <b-button icon-left="video"></b-button>
          <b-button icon-left="microphone"></b-button>
          <b-button icon-left="projector-screen"></b-button>
          <b-button @click="showAiMenu" icon-left="dots-horizontal"></b-button>
          <b-button
            @click="toggleConversation"
            icon-left="message-reply-text"
          ></b-button>
          <b-button
            @click="toggleParticipants"
            icon-left="account-group"
          ></b-button>
          <b-button @click="leaveMeeting" icon-left="phone-hangup"></b-button>
        </div>
      </div>
      <div class="column is-one-fifth">
        {{ mode }}
        <div class="home-center">{{ $route.params.user }}</div>
        <MeetingInfo />
        <div>
          {{ showfps }}<br />
          {{ subscribeType }}<br />
          EnableVideo: {{ enablevideo }}<br />
          {{ resolutionwidth }} x {{ resolutionheight }} <br />
        </div>
        <div>{{ users }}</div>
      </div>
    </div>
    <div id="status" class="columns">
      <div class="column">
        <b-progress :value="progress" class="nnprogress" show-value>
          {{ progress }}
        </b-progress>
      </div>
    </div>
  </div>
</template>
<script>
import id from 'assets/js/user/id'
export default {
  ...id
}
</script>
<style scope>
body {
  background: transparent;
}

.content {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh !important;
  margin-top: 0rem;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}

.videoset {
  display: inline-block;
  margin-bottom: -13px;
  width: calc(100% / 4);
  overflow: hidden;
}

video {
  width: 100%;
}

.videoset .user {
  position: relative;
  text-align: center;
  top: -7px;
  padding: 4px 0.75rem;
  margin-top: -20px;
  font-size: 0.6rem;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.videoset .user:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.columncenter {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  border-right: 0px;
  padding: 0px;
  text-align: left;
  min-height: 60vh;
}

.cl {
  border-right: 0px;
}

#status .column {
  padding: 0;
}

.nnprogress .progress {
  height: 1px;
  border-radius: 0px;
}
</style>
