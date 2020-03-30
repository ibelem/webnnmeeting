## Intel Open WebRTC Toolkit (OWT) Server Setup

### OWT Server Dependencies

- [Node.js](http://nodejs.org/)	- 8.15.0
- Node modules
- [MongoDB](http://mongodb.org) -	2.6.10
- System libraries - Latest

### Download and Install Open WebRTC Toolkit (OWT) Server for WebNN Meeting

Please also follow [Open WebRTC Toolkit(OWT) Server User Guide](https://software.intel.com/sites/products/documentation/webrtc/conference/) to install the OWT server.

- Download the distribution of the [Open WebRTC Toolkit (OWT)](https://software.intel.com/zh-cn/webrtc-sdk), e.g. `Intel_CS_WebRTC.v<Version>.zip`
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

The default certificate (certificate.pfx) for the OWT server is located in the Release-<Version>/<Component>/cert folder. When using HTTPS and/or secure socket.io connection, you should use your own certificate for each server. First, you should edit management_api/management_api.toml, webrtc_agent/agent.toml, portal/portal.toml, management_console/management_console.toml to provide the path of each certificate for each server, under the key keystorePath. See Table 2-4 for details.

We use PFX formatted certificates in OWT server. See https://nodejs.org/api/tls.html for how to generate a self-signed certificate by openssl utility. We recommend using 2048-bit private key for the certificates. But if you meet DTLS SSL connection error in webrtc-agent, please use 1024-bit instead of 2048-bit private key because of a known network MTU issue.

After editing the configuration file, you should run ./initcert.js inside each component to input your passphrases for the certificates, which would then store them in an encrypted file. Be aware that you should have node binary in your shell's $PATH to run the JS script.

```
$ vim cert-install.sh
$ cp ../../cert/certificate.pfx management_api/cert/ && ./management_api/initcert.js
$ cp ../../cert/certificate.pfx portal/cert/ && ./portal/initcert.js
$ cp ../../cert/certificate.pfx webrtc_agent/cert/ && ./webrtc_agent/initcert.js
$ cp ../../cert/certificate.pfx management_console/cert/ && ./management_console/initcert.js
$ cp ../../cert/certificate.pfx extras/basic_example/cert/ && ./extras/basic_example/initcert.js
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

For general OWT Server installation, use following command:

`$ bin/init-all.sh [--deps]`

If you want to enable GPU-acceleration through Intel Media Server Studio, use following command:

`$ bin/init-all.sh [--deps] --hardware`

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

Please refer to [Open WebRTC Toolkit(OWT) Server User Guide](https://software.intel.com/sites/products/documentation/webrtc/conference/)