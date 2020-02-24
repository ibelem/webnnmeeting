class semanticSegmentationApp extends baseApp {
  constructor() {
    super('Semantic Segmentation', semanticSegmentationModels, true);
    this.canvasElement = document.getElementById('canvasvideo');
    this.srcElement = document.getElementById('image');
    this.liveSrcElement = document.getElementById('video');
    this.renderer = new Renderer(this.canvasElement);
    this.renderer.setup();
    this.blurSlider = document.getElementById('blurSlider');
    this.refineEdgeSlider = document.getElementById('refineEdgeSlider');
    this.colorMapAlphaSlider = document.getElementById('colorMapAlphaSlider');
    this.selectBackgroundButton = document.getElementById('chooseBackground');
    this.clearBackgroundButton = document.getElementById('clearBackground');
    this.inputElement = document.getElementById('input');
    this.hoverPos;
  }

  readyUIComponentsExtra = () => {
    this.inputElement.addEventListener('change', (e) => {
      let files = e.target.files;
      if (files.length > 0) {
        this.srcElement.src = URL.createObjectURL(files[0]);
      }
    }, false);

    this.srcElement.addEventListener('load', () => {
      this.predictByRunner();
    }, false);

    const buttonComponents = (flag) => {
      if (flag) {
        $('#pickimage').hide();
        $('#fps').show();
      } else {
        $('#pickimage').show();
        $('#fps').hide();
      }
    }
    $('#img').click(() => {
      buttonComponents(this.feedSrcType == 'camera');
    });

    $('#cam').click(() => {
      buttonComponents(this.feedSrcType == 'camera');
    });    

    $('#img').click(() => {
      this.buttonComponents();
    });

    $('#cam').click(() => {
      this.buttonComponents();
    });

    $('#fullscreen i svg').click(() => {
      $('#canvasvideo').toggleClass('fullscreen'); 
      $('.zoom-wrapper').toggle(); 
    });
  }

  windowsLoadExtra = () => {
    let _this = this;
    let colorPicker = new iro.ColorPicker('#color-picker-container', {
      width: 200,
      height: 200,
      color: {
        r: _this.renderer.bgColor[0],
        g: _this.renderer.bgColor[1],
        b: _this.renderer.bgColor[2]
      },
      markerRadius: 5,
      sliderMargin: 12,
      sliderHeight: 20,
    });
  
    $('.bg-value').html(colorPicker.color.hexString);
  
    colorPicker.on('color:change', function (color) {
      $('.bg-value').html(color.hexString);
      _this.renderer.bgColor = [color.rgb.r, color.rgb.g, color.rgb.b];
    });
  
    $('input:radio[name=m]').click(() => {
      let rid = $('input:radio[name="m"]:checked').attr('id');
    });
  
    _this.colorMapAlphaSlider.value = _this.renderer.colorMapAlpha * 100;
    $('.color-map-alpha-value').html(_this.renderer.colorMapAlpha);
    _this.colorMapAlphaSlider.oninput = () => {
      let alpha = _this.colorMapAlphaSlider.value / 100;
      $('.color-map-alpha-value').html(alpha);
      _this.renderer.colorMapAlpha = alpha;
    };
  
    _this.blurSlider.value = _this.renderer.blurRadius;
    $('.blur-radius-value').html(_this.renderer.blurRadius + 'px');
    _this.blurSlider.oninput = () => {
      let blurRadius = parseInt(_this.blurSlider.value);
      $('.blur-radius-value').html(blurRadius + 'px');
      _this.renderer.blurRadius = blurRadius;
    };
  
    _this.refineEdgeSlider.value = _this.renderer.refineEdgeRadius;
    if (_this.refineEdgeSlider.value === '0') {
      $('.refine-edge-value').html('DISABLED');
    } else {
      $('.refine-edge-value').html(_this.refineEdgeSlider.value + 'px');
    }
    _this.refineEdgeSlider.oninput = () => {
      let refineEdgeRadius = parseInt(_this.refineEdgeSlider.value);
      if (refineEdgeRadius === 0) {
        $('.refine-edge-value').html('DISABLED');
      } else {
        $('.refine-edge-value').html(refineEdgeRadius + 'px');
      }
      _this.renderer.refineEdgeRadius = refineEdgeRadius;
    };
  
    $('.effects-select .btn input').filter(function () {
      return this.value === _this.renderer.effect;
    }).parent().toggleClass('active');
  
    $('.controls').attr('data-select', _this.renderer.effect);
  
    $('.effects-select .btn').click((e) => {
      e.preventDefault();
      let effect = e.target.children[0].value;
      $('.controls').attr('data-select', effect);
      _this.renderer.effect = effect;
    });
  
    _this.selectBackgroundButton.addEventListener('change', (e) => {
      let files = e.target.files;
      if (files.length > 0) {
        let img = new Image();
        img.onload = function () {
          _this.renderer.backgroundImageSource = img;
        };
        img.src = URL.createObjectURL(files[0]);
      }
    }, false);
  
    _this.clearBackgroundButton.addEventListener('click', (e) => {
      _this.renderer.backgroundImageSource = null;
    }, false);
  
    _this.canvasElement.addEventListener('mousemove', (e) => {
      _this.hoverPos = getMousePos(_this.canvasElement, e);
      _this.renderer.highlightHoverLabel(_this.hoverPos);
    });
    _this.canvasElement.addEventListener('mouseleave', (e) => {
      _this.hoverPos = null;
      _this.renderer.highlightHoverLabel(_this.hoverPos);
    });
  
    const getMousePos = (canvas, evt) => {
      let rect = canvas.getBoundingClientRect();
      return {
        x: Math.ceil(evt.clientX - rect.left),
        y: Math.ceil(evt.clientY - rect.top)
      };
    }
  }

  createRunner = () => {
    this.currentModelId = this.modelString;
    this.modelInfo = getModelById(this.currentModelId);
    let runner = null;
    runner = new semanticSegmentationRunner(this.modelInfo, this.updateProgress);
    if (runner === null) {
      return 'ERROR';
    } else {
      this.runner = runner;
      return 'SUCCESS';
    }
  }

  runPredict = async (source) => {
    let options = {
      inputSize: this.modelInfo.inputSize,
      preOptions: this.modelInfo.preOptions || {},
      imageChannels: 4, // RGBA
      drawWH: this.getClippedSize(source),
    };
    let ret = await this.runner.predict(source, options);
    return ret;
  }

  drawResultComponents = (data, source) => {
    this.renderer.uploadNewTexture(source, this.getClippedSize(source));
    this.renderer.drawOutputs(data)
    this.renderer.highlightHoverLabel(this.hoverPos);
  }

  getClippedSize = (source) => {
    let width = this.modelInfo.inputSize[0];
    let imWidth = source.naturalWidth | source.videoWidth;
    let imHeight = source.naturalHeight | source.videoHeight;
    let resizeRatio = Math.max(Math.max(imWidth, imHeight) / width, 1);
    let scaledWidth = Math.floor(imWidth / resizeRatio);
    let scaledHeight = Math.floor(imHeight / resizeRatio);
    return [scaledWidth, scaledHeight]; 
  }
}
