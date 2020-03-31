# WebNN Meeting (Intelligent Collaboration)

A Web-based Intelligent Collaboration (Video Conference) example with AI features based on W3C Web Neural Network API and powered by Intel Open WebRTC Toolkit (OWT).

> [Web Neural Network (WebNN) API](https://webmachinelearning.github.io/webnn/) is a dedicated low-level API for neural network inference hardware acceleration. It is published by the [W3C Machine Learning for the Web Community Group](https://www.w3.org/community/webmachinelearning/).

## Web Machine Learning Features

- Blur my background
- Change my background
- More to come

## Supported Backends for Web Machine Learning Features

- Slowest: WebAssembly (WASM)
- Slower: WebGL (Will upgrade to WebGPU later)
- Fastest: Web Neural Network (WebNN) API 

Mordern browsers including Google Chrome doesn't support WebNN API now, you can try WebGL backend automatically with your browser.

If you are interested, please refer to [WebNN Chromium build repo](https://github.com/otcshare/chromium-src) and WIKI: 

- How to build WebNN Chromium on [Windows](https://github.com/intel/webml-polyfill/wiki/How-to-build-chromium-on-Windows), [Linux](https://github.com/intel/webml-polyfill/wiki/How-to-build-chromium-on-Linux)
- [How to run Chromium builds with WebNN API](https://github.com/intel/webml-polyfill/wiki/How-to-Run-Chromium-builds-with-WebNN-API).

## Precondition - Intel Open WebRTC Toolkit (OWT) Server Setup

The WebNN Meeting requires WebRTC server support, please read [Server.md](doc/Server.md) for setting up Intel Open WebRTC Toolkit (OWT) Server on CentOS* 7.6 or Ubuntu 18.04 LTS.

## HTTPS Configuration

Go to project main dir and create private and public key, put them under main folder like `/home/belem/github/webnnmeeting`

```
$ openssl genrsa 2048 > webnn-veritas.key
$ chmod 400 webnn-veritas.key
$ openssl req -new -x509 -nodes -sha256 -days 365 -key server.key -out webnn-veritas.crt
```

## Environment Configuration

Please run `ifconfig` to get IP for `webrtcserver`.`url`, and get other information in command line when launch the OWT Server via [Open WebRTC Toolkit (OWT) Server Setup](doc/Server.md).

```
  webrtcserver: {
    id: '5df9ca6f7415937c7a91d774',
    key:
      'rGtTQokQM/OeG/9oDzK9TtFjd+OOeUmFN2dZl52mvaI4cSj1waduIJB8x21Wa9MaGqtZzV1KTWBvr7heBIgSjQjQyeBWI0RFzCTSyhFtd9jmZ994xE50Gkmb2zxkQYALef8oj8do3gT/cWfOfgq1zPooCkRtbMK1xm44Avduyj4=',
    url: 'https://10.239.47.52',
    port: '3000',
    restapiport: '3004'
  },
  restapiserver: {
    host: '127.0.0.1',
    httpport: 8082,
    httpsport: 8081,
    sampleroomparticipantspath: '/rooms/5df9d3661b3282c0ef1a5ee3/participants'
  },
  nuxtserver: {
    host: '0.0.0.0',
    httpsport: 8080
  },
  certificate: {
    cert: './webnn-veritas.crt',
    key: './webnn-veritas.key'
  }
```

You could get the sampleRoom id like `5df9d3661b3282c0ef1a5ee3` of `restapiserver`.`sampleroomparticipantspath` by running `npm run dev` in command line, e.g.

```
[0] [nodemon] starting `node server/meetingserver.js`
[0] sampleRoom Id: 5df9d3661b3282c0ef1a5ee3
[0] WebNN Meeting Rest API Server HTTPS Port: 8081
```

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## How to Run

If you are running the code locally, the browser will show "Your connection is not private" when accessing Intel OWT server and WebNN Meeting web pages.

- Visit https://10.239.47.52:8080/socket.io/?EIO=3&transport=polling
- Click "Advanced" button -> Click "Proceed to 10.239.47.52 (unsafe)"
- Visit WebNN Meeting URL set in config.js, e.g: https://127.0.0.1:8080/
- Click "Advanced" button -> Click "Proceed to 127.0.0.1 (unsafe)"

### macOS

Once you are using macOS and it says "Your connection is not private", click somewhere on the page and then blindly type `thisisunsafe` which will instantly bypass the warning.

## License

The License of WebNN Meeting will be Apache 2.0.

## Code Hacks

### Intel Open WebRTC Toolkit (OWT)

Update `assets/js/owt/conference/channel.js` code

```
    if (options.audio === undefined) {
      options.audio = !!stream.settings.audio;
    }
```
to following for fixing a screen sharing mode issue caused by audio option:

```
    if (options.audio === undefined) {
      if(stream.settings.audio.length === 0) {
        options.audio = false
      } else {
        options.audio = !!stream.settings.audio;
      }
    }
```

### Material Design Icons

Modified Material Design Icons style sheet url in npm package for faster loading due to network issue. No necessary to follow this step if you don't encounter the issue.

Update `.node_modules/nuxt-buefy/modules.js` from `materialDesignIconsHRef: '//cdn.materialdesignicons.com/2.4.85/css/materialdesignicons.min.css'`
to `materialDesignIconsHRef: '../../css/materialdesignicons/2.4.85/materialdesignicons.min.css'`
