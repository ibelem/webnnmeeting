# WebNN Meeting

> A Video Conference example with AI features based on W3C Web Neural Network API and powered by Intel Open WebRTC Toolkit (OWT).

## Web Machine Learning Features

- Blur my background
- Change my background
- More to come

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

Update `.node_modules/nuxt-buefy/modules.js` for faster loading due to network issue:

``` const defaults = {
    css: true,
    materialDesignIcons: true,
    materialDesignIconsHRef: '//cdn.materialdesignicons.com/2.4.85/css/materialdesignicons.min.css'
}
```

to

``` const defaults = {
    css: true,
    materialDesignIcons: true,
    materialDesignIconsHRef: '../../css/materialdesignicons/2.4.85/materialdesignicons.min.css'
```
