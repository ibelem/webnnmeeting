# WebNN Meeting

A Video Conference example with AI features based on W3C Web Neural Network API and powered by Intel Open WebRTC Toolkit (OWT).

## Web Machine Learning Features

- Blur my background
- Change my background
- More to come

## Intel Open WebRTC Toolkit (OWT) Server Setup

Please read [Server.md](doc/Server.md) for setting up Intel Open WebRTC Toolkit (OWT) Server.

## HTTPS Configuration

Go to project main dir and create private and public key:

```
$ openssl genrsa 2048 > webnn-veritas.key
$ chmod 400 server.key
$ openssl req -new -x509 -nodes -sha256 -days 365 -key server.key -out webnn-veritas.crt
```

## Environment Configuration

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
    cert: '/home/belem/github/webnnmeeting/webnn-veritas.crt',
    key: '/home/belem/github/webnnmeeting/webnn-veritas.key'
  }
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

- Visit https://10.239.47.52:8080/socket.io/
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
to following for fixing a audio issue in screen sharing mode:

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

Modified Material Design Icons stylesheet url in npm package for faster loading due to network issue. If there is no such network issue, do not follow this step.

Update `.node_modules/nuxt-buefy/modules.js` from `materialDesignIconsHRef: '//cdn.materialdesignicons.com/2.4.85/css/materialdesignicons.min.css'`
to `materialDesignIconsHRef: '../../css/materialdesignicons/2.4.85/materialdesignicons.min.css'`
