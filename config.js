module.exports = {
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
  },
  semanticsegmentation: {
    modelName: 'Deeplab 224 Atrous (TFLite)',
    format: 'TFLite',
    modelId: 'deeplab_mobilenet_v2_224_atrous_tflite',
    modelSize: '8.4MB',
    modelFile: '../../js/webnn/ss/model/deeplab_mobilenetv2_224_dilated.tflite',
    labelsFile: '../../js/webnn/ss/model/labels.txt',
    inputSize: [224, 224, 3],
    outputSize: [224, 224, 1],
    preOptions: {
      mean: [127.5, 127.5, 127.5],
      std: [127.5, 127.5, 127.5]
    },
    intro:
      'Equivalent to the model above (without dilated suffix) but only available on platforms that natively support atrous convolution.',
    paperUrl: 'https://arxiv.org/abs/1802.02611'
    // modelName: 'Deeplab 513 Atrous (TFLite)',
    // format: 'TFLite',
    // modelId: 'deeplab_mobilenet_v2_513_atrous_tflite',
    // modelSize: '8.4MB',
    // modelFile: '../../js/webnn/ss/model/deeplab_mobilenetv2_513_dilated.tflite',
    // labelsFile: '../../js/webnn/ss/model/labels.txt',
    // inputSize: [513, 513, 3],
    // outputSize: [513, 513, 1],
    // preOptions: {
    //   mean: [127.5, 127.5, 127.5],
    //   std: [127.5, 127.5, 127.5]
    // },
    // intro:
    //   'Equivalent to the model above (without dilated suffix) but only available on platforms that natively support atrous convolution.',
    // paperUrl: 'https://arxiv.org/abs/1802.02611'
  }
}
