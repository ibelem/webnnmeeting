## Intel Open WebRTC Toolkit (OWT) Server Setup

You can also follow [Open WebRTC Toolkit(OWT) Server User Guide](https://software.intel.com/sites/products/documentation/webrtc/conference/) to install and setup the OWT server.

### Server Requirements

- CentOS* 7.6
- Ubuntu 18.04 LTS

The GPU-acceleration can only be enabled on kernel 4.14 or later (4.19 or later is recommended).

If you want to set up video conference service with H.264 codec support powered by non GPU-accelerated OWT server, OpenH264 library is required. See [Deploy Cisco OpenH264* Library](https://software.intel.com/sites/products/documentation/webrtc/conference/#Conferencesection2_3_4) section for more details.

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

### OWT Server Dependencies

- [Node.js](http://nodejs.org/)	- 8.15.0
- Node modules
- [MongoDB](http://mongodb.org) -	2.6.10
- System libraries - Latest

### Download and Install Open WebRTC Toolkit (OWT) Server for WebNN Meeting

Download [CS_WebRTC_Conference_Server_MCU.v_Version_.Ubuntu.tgz](https://drive.google.com/file/d/1Ru2MLM82TfrzjUKfRq0ySHSDPSj8bJwJ/view?usp=sharing)(~45MB) or [CS_WebRTC_Conference_Server_MCU.v_Version_.CentOS.tgz](https://drive.google.com/file/d/1m7ynhq6AvaFwXPAbFaTAop3TWgajb5Pi/view?usp=sharing)(~44MB).

- `$ tar zxvf CS_WebRTC_Conference_Server_MCU.v<Version>.Ubuntu.tgz && cd Release-v<Version>`

You can also download the full distribution (~830MB) from [Open WebRTC Toolkit (OWT)](https://software.intel.com/zh-cn/webrtc-sdk) or [Google Drive](https://drive.google.com/file/d/18Ev_p0pf4-B9cLHC54uOdVDFogtxdm5A/view?usp=sharing), e.g. `Intel_CS_WebRTC.v<Version>.zip` if you need, which contains `CS_WebRTC_Conference_Server_MCU.v<Version>.Ubuntu.tgz` and `CS_WebRTC_Conference_Server_MCU.v<Version>.CentOS.tgz`.

- `$ unzip Intel_CS_WebRTC.v<Version>.zip && cd Intel_CS_WebRTC.v<Version>`
- `$ tar zxvf CS_WebRTC_Conference_Server_MCU.v<Version>.Ubuntu.tgz && cd Release-v<Version>`

### HTTPS Configuration

Go to project main dir and create private and public key:

```
$ openssl genrsa 2048 > server.key
$ chmod 400 server.key
$ openssl req -new -x509 -nodes -sha256 -days 365 -key server.key -out server.crt
```

### Use Your Own Certificate

The default certificate (certificate.pfx) for the OWT server is located in the `Release-<Version>/<Component>/cert` folder. When using HTTPS and/or secure socket.io connection, you should use your own certificate for each server. First, you should edit `management_api/management_api.toml`, `webrtc_agent/agent.toml`, `portal/portal.toml`, `management_console/management_console.toml` to provide the path of each certificate for each server, under the key keystorePath. 

We use PFX formatted certificates in OWT server. See https://nodejs.org/api/tls.html for how to generate a self-signed certificate by openssl utility. We recommend using 2048-bit private key for the certificates. But if you meet DTLS SSL connection error in webrtc-agent, please use 1024-bit instead of 2048-bit private key because of a known network MTU issue.

After editing the configuration file, you should run `./initcert.js` inside each component to input your passphrases for the certificates, which would then store them in an encrypted file. Be aware that you should have node binary in your shell's `$PATH` to run the JS script.

```
$ vim cert-install.sh

$ cp ../../cert/certificate.pfx management_api/cert/ && ./management_api/initcert.js
$ cp ../../cert/certificate.pfx portal/cert/ && ./portal/initcert.js
$ cp ../../cert/certificate.pfx webrtc_agent/cert/ && ./webrtc_agent/initcert.js
$ cp ../../cert/certificate.pfx management_console/cert/ && ./management_console/initcert.js
$ cp ../../cert/certificate.pfx extras/basic_example/cert/ && ./extras/basic_example/initcert.js

$ ./cert-install.sh
```

#### OWT Server Certificates Configuration

| Platform  | Chromium Command Line Switches |
| ----------| ------------------------------ |
| management-api HTTPS | management_api/management_api.toml |
| portal secured Socket.io | portal/portal.toml |
| DTLS-SRTP | webrtc_agent/agent.toml |
| management-console HTTPS | management_console/management_console.toml |

```
$ vim /home/webnn/videoconference/Intel_CS_WebRTC.v4.3/Release-v4.3/portal/portal.toml

[portal]
keystorePath = "./cert/certificate.pfx"
hostname = "<yourhostname.com>"
```

### Launch the OWT Server as Single Node

When install OWT server for some configurations, please just press "Enter" key to next steps in test environment. For example, just press "Enter" key for MongoDB settings. For general OWT Server installation, use following command:

`$ bin/init-all.sh --deps`

If you want to enable GPU-acceleration through Intel Media Server Studio, use following command:

`$ bin/init-all.sh --deps --hardware`

Run the following commands to start the OWT server:

```
$ cd Release-<Version>/
$ bin/start-all.sh
```

### Server Status

To verify whether the server has started successfully, launch your browser and connect to the OWT server at https://XXXXX:3004. Replace XXXXX with the IP address or machine name of your OWT server.

### Stop the OWT Server

```
$ cd Release-<Version>/
$ bin/stop-all.sh
```

### Set Up the OWT Server Cluster

Please refer to [Open WebRTC Toolkit (OWT) Server User Guide](https://software.intel.com/sites/products/documentation/webrtc/conference/)