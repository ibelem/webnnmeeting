class semanticSegmentationRunner extends baseRunner {
  constructor(modelInfo, processHandle) {
    super(modelInfo, processHandle);
  }

  initInputOutput = () => {
    let typedArray = this.modelInfo.isQuantized ? Uint8Array : Float32Array;
    this.inputTensor = [new typedArray(this.modelInfo.inputSize.reduce((a, b) => a * b))];
    this.outputTensor = [new Int32Array(this.modelInfo.outputSize.reduce((a, b) => a * b))];
  }

  transferResult = (elapsed) => {
    return {
      time: elapsed,
      drawData: {
        data: this.outputTensor[0],
        outputShape: this.modelInfo.outputSize,
        labels: this.labels,
      },
    };
  }
}