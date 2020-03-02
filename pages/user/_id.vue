<template>
  <div>
    <div>
      <video id="ssvideo" ref="ssvideo" playsinline autoplay></video>
    </div>
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

          <div ref="userlist" class="userlist">
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
          <div ref="conversation" class="conversation">
            <div v-show="textmsgs" v-for="t in textmsgs" class="cslist">
              <div class="columns">
                <span class="imtime column">{{ t.time }}</span
                ><span class="imuser column">{{ t.user }}</span>
              </div>
              <div class="im">{{ t.message }}</div>
            </div>
          </div>
          <b-field id="send">
            <b-input
              v-model="textmsg"
              @keyup.native.enter="sendIm"
              placeholder="..."
              type="text"
            ></b-input>
            <b-button @click="sendIm" icon-left="send"> </b-button>
          </b-field>
        </div>
      </div>
      <div class="column columncenter">
        <div class="videos">
          <div v-show="localuser.srcObject && ssmode" class="videoset">
            <canvas id="sscanvas" ref="sscanvas"></canvas>
            <!-- <canvas v-show="!ssmode" id="localcanvas" ref="localcanvas"></canvas> -->
            <div class="user">
              <div class="username">{{ localuser.userId }} CANVAS</div>
              <b-button
                @click="fullscreen"
                :id="localuser.id"
                :ref="localuser.id"
                icon-left="fullscreen"
                class="btnfullscreen"
              ></b-button>
            </div>
          </div>
          <div v-show="localuser.srcObject && !ssmode" class="videoset">
            <video
              id="localvideo"
              ref="localvideo"
              :src-object.prop.camel="localuser.srcObject"
              playsinline
              autoplay
            ></video>
            <div class="user">
              <div class="username">{{ localuser.userId }} VIDEO</div>
              <b-button
                @click="fullscreen"
                :id="localuser.id"
                :ref="localuser.id"
                icon-left="fullscreen"
                class="btnfullscreen"
              ></b-button>
            </div>
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
            <div class="user">
              <div v-show="u.srcObject && !u.local" class="username">
                {{ u.userId }}
              </div>
              <b-button
                @click="fullscreen"
                :id="u.id"
                :ref="u.id"
                icon-left="fullscreen"
                class="btnfullscreen"
              ></b-button>
            </div>
          </div>
        </div>
        <div class="videocontrol">
          <div v-show="showaimenu" class="videocontrolai">
            <b-button
              @click="ssBlur"
              v-if="this.$store.state.supportwenmm"
              icon-left="blur"
              >Blur background</b-button
            >
            <b-button @click="ssBlur" v-else icon-left="blur" disabled
              >Blur background</b-button
            >
            <b-button
              @click="ssBg"
              v-if="this.$store.state.supportwenmm"
              icon-left="image-multiple"
              >Change background</b-button
            >
            <b-button @click="ssBg" v-else icon-left="image-multiple" disabled
              >Change background</b-button
            >
            <b-button @click="stopSS" icon-left="fullscreen">Stop SS</b-button>
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
      </div>
      <div class="column rightoptions is-one-fifth">
        <div ref="inferenceTime">{{ inferencetime }}</div>
        FPS: {{ showfps }}<br />
        {{ mode }}

        <div id="bgimage" class="">
          <input
            id="bgimg"
            ref="bgimg"
            @change="updateSSBackground"
            type="file"
            name="f"
            accept="image/*"
            class="inputfile inputf"
          />
          <label for="bgimg">
            <svg width="20" height="17" viewBox="0 0 20 17">
              <path
                d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
              ></path>
            </svg>
          </label>
          <span>Choose background image</span>
        </div>

        <MeetingInfo />
        <div>
          {{ subscribeType }}<br />
          EnableVideo: {{ enablevideo }}<br />
          {{ resolutionwidth }} x {{ resolutionheight }} <br />
        </div>
        <div>{{ users }}</div>
      </div>
    </div>
    <div id="status" class="columns">
      <div class="column">
        {{ loadedsize }} / {{ totalsize }}MB {{ progress }}%
        <b-progress
          :value="progress"
          class="nnprogress"
          show-value
        ></b-progress>
      </div>
    </div>
  </div>
</template>
<script>
import id from '~/assets/js/user/id'
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
  background: transparent;
}

.upload .upload-draggable {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0px;
}

.rightoptions.column {
  padding: 0.75rem 0px;
}

.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.inputfile + label {
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  padding: 0.25rem 1.25rem;
}

.inputfile:focus + label,
.inputfile.has-focus + label {
  outline: 1px dotted #000;
  outline: -webkit-focus-ring-color auto 5px;
}

.inputfile + label svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  margin-top: -0.25em;
  margin-right: 0.25em;
}

.inputfile + label span {
  font-size: 0.8rem;
}

.inputf + label {
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid currentColor;
}

.inputf:focus + label,
.inputf.has-focus + label,
.inputf + label:hover {
  color: rgba(255, 255, 255, 1);
}

.username {
  display: inline-block;
  width: 93%;
  overflow: hidden;
}

.btnfullscreen {
  color: rgba(255, 255, 255, 0.9);
  display: inline-block;
  width: 10px !important;
  height: 10px;
  margin-top: -6px;
  padding: 0px;
}

.btnfullscreen:hover {
  color: rgba(255, 255, 255, 1);
  background: transparent !important;
}

.btnfullscreen .icon:hover {
  transform: rotate(0deg) !important;
  transform: scale(1.4) !important;
}

#ssvideo {
  width: 320px;
  border: 1px solid red;
  z-index: 3000;
}
</style>
