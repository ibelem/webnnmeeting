<template>
  <div class="webnnbadge">
    <div id="flip">
      <div><div>5 people online</div></div>
      <div><div>lifeStyle</div></div>
      <div><div>Everything</div></div>
    </div>
    <span v-if="webmlstatus" class="webnn-supported">
      Supported
    </span>
    <span v-else class="webnn-not-supported">
      Not Supported
    </span>
  </div>
</template>
<script>
export default {
  name: 'WebNNBadge',
  data() {
    return {
      webmlstatus: false
    }
  },
  mounted() {
    setTimeout(this.updateWebNNStatus, 100)
  },
  methods: {
    updateWebNNStatus() {
      if (navigator.ml && navigator.ml.getNeuralNetworkContext()) {
        this.webmlstatus = true
      } else {
        this.webmlstatus = false
      }
    }
  },
  destoryed() {
    clearTimeout(this.updateWebMLStatus)
  }
}
</script>
<style>
.webnnbadge {
  display: inline-block;
  text-transform: uppercase;
}

.webnn-supported {
  background-color: rgb(204, 255, 144);
}

.webnn-not-supported {
  background-color: rgb(255, 144, 204);
}

#flip {
  height: 50px;
  overflow: hidden;
}

#flip > div > div {
  color: #fff;
  padding: 4px 12px;
  height: 45px;
  display: inline-block;
}

#flip div:first-child {
  animation: show 5s linear infinite;
}

#flip div div {
  background: #42c58a;
}

#flip div:first-child div {
  background: #4ec7f3;
}

#flip div:last-child div {
  background: #dc143c;
}

@keyframes show {
  0% {
    margin-top: -270px;
  }

  5% {
    margin-top: -180px;
  }

  33% {
    margin-top: -180px;
  }

  38% {
    margin-top: -90px;
  }

  66% {
    margin-top: -90px;
  }

  71% {
    margin-top: 0px;
  }

  99.99% {
    margin-top: 0px;
  }

  100% {
    margin-top: -270px;
  }
}
</style>
