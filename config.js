module.exports = {
  webrtcserver: {
    id: '5df9ca6f7415937c7a91d774',
    key:
      'rGtTQokQM/OeG/9oDzK9TtFjd+OOeUmFN2dZl52mvaI4cSj1waduIJB8x21Wa9MaGqtZzV1KTWBvr7heBIgSjQjQyeBWI0RFzCTSyhFtd9jmZ994xE50Gkmb2zxkQYALef8oj8do3gT/cWfOfgq1zPooCkRtbMK1xm44Avduyj4=',
    url: 'https://10.239.47.115',
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
    httpsport: 8888
  },
  certificate: {
    cert: './webnn-veritas.crt',
    key: './webnn-veritas.key'
  },
  semanticsegmentation: {
    fp32: {
      modelName: 'DeepLab v3 257x257x3',
      // HWC N = 1
      framework: ['WebNN'],
      format: 'OpenVINO',
      modelId: 'deeplab_mobilenet_v2_257_atrous_openvino',
      modelSize: '8.4MB',
      modelFile: '../../js/webnn/ss/model/deeplab_mobilenetv2_257_dilated.bin',
      labelsFile: '../../js/webnn/ss/model/labels.txt',
      inputSize: [257, 257, 3],
      outputSize: [257, 257, 1],
      preOptions: {
        mean: [0, 0, 0],
        std: [1, 1, 1],
        nchwFlag: true
      }
    },
    int8: {
      modelName: 'DeepLab v3 Quant 257',
      framework: ['WebNN'],
      format: 'OpenVINO',
      modelId: 'deeplab_257_quant_openvino',
      isQuantized: true,
      isIE: true,
      modelSize: '2.3MB',
      modelFile:
        '../../js/webnn/ss/model/deeplab_mobilenetv2_257_dilated_quant.bin',
      labelsFile: '../../js/webnn/ss/model/labels.txt',
      inputSize: [257, 257, 3],
      outputSize: [257, 257, 1],
      preOptions: {
        mean: [0, 0, 0],
        std: [1, 1, 1],
        nchwFlag: true
      }
    }
  }
}
