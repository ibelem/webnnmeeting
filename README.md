# WebNN Meeting

> A video conference example based on W3C Web Neural Network API and Open WebRTC Toolkit (OWT).


## HTTPS Configuration

Go to project main dir and create private and public key:
```
$ openssl genrsa 2048 > server.key
$ chmod 400 server.key
$ openssl req -new -x509 -nodes -sha256 -days 365 -key server.key -out server.crt
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
