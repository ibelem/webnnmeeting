# Intel Open WebRTC Toolkit (OWT) Server Setup

You can also follow [Open WebRTC Toolkit(OWT) Server User Guide](https://software.intel.com/sites/products/documentation/webrtc/conference/) to install and setup the OWT server.

## Server Requirements

- CentOS* 7.6
- Ubuntu 18.04 LTS

### Optional

The GPU-acceleration can only be enabled on kernel 4.14 or later (4.19 or later is recommended).

If you want to set up video conference service with SVT-HEVC Encoder on Ubuntu 18.04 LTS. See [Deploy SVT-HEVC Encoder Library](https://software.intel.com/sites/products/documentation/webrtc/conference/#Conferencesection2_3_6) section for more details.

If you want to set up video conference service powered by GPU-accelerated OWT server through Intel® Media SDK, please follow the below instructions to install server side SDK where the video-agents run.

If you are working on the following platforms with the integrated graphics, please install Intel® Media SDK. The current release is fully tested on [MediaSDK 2018 Q4](https://github.com/Intel-Media-SDK/MediaSDK/releases/tag/intel-mediasdk-18.4.0).

- Intel® Xeon® E3-1200 v4 Family with C226 chipset
- Intel® Xeon® E3-1200 and E3-1500 v5 Family with C236 chipset
- 5th Generation Intel® CoreTM
- 6th Generation Intel® CoreTM
- 7th Generation Intel® CoreTM

For download or installation instructions, please visit https://github.com/Intel-Media-SDK/MediaSDK.

The external stream output and mp4 format recording rely on AAC encoder libfdk_aac support in ffmpeg library, please see [Compile and deploy ffmpeg with libfdk_aac](https://software.intel.com/sites/products/documentation/webrtc/conference/#Conferencesection2_3_5) section for detailed instructions.

## OWT Server Dependencies

- [Node.js](http://nodejs.org/)	with NPM - 8.15.0
- [MongoDB](http://mongodb.org) -	2.6.10
- System libraries

## Download and Install Open WebRTC Toolkit (OWT) Server for WebNN Meeting

Download [CS_WebRTC_Conference_Server_MCU.v_Version_.Ubuntu.tgz](https://drive.google.com/file/d/1Ru2MLM82TfrzjUKfRq0ySHSDPSj8bJwJ/view?usp=sharing)(~45MB) or [CS_WebRTC_Conference_Server_MCU.v_Version_.CentOS.tgz](https://drive.google.com/file/d/1m7ynhq6AvaFwXPAbFaTAop3TWgajb5Pi/view?usp=sharing)(~44MB).

- `$ tar zxvf CS_WebRTC_Conference_Server_MCU.v<Version>.Ubuntu.tgz && cd Release-v<Version>`

You can also download the full distribution (~830MB) from [Open WebRTC Toolkit (OWT)](https://software.intel.com/zh-cn/webrtc-sdk) or [Google Drive](https://drive.google.com/file/d/18Ev_p0pf4-B9cLHC54uOdVDFogtxdm5A/view?usp=sharing), e.g. `Intel_CS_WebRTC.v<Version>.zip` if you need, which contains `CS_WebRTC_Conference_Server_MCU.v<Version>.Ubuntu.tgz` and `CS_WebRTC_Conference_Server_MCU.v<Version>.CentOS.tgz`.

- `$ unzip Intel_CS_WebRTC.v<Version>.zip && cd Intel_CS_WebRTC.v<Version>`
- `$ tar zxvf CS_WebRTC_Conference_Server_MCU.v<Version>.Ubuntu.tgz && cd Release-v<Version>`

## Launch the OWT Server as Single Node

When install OWT server for some configurations, please just press "Enter" key to next steps in test environment. For example, just press "Enter" key for MongoDB settings. For general OWT Server installation, use following command:

`$ bin/init-all.sh --deps`

If you want to enable GPU-acceleration through Intel Media Server Studio, use following command:

`$ bin/init-all.sh --deps --hardware`

Run the following commands to start the OWT server:

```
$ cd Release-<Version>/
$ bin/start-all.sh
```

## Server Status

To verify whether the server has started successfully, launch your browser and connect to the OWT server at https://XXXXX:3004. Replace XXXXX with the IP address or machine name of your OWT server.

## Stop the OWT Server

```
$ cd Release-<Version>/
$ bin/stop-all.sh
```

## More Powerful Settings

No necessary for WebNN Meeting testing or demostration purpose. If you are interested in more OWT Server features like "Set Up the OWT Server Cluster", please refer to [Open WebRTC Toolkit (OWT) Server User Guide](https://software.intel.com/sites/products/documentation/webrtc/conference/).
