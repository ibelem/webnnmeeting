module.exports = {
  semanticSegmentationModels: [
    {
      modelName: 'Deeplab 224 Atrous (TFLite)',
      format: 'TFLite',
      modelId: 'deeplab_mobilenet_v2_224_atrous_tflite',
      modelSize: '8.4MB',
      modelFile: './model/deeplab_mobilenetv2_224_dilated.tflite',
      labelsFile: './model/labels.txt',
      inputSize: [224, 224, 3],
      outputSize: [224, 224, 1],
      preOptions: {
        mean: [127.5, 127.5, 127.5],
        std: [127.5, 127.5, 127.5]
      },
      intro:
        'Equivalent to the model above (without dilated suffix) but only available on platforms that natively support atrous convolution.',
      paperUrl: 'https://arxiv.org/abs/1802.02611'
    }
  ]
}
