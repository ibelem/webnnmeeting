class baseApp {
  constructor(name, modelLists, front) {
    this.appName = name;
    this.titleName = name; // ? sync with Belem
    this.modelLists = modelLists;
    this.front = front;

    this.currentBackend;
    this.currentModelId;
    this.currentPrefer;
    this.currentDisplay;
    this.feedSrcType;

    this.modelInfo = null;
    this.runner = null;
    this.streaming = false;
    this.stats = new Stats();
    this.track;
    this.modelString = null;
  
    this.progressBar = document.getElementById('progressBar');
  }

  // UI Parts
  setBackend = (backend) => {
    this.currentBackend = backend;
  }

  setPrefer = (prefer) => {
    this.currentPrefer = prefer;
  }

  setModelString = (modelString) => {
    this.modelString = modelString;
  }

  setTitleName = (name) => {
    this.titleName = name;
  }

  setFeedSrcType = (src) => {
    this.feedSrcType = src;
  }

  setDisplay = (display) => {
    if (display !== undefined) {
      this.currentDisplay = display;
    } else if (this.currentDisplay == '1') {
      this.currentDisplay = '0';
    } else {
      this.currentDisplay = '1';
    }
  }

  setFront = () =>  {
    this.front = !this.front;
  }

  parseSearchParams = () => {
    let up = getUrlParam('prefer');
    this.setPrefer(up);
  
    let ub = getUrlParam('b');
    this.setBackend(ub);
  
    let um = getUrlParam('m');
    this.setModelString(um);
  
    let us = getUrlParam('s');
    this.setFeedSrcType(us);
  
    let ud = getUrlParam('d');
    this.setDisplay(ud);
  } 

  readyUIComponents = () => {
    $('.nav-menu').superfish({
      animation: { opacity: 'show' },
      speed: 400
    });
  
    if ($('#nav-container').length) {
      var $mobile_nav = $('#nav-container').clone().prop({ id: 'mobile-nav' });
      let fabars = `<svg aria-hidden='true' data-prefix='fas' data-icon='bars' class='svg-inline--fa fa-bars fa-w-14' role='img' viewBox='0 0 448 512'><path fill='currentColor' d='M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z'></path></svg>`;
      let fatimes = `<svg aria-hidden='true' data-prefix='fas' data-icon='times' class='svg-inline--fa fa-times fa-w-11' role='img' viewBox='0 0 352 512'><path fill='currentColor' d='M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z'></path></svg>`;
      let chevrondown = `<svg aria-hidden='true' data-prefix='fas' data-icon='chevron-down' class='svg-inline--fa fa-chevron-down fa-w-14' role='img' viewBox='0 0 448 512'><path fill='currentColor' d='M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z'></path></svg>`;
      let chevronup = `<svg aria-hidden='true' data-prefix='fas' data-icon='chevron-up' class='svg-inline--fa fa-chevron-up fa-w-14' role='img' viewBox='0 0 448 512'><path fill='currentColor' d='M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z'></path></svg>`;
  
      $mobile_nav.find('> ul').attr({ 'class': '', 'id': '' });
      $('body').append($mobile_nav);
      $('body').prepend(`<button type='button' id='mobile-nav-toggle'><i class='fa bars'></i><i class='fa times' style='display:none;'></i></button>`);
      $('body').append(`<div id='mobile-body-overly'></div>`);
      $('#mobile-nav').find('.menu-has-children').prepend(`<i class='fa chevron-down'></i><i class='fa chevron-up' style='display:none;'></i>`);
  
      $('#mobile-nav-toggle i.bars').html(fabars);
      $('#mobile-nav-toggle i.times').html(fatimes);
      $('#mobile-nav .menu-has-children i.chevron-down').html(chevrondown);
      $('#mobile-nav .menu-has-children i.chevron-up').html(chevronup);
  
      $(document).on('click', '.menu-has-children i', (e) => {
        $(this).nextAll('ul').eq(0).slideToggle();
        $('.menu-has-children i').toggle();
      });
  
      $(document).on('click', '#mobile-nav-toggle', (e) => {
        $('body').toggleClass('mobile-nav-active');
        $('#mobile-nav-toggle i').toggle();
        $('#mobile-body-overly').toggle();
      });
  
      $(document).click((e) => {
        var container = $('#mobile-nav, #mobile-nav-toggle');
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          if ($('body').hasClass('mobile-nav-active')) {
            $('body').removeClass('mobile-nav-active');
            $('#mobile-nav-toggle i').toggle();
            $('#mobile-body-overly').fadeOut();
          }
        }
      });
    } else if ($('#mobile-nav, #mobile-nav-toggle').length) {
      $('#mobile-nav, #mobile-nav-toggle').hide();
    }
  
    // Footer badge
    if (!isWebML()) {
      $('#WebML').addClass('dnone');
      $('#l-WebML').addClass('dnone');
      $('#webmlstatus').addClass('webml-status-false').html('not supported');
    } else {
      $('#WebML').removeClass('dnone');
      $('#l-WebML').removeClass('dnone');
      $('#webmlstatus').addClass('webml-status-true').html('supported');
    }
  
    setPreferenceCodeToolTip();
    this.showModelsComponent();
    this.parseSearchParams();
    this.updateTitleComponent();
    
    if (/Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent)) {
      $('#cameraswitch').prop('checked', this.front);
      $('#cameraswitch').click(() => {
        this.setFront();
        $('#cameraswitch').prop('checked', this.front);
        this.updateBackend(true);
        }
      })
    
      if (this.feedSrcType == 'camera') {
        $('#cameraswitcher').show();
      } else {
        $('#cameraswitcher').hide();
      }
    
      $('#fullscreen i svg').click(() => {
        $('#cameraswitcher').toggleClass('fullscreen');
      })
    
      $('#img').click(() => {
        $('#cameraswitcher').hide();
      })
    
      $('#cam').click(() => {
        $('#cameraswitcher').fadeIn()
      })
    } else {
      $('#cameraswitcher').hide();
    }

    if (this.feedSrcType == 'camera') {
      $('.nav-pills li').removeClass('active');
      $('.nav-pills #cam').addClass('active');
      $('#imagetab').removeClass('active');
      $('#cameratab').addClass('active');
    } else {
      $('.nav-pills li').removeClass('active');
      $('.nav-pills #img').addClass('active');
      $('#cameratab').removeClass('active');
      $('#imagetab').addClass('active');
      $('#fps').html('');
    }
    
    if (hasUrlParam('b')) {
      $('.backend input').removeAttr('checked');
      $('.backend label').removeClass('checked');
      $('#' + getUrlParam('b')).attr('checked', 'checked');
      $('#l-' + getUrlParam('b')).addClass('checked');
    }
    
    if (hasUrlParam('m')) {
      this.checkedModelsComponent();
    }
    
    if (hasUrlParam('prefer')) {
      $('.prefer input').removeAttr('checked');
      $('.prefer label').removeClass('checked');
      $('#' + getUrlParam('prefer')).attr('checked', 'checked');
      $('#l-' + getUrlParam('prefer')).addClass('checked');
    }
    
    this.updateBackendRadioComponent();
    this.updateNativeBackend();

    $('#backendswitch').click(() => {
      $('.alert').hide();
      let polyfillId = $('input:radio[name="bp"]:checked').attr('id') || $('input:radio[name="bp"][checked="checked"]').attr('id');
      let webnnId = $('input:radio[name="bw"]:checked').attr('id') || $('input:radio[name="bw"][checked="checked"]').attr('id');
      $('.b-polyfill input').removeAttr('checked');
      $('.b-polyfill label').removeClass('checked');
      $('.b-webnn input').removeAttr('checked');
      $('.b-webnn label').removeClass('checked');
    
      if(!isBackendSwitch()) {
        $('.backendtitle').html('Backend');
        if (polyfillId) {
          $('#' + polyfillId).attr('checked', 'checked');
          $('#l-' + polyfillId).addClass('checked');
          this.setBackend(polyfillId);
          this.setPrefer('none');
        } else if (webnnId) {
          $('#' + webnnId).attr('checked', 'checked');
          $('#l-' + webnnId).addClass('checked');
          this.setBackend('WebML');
          this.setPrefer(webnnId);
        } else {
          $('#WASM').attr('checked', 'checked');
          $('#l-WASM').addClass('checked');
          this.setBackend('WASM');
          this.setPrefer('none');
        }
        this.setTitleName('Sole Backend');
        this.updateTitleComponent();
      } else {
        $('.backendtitle').html('Backends');
        if (polyfillId && webnnId) {
          $('#' + polyfillId).attr('checked', 'checked');
          $('#l-' + polyfillId).addClass('checked');
          $('#' + webnnId).attr('checked', 'checked');
          $('#l-' + webnnId).addClass('checked');
          this.setBackend(polyfillId);
          this.setPrefer(webnnId);
        } else if (polyfillId) {
          $('#' + polyfillId).attr('checked', 'checked');
          $('#l-' + polyfillId).addClass('checked');
          $('#fast').attr('checked', 'checked');
          $('#l-fast').addClass('checked');
          this.setBackend(polyfillId);
          this.setPrefer('fast');
        } else if (webnnId) {
          $('#WASM').attr('checked', 'checked');
          $('#l-WASM').addClass('checked');
          $('#' + webnnId).attr('checked', 'checked');
          $('#l-' + webnnId).addClass('checked');
          this.setBackend('WASM');
          this.setPrefer(webnnId);
        } else {
          $('#WASM').attr('checked', 'checked');
          $('#l-WASM').addClass('checked');
          $('#fast').attr('checked', 'checked');
          $('#l-fast').addClass('checked');
          this.setBackend('WASM');
          this.setPrefer('fast');
        }
        this.setTitleName('Dual Backends');
        this.updateTitleComponent();
      }
    
      this.updateNativeBackend();
    
      this.updateBackendRadioComponent();
      strsearch = `?prefer=${this.currentPrefer}&b=${this.currentBackend}&m=${this.modelString}&s=${this.feedSrcType}&d=${this.currentDisplay}`;
      window.history.pushState(null, null, strsearch);
      if (this.modelString === 'none') {
        this.showError('No model selected', 'Please select a model to start prediction.');
        return;
      }
      this.updateBackend();
    })
  
    $('input:radio[name=bp]').click(() => {
      $('.alert').hide();
      let polyfillId = $('input:radio[name="bp"]:checked').attr('id') || $('input:radio[name="bp"][checked="checked"]').attr('id');
      if(isBackendSwitch()) {
        if (polyfillId !== this.currentBackend) {
          $('.b-polyfill input').removeAttr('checked');
          $('.b-polyfill label').removeClass('checked');
          $('#' + polyfillId).attr('checked', 'checked');
          $('#l-' + polyfillId).addClass('checked');
        } else if (this.currentPrefer === 'none') {
          showAlert('At least one backend required, please select other backends if needed.');
          return;
        } else {
          $('.b-polyfill input').removeAttr('checked');
          $('.b-polyfill label').removeClass('checked');
          polyfillId = 'WebML';
        }
        this.setBackend(polyfillId);
        this.updateBackendRadioComponent();
      } else {
        $('.b-polyfill input').removeAttr('checked');
        $('.b-polyfill label').removeClass('checked');
        $('.b-webnn input').removeAttr('checked');
        $('.b-webnn label').removeClass('checked');
        $('#' + polyfillId).attr('checked', 'checked');
        $('#l-' + polyfillId).addClass('checked');
        this.setBackend(polyfillId);
        this.setPrefer('none');
      }
      this.updateNativeBackend();
      strsearch = `?prefer=${this.currentPrefer}&b=${this.currentBackend}&m=${this.modelString}&s=${this.feedSrcType}&d=${this.currentDisplay}`;
      window.history.pushState(null, null, strsearch);
      if (this.modelString === 'none') {
        this.showError('No model selected', 'Please select a model to start prediction.');
        return;
      }
      this.updateTitleComponent();
      this.updateBackend(true);
    });
  
    $('input:radio[name=bw]').click(() => {
      $('.alert').hide();
      let webnnId = $('input:radio[name="bw"]:checked').attr('id') || $('input:radio[name="bw"][checked="checked"]').attr('id');
      if(isBackendSwitch()) {
        if (webnnId !== this.currentPrefer) {
          $('.b-webnn input').removeAttr('checked');
          $('.b-webnn label').removeClass('checked');
          $('#' + webnnId).attr('checked', 'checked');
          $('#l-' + webnnId).addClass('checked');
        } else if (this.currentBackend === 'WebML') {
          this.showAlert('At least one backend required, please select other backends if needed.');
          return;
        } else {
          $('.b-webnn input').removeAttr('checked');
          $('.b-webnn label').removeClass('checked');
          webnnId = 'none';
        }
        this.setPrefer(webnnId);
        this.updateBackendRadioComponent();
      }
      else {
        $('.b-polyfill input').removeAttr('checked');
        $('.b-polyfill label').removeClass('checked');
        $('.b-webnn input').removeAttr('checked');
        $('.b-webnn label').removeClass('checked');
        $('#' + webnnId).attr('checked', 'checked');
        $('#l-' + webnnId).addClass('checked');
        this.setBackend('WebML');
        this.setPrefer(webnnId);
      }
      this.updateNativeBackend();
      strsearch = `?prefer=${this.currentPrefer}&b=${this.currentBackend}&m=${this.modelString}&s=${this.feedSrcType}&d=${this.currentDisplay}`;
      window.history.pushState(null, null, strsearch);
      if (this.modelString === 'none') {
        this.showError('No model selected', 'Please select a model to start prediction.');
        return;
      }
      this.updateTitleComponent();
      this.updateBackend(true);
    });
  
    $('#extra').click(() => {
      componentToggle();
      this.setDisplay();
      let strsearch = `?prefer=${this.currentPrefer}&b=${this.currentBackend}&m=${this.modelString}&s=${this.feedSrcType}&d=${this.currentDisplay}`;
      window.history.pushState(null, null, strsearch);
    });
  
    $('#img').click(() => {
      this.setFeedSrcType('image');
      strsearch = `?prefer=${this.currentPrefer}&b=${this.currentBackend}&m=${this.modelString}&s=${this.feedSrcType}&d=${this.currentDisplay}`;
      window.history.pushState(null, null, strsearch);
      if (this.modelString === 'none') {
        this.showError('No model selected', 'Please select a model to start prediction.');
        return;
      }
      this.updateScenario();
    });
  
    $('#cam').click(() => {
      this.setFeedSrcType('camera');
      strsearch = `?prefer=${this.currentPrefer}&b=${this.currentBackend}&m=${this.modelString}&s=${this.feedSrcType}&d=${this.currentDisplay}`;
      window.history.pushState(null, null, strsearch);
      if (this.modelString === 'none') {
        this.showError('No model selected', 'Please select a model to start prediction.');
        return;
      }
      this.updateScenario(true);
    });
    $('#img').click(() => {
      $('.alert').hide();
      $('#fps').html('');
      $('ul.nav-pills li').removeClass('active');
      $('ul.nav-pills #img').addClass('active');
      $('#imagetab').addClass('active');
      $('#cameratab').removeClass('active');
    });
    $('#cam').click(() => {
      $('.alert').hide();
      $('ul.nav-pills li').removeClass('active');
      $('ul.nav-pills #cam').addClass('active');
      $('#cameratab').addClass('active');
      $('#imagetab').removeClass('active');
    });
    $('#fullscreen i svg').click(() => {
      $('#fullscreen i').toggle();
      toggleFullScreen();
      $('video').toggleClass('fullscreen');
      $('#overlay').toggleClass('video-overlay');
      $('#fps').toggleClass('fullscreen');
      $('#fullscreen i').toggleClass('fullscreen');
      $('#ictitle').toggleClass('fullscreen');
      $('#inference').toggleClass('fullscreen');
    });
    const toggleFullScreen = () => {
      let doc = window.document;
      let docEl = doc.documentElement;
      let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
      if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
      } else {
        cancelFullScreen.call(doc);
      }
    }
    this.readyUIComponentsExtra();
  }

  readyUIComponentsExtra = () => {
    // To be implemented when some App have extra components
  }

  disabledModelsComponent = () => {
    if (this.modelString) {
      if (this.modelString.includes('+')) {
        let umArray = this.modelString.split('+');
        for (let modelName of umArray) {
          let modelClass = $('#' + modelName).parent().parent().attr('id');
          $('.model[id=' + modelClass + '] input').attr('disabled', false);
          $('.model[id=' + modelClass + '] label').removeClass('cursordefault');
          $('#' + modelName).attr('disabled', true);
          $('#l-' + modelName).addClass('cursordefault');
        }
      } else if (this.modelString.includes(' ')) {
        let umArray = this.modelString.split(' ');
        for (let modelName of umArray) {
          let modelClass = $('#' + modelName).parent().parent().attr('id');
          $('.model[id=' + modelClass + '] input').attr('disabled', false);
          $('.model[id=' + modelClass + '] label').removeClass('cursordefault');
          $('#' + modelName).attr('disabled', true);
          $('#l-' + modelName).addClass('cursordefault');
        }
      } else {
        $('.model input').attr('disabled', false);
        $('.model label').removeClass('cursordefault');
        $('#' + this.modelString).attr('disabled', true);
        $('#l-' + this.modelString).addClass('cursordefault');
      }
    }
  }

  showModelsComponent = () => {
    let formatTypes = [];
    let formats = singleModelTable(this.modelLists);
    formatTypes.push(...formats);
    trademarks(formatTypes);
    $('input:radio[name=m]').click(this.changeModel);
    this.checkedModelsComponent();
    this.disabledModelsComponent();
  };

  checkedModelsComponent = () => {
    if (this.modelString) {
      if (this.modelString.includes('+')) {
        let umArray = this.modelString.split('+');
        for (let modelName of umArray) {
          let modelClass = $('#' + modelName).parent().parent().attr('id');
          $('.model[id=' + modelClass + '] input').removeAttr('checked');
          $('.model[id=' + modelClass + '] label').removeClass('checked');
          $('#' + modelName).attr('checked', 'checked');
          $('#l-' + modelName).addClass('checked');
        }
      } else if (this.modelString.includes(' ')) {
        let umArray = this.modelString.split(' ');
        for (let modelName of umArray) {
          let modelClass = $('#' + modelName).parent().parent().attr('id');
          $('.model[id=' + modelClass + '] input').removeAttr('checked');
          $('.model[id=' + modelClass + '] label').removeClass('checked');
          $('#' + modelName).attr('checked', 'checked');
          $('#l-' + modelName).addClass('checked');
        }
      } else {
        $('.model input').removeAttr('checked');
        $('.model label').removeClass('checked');
        $('#' + this.modelString).attr('checked', 'checked');
        $('#l-' + this.modelString).addClass('checked');
      }
    }
  }
  
  updateBackendRadioComponent = () => {
    let polyfillId = $('input:radio[name="bp"]:checked').attr('id') || $('input:radio[name="bp"][checked="checked"]').attr('id');
    let webnnId = $('input:radio[name="bw"]:checked').attr('id') || $('input:radio[name="bw"][checked="checked"]').attr('id');
    if (this.currentBackend !== 'none' && this.currentBackend.toLocaleLowerCase() !== 'webml' && this.currentPrefer !== 'none') {
      $('.backend label').removeClass('x');
      $('#l-' + polyfillId).addClass('x');
      $('#l-' + webnnId).addClass('x');
      $('.backendtitle').html('Backends');
      $('#backendswitch').prop('checked', true);
    } else {
      $('.backend label').removeClass('x');
      $('.backendtitle').html('Backend');
      $('#backendswitch').prop('checked', false);
    }
  }

  showProgressComponent = async (pm, pb, pi) => {
    let p = '';
    let modelicon = ``;
    if(pm === 'done') {
      modelicon = `<svg class='prog_list_icon' viewbox='0 0 24 24'>
                    <path class='st0' d='M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0 1.5c-5.2 0-9.5-4.3-9.5-9.5S6.8 2.5 12 2.5s9.5 4.3 9.5 9.5-4.3 9.5-9.5 9.5z'></path>
                    <path class='st0' d='M11.1 12.9l-1.2-1.1c-.4-.3-.9-.3-1.3 0-.3.3-.4.8-.1 1.1l.1.1 1.8 1.6c.1.1.4.3.7.3.2 0 .5-.1.7-.3l3.6-4.1c.3-.3.4-.8.1-1.1l-.1-.1c-.4-.3-1-.3-1.3 0l-3 3.6z'></path>
                  </svg>`;
    } else if (pm === 'current') {
      modelicon = `<svg class='prog_list_icon prog_list_icon-${pb}' width='24' height='24' viewbox='0 0 24 24'>
                  <path d='M12.2 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 1.377a9.377 9.377 0 1 1 0-18.754 9.377 9.377 0 0 1 0 18.754zm-4-8a1.377 1.377 0 1 1 0-2.754 1.377 1.377 0 0 1 0 2.754zm4 0a1.377 1.377 0 1 1 0-2.754 1.377 1.377 0 0 1 0 2.754zm4 0a1.377 1.377 0 1 1 0-2.754 1.377 1.377 0 0 1 0 2.754z' fill='#006DFF' fill-rule='evenodd'></path>
                </svg>`;
    } else {
      modelicon = `<svg class='prog_list_icon prog_list_icon-${pi}' width='24' height='24' viewbox='0 0 24 24'>
                  <path d='M12 16.1c1.8 0 3.3-1.4 3.3-3.2 0-1.8-1.5-3.2-3.3-3.2s-3.3 1.4-3.3 3.2c0 1.7 1.5 3.2 3.3 3.2zm0 1.7c-2.8 0-5-2.2-5-4.9S9.2 8 12 8s5 2.2 5 4.9-2.2 4.9-5 4.9z'></path>
                </svg>`;
    }
  
    let updateicon = ``;
    if(pb === 'done') {
      updateicon = `<svg class='prog_list_icon' viewbox='0 0 24 24'>
                    <path class='st0' d='M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0 1.5c-5.2 0-9.5-4.3-9.5-9.5S6.8 2.5 12 2.5s9.5 4.3 9.5 9.5-4.3 9.5-9.5 9.5z'></path>
                    <path class='st0' d='M11.1 12.9l-1.2-1.1c-.4-.3-.9-.3-1.3 0-.3.3-.4.8-.1 1.1l.1.1 1.8 1.6c.1.1.4.3.7.3.2 0 .5-.1.7-.3l3.6-4.1c.3-.3.4-.8.1-1.1l-.1-.1c-.4-.3-1-.3-1.3 0l-3 3.6z'></path>
                  </svg>`;
    } else if (pb === 'current') {
      updateicon = `<svg class='prog_list_icon prog_list_icon-${pb}' width='24' height='24' viewbox='0 0 24 24'>
                  <path d='M12.2 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 1.377a9.377 9.377 0 1 1 0-18.754 9.377 9.377 0 0 1 0 18.754zm-4-8a1.377 1.377 0 1 1 0-2.754 1.377 1.377 0 0 1 0 2.754zm4 0a1.377 1.377 0 1 1 0-2.754 1.377 1.377 0 0 1 0 2.754zm4 0a1.377 1.377 0 1 1 0-2.754 1.377 1.377 0 0 1 0 2.754z' fill='#006DFF' fill-rule='evenodd'></path>
                </svg>`;
    } else {
      updateicon = `<svg class='prog_list_icon prog_list_icon-${pi}' width='24' height='24' viewbox='0 0 24 24'>
                  <path d='M12 16.1c1.8 0 3.3-1.4 3.3-3.2 0-1.8-1.5-3.2-3.3-3.2s-3.3 1.4-3.3 3.2c0 1.7 1.5 3.2 3.3 3.2zm0 1.7c-2.8 0-5-2.2-5-4.9S9.2 8 12 8s5 2.2 5 4.9-2.2 4.9-5 4.9z'></path>
                </svg>`;
    }
  
    let inferenceicon = ``;
    if(pi === 'done') {
      inferenceicon = `<svg class='prog_list_icon' viewbox='0 0 24 24'>
                    <path class='st0' d='M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0 1.5c-5.2 0-9.5-4.3-9.5-9.5S6.8 2.5 12 2.5s9.5 4.3 9.5 9.5-4.3 9.5-9.5 9.5z'></path>
                    <path class='st0' d='M11.1 12.9l-1.2-1.1c-.4-.3-.9-.3-1.3 0-.3.3-.4.8-.1 1.1l.1.1 1.8 1.6c.1.1.4.3.7.3.2 0 .5-.1.7-.3l3.6-4.1c.3-.3.4-.8.1-1.1l-.1-.1c-.4-.3-1-.3-1.3 0l-3 3.6z'></path>
                  </svg>`;
    } else if (pi === 'current') {
      inferenceicon = `<svg class='prog_list_icon prog_list_icon-${pb}' width='24' height='24' viewbox='0 0 24 24'>
                  <path d='M12.2 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 1.377a9.377 9.377 0 1 1 0-18.754 9.377 9.377 0 0 1 0 18.754zm-4-8a1.377 1.377 0 1 1 0-2.754 1.377 1.377 0 0 1 0 2.754zm4 0a1.377 1.377 0 1 1 0-2.754 1.377 1.377 0 0 1 0 2.754zm4 0a1.377 1.377 0 1 1 0-2.754 1.377 1.377 0 0 1 0 2.754z' fill='#006DFF' fill-rule='evenodd'></path>
                </svg>`;
    } else {
      inferenceicon = `<svg class='prog_list_icon prog_list_icon-${pi}' width='24' height='24' viewbox='0 0 24 24'>
                  <path d='M12 16.1c1.8 0 3.3-1.4 3.3-3.2 0-1.8-1.5-3.2-3.3-3.2s-3.3 1.4-3.3 3.2c0 1.7 1.5 3.2 3.3 3.2zm0 1.7c-2.8 0-5-2.2-5-4.9S9.2 8 12 8s5 2.2 5 4.9-2.2 4.9-5 4.9z'></path>
                </svg>`;
    }
  
    p = `
      <nav class='prog'>
        <ul class='prog_list'>
          <li class='prog prog-${pm}'>
            ${modelicon}<span class='prog_list_title'>Model loading</span>
          </li>
          <li class='prog prog-${pb}'>
            ${updateicon}<span class='prog_list_title'>Model compilation</span>
          </li>
          <li class='prog prog-${pi}'>
            ${inferenceicon}<span class='prog_list_title'>Model inferencing</span>
          </li>
        </ul>
      </nav>
    `;
  
    $('#progressmodel').show();
    $('#progressstep').html(p);
    $('.shoulddisplay').hide();
    $('.icdisplay').hide();
    $('#resulterror').hide();
    await new Promise(res => setTimeout(res, 100));
  }

  showResults = () => {
    $('#progressmodel').hide();
    $('.icdisplay').fadeIn();
    $('.shoulddisplay').fadeIn();
    $('#resulterror').hide();
  }
  
  showError = (title, description) => {
    $('#progressmodel').hide();
    $('.icdisplay').hide();
    $('.shoulddisplay').hide();
    $('#resulterror').fadeIn();
    if (title && description) {
      $('.errortitle').html(title);
      $('.errordescription').html(description);
    } else {
      $('.errortitle').html('Prediction Failed');
      $('.errordescription').html('Please check error log for more details');
    }
  }
  
  updateLoadingComponent = (loadedSize, totalSize, percentComplete) => {
    $('.loading-page .counter h1').html(`${loadedSize}/${totalSize}MB ${percentComplete}%`);
  }

  updateScenario = async (camera = false) => {
    this.streaming = false;
    this.predictByRunner();
  }

  updateBackend = async (force = false) => {
    if (force) {
      this.runner.initialized = false;
    }
    this.streaming = false;
    try { 
      this.runner.deleteAll(); 
    } catch (e) { 

    }
    await this.showProgressComponent('done', 'current', 'pending');
    try {
      this.showHybridComponent();
      await this.initRunner();
      showSubGraphsSummary(this.runner.getSubgraphsSummary());
      this.predictByRunner();
    }
    catch (e) {
      this.errorHandler(e);
    }
  }

  updateNativeBackend = () => {
    if(this.currentPrefer === 'sustained' & currentOS === 'Mac OS') {
      let nativebackend = getNativeAPI(this.currentPrefer);
      $('#l-sustained').html('SUSTAINED_SPEED');
      $('#l-sustained').append(`<span class='nbackend'>${nativebackend}</span>`);
    } else {
      $('#l-sustained').html('SUSTAINED_SPEED');
    }
  }

  updateTitleComponent = () => {
    let currentprefertext = {
      fast: 'FAST',
      sustained: 'SUSTAINED',
      low: 'LOW',
      none: 'None',
    }[this.currentPrefer];
    let backendtext = this.currentBackend;
    if (backendtext == 'WebML') {
      backendtext = 'WebNN';
    }
    if (this.currentBackend !== 'WebML' && this.currentPrefer !== 'none') {
      backendtext = this.currentBackend + ' + WebNN';
    }
    let modelShow = null;
    let modelIdArray;
    if (this.modelString.includes('+') || this.modelString.includes(' ')) {
      if (this.modelString.includes('+')) {
        modelIdArray = this.modelString.split('+');
      } else if (this.modelString.includes(' ')) {
        modelIdArray = this.modelString.split(' ');
      }
      for (let model of modelIdArray) {
        if (modelShow === null) {
          modelShow = getModelById(model).modelName;
        } else {
          modelShow = modelShow + ' + ' + getModelById(model).modelName;
        }
      }
    } else {
      modelShow = getModelById(this.modelString).modelName;
    }
    if(currentprefertext === 'None') {
      $('#ictitle').html(`${this.appName} / ${backendtext} / ${modelShow || 'None'}`);
    } else if(this.currentPrefer === 'sustained' & currentOS === 'Mac OS') {
      $('#ictitle').html(`${this.appName} / ${backendtext} (${currentprefertext}/MPS) / ${modelShow || 'None'}`);
    } else {
      $('#ictitle').html(`${this.appName} / ${backendtext} (${currentprefertext}) / ${modelShow || 'None'}`);
    }
  }

  changeModel = () => {
    $('.alert').hide();
    let um = $('input:radio[name="m"]:checked').attr('id');
    if (this.modelString === um) {
      return;
    }
    this.setModelString(um);
    let modelClasss = getModelClasss();
    let seatModelClass = $('#' + um).parent().parent().attr('id');
    if (modelClasss.length > 1) {
      for (let modelClass of modelClasss) {
        if (seatModelClass !== modelClass) {
          let modelName = $('.model[id=' + modelClass + '] input:radio[checked="checked"]').attr('id');
          if (typeof modelName !== 'undefined') {
            um = um + '+' + modelName;
          }
        }
      }
      this.setModelString(um);
    }
    strsearch = `?prefer=${this.currentPrefer}&b=${this.currentBackend}&m=${this.modelString}&s=${this.feedSrcType}&d=${this.currentDisplay}`;
    window.history.pushState(null, null, strsearch);
    this.checkedModelsComponent();
    this.disabledModelsComponent();
    this.updateTitleComponent();
    $('.offload').hide();
    if (modelClasss.length > 1) {
      let umArray = um.split('+');
      if (modelClasss.length === umArray.length) {
        this.main();
      } else {
        this.showError('Not enough selected models', 'Please select ' + modelClasss.length + ' kinds of models to start prediction.');
      }
    } else {
      this.main();
    }
  };

  showHybridComponent = async () => {
    const hybridRow = (offloadops, backend, prefer) => {
      if(offloadops && offloadops.size > 0 && backend != 'WebML' && prefer != 'none') {
        $('.offload').fadeIn();
        let offloadopsvalue = '';
        offloadops.forEach((value) => {
          let t = '<span class="ol">' + operationTypes[value] + '</span>';
          offloadopsvalue += t;
        })
        $(".ol").remove();
        $("#offloadops").html(`Following ops were offloaded to <span id='nnbackend' class='ols'></span> from <span id='polyfillbackend' class='ols'></span>: `);
        $("#offloadops").append(offloadopsvalue).append(`<span data-toggle="modal" class="subgraph-btn" data-target="#subgraphModal">View Subgraphs</span>`);
        $("#nnbackend").html(prefer);
        $("#polyfillbackend").html(backend);
      } else {
        $('.offload').hide();
      }
    };

    // update the global variable `supportedOps` defined in the base.js
    supportedOps = getWebNNSupportedOps(this.currentBackend, this.currentPrefer);
    let requiredOps = await this.getRequiredOps();
    let intersection = new Set([...supportedOps].filter(x => requiredOps.has(x)));
    console.log('NN supported: ' + [...supportedOps]);
    console.log('Model required: ' + [...requiredOps]);
    console.log('Ops offload: ' + [...intersection]);
    hybridRow(intersection, this.currentBackend, this.currentPrefer);
  }

  showAlert = (error) => {
    console.error(error);
    let div = document.createElement('div');
    div.setAttribute('class', 'backendAlert alert alert-warning alert-dismissible fade show');
    div.setAttribute('role', 'alert');
    div.innerHTML = `<strong>${error}</strong>`;
    div.innerHTML += `<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>`;
    let container = document.getElementById('container');
    container.insertBefore(div, container.firstElementChild);
  }

  updateProgress = (ev) => {
    if (ev.lengthComputable) {
      let totalSize = ev.total / (1000 * 1000);
      let loadedSize = ev.loaded / (1000 * 1000);
      let percentComplete = ev.loaded / ev.total * 100;
      percentComplete = percentComplete.toFixed(0);
      this.progressBar.style = `width: ${percentComplete}%`;
      this.updateLoadingComponent(loadedSize.toFixed(1), totalSize.toFixed(1), percentComplete);
    }
  }

  errorHandler = (e) => {
    this.showAlert(e);
    this.showError(null, null);
  }

  runPredict = async (source) => {
    let inputSize = this.modelInfo.inputSize;
    let options = {
      inputSize: this.modelInfo.inputSize,
      preOptions: this.modelInfo.preOptions || {},
      imageChannels: 4, // RGBA
      drawWH: [inputSize[1], inputSize[0]],
    };
    let ret = await this.runner.predict(source, options);
    return ret;
  }

  startPredictCamera = async () => {
    if (this.streaming) {
      try {
        this.stats.begin();
        let ret = await this.runPredict(this.liveSrcElement);     
        this.handleInferencedResult(ret, this.liveSrcElement);
        this.stats.end();
        setTimeout(this.startPredictCamera, 0);
      } catch (e) {
        this.errorHandler(e);
      }
    }
  }

  predictByRunner = async () => {
    try {
      if (this.feedSrcType == 'camera') {
        this.streaming = true;
        await this.showProgressComponent('done', 'done', 'current');
        let stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: (this.front ? 'user' : 'environment') } });
        video.srcObject = stream;
        this.track = stream.getTracks()[0];
        this.startPredictCamera();
        await this.showProgressComponent('done', 'done', 'done');
        this.showResults();
      } else {
        this.streaming = false;
        // Stop webcam opened by navigator.getUserMedia if user visits 'LIVE CAMERA' tab before
        if (this.track) {
          this.track.stop();
        }
        await this.showProgressComponent('done', 'done', 'current');
        let ret = await this.runPredict(this.srcElement);
        await this.showProgressComponent('done', 'done', 'done');
        this.showResults();
        this.handleInferencedResult(ret, this.srcElement);
      }
    } catch (e) {
      this.errorHandler(e);
    }
  }

  handleInferencedResult = (result, source) => {
    const showInferenceTime = (time) => {
      try {
        let inferenceTime = time.toFixed(2);
        console.log(`Inference time: ${inferenceTime} ms`);
        let inferenceTimeElement = document.getElementById('inferenceTime');
        inferenceTimeElement.innerHTML = `inference time: <span class='ir'>${inferenceTime} ms</span>`;
      } catch (e) {
        console.log(e);
      }
    }
  
    try {
      showInferenceTime(result.time);
      this.drawResultComponents(result.drawData, source);
    } catch (e) {
      console.log(e);
    }
  }

  initRunner = async () => {
    // Be implemented when App have more runners
    let init = await this.runner.initModel(this.currentBackend, this.currentPrefer);
    if (init == 'NOT_LOADED') {
      return;
    }
  }

  getRequiredOps = async () => {
    let requiredOps = await this.runner.getRequiredOps();
    return requiredOps;
  }

  loadModel = async () => {
    await this.runner.loadModel();
  }

  createRunner = () => {
    // To be implemented by each App
  }

  main = async () => {
    if (this.currentDisplay != '0') {
      componentToggle();
    }
    this.disabledModelsComponent();
    if (this.modelString === 'none') {
      this.showError('No model selected', 'Please select a model to start prediction.');
      return;
    }
    await this.showProgressComponent('current', 'pending', 'pending');
    try {
      if (this.createRunner() === 'SUCCESS') {
        await this.loadModel();
        this.showHybridComponent();
        await this.showProgressComponent('done', 'current', 'pending');
        await this.initRunner();
        showSubGraphsSummary(this.runner.getSubgraphsSummary());
      }
    } catch (e) {
      this.errorHandler(e);
    }
    this.predictByRunner();
  }
}