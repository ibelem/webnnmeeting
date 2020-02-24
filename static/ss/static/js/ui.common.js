const getUrlParam = (key) => {
  let searchParams = new URLSearchParams(location.search);
  return searchParams.get(key);
}

const hasUrlParam = (key) => {
  let searchParams = new URLSearchParams(location.search);
  return searchParams.has(key);
}

const isWebML = () => {
  if (navigator.ml && navigator.ml.getNeuralNetworkContext()) {
    if (!navigator.ml.isPolyfill) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

const fpsToggle = (showFPS) => {
  showFPS ? $('#fps').show() : $('#fps').hide(); 
}

const showSubGraphsSummary = (summary) => {
  if(summary) {
    let listhtml = '';
    for(let i in summary) {
      let backend = summary[i].split(':')[0].toLowerCase();
      let subgraphlist = summary[i].split(':')[1].replace(/ /g, '').replace('{', '').replace('}', '').replace(/,/g, ' ');
      let tmp;

      if(backend.indexOf('webnn') >-1) {
        tmp = `<li><div class="timeline-badge tb-webnn"><i class="glyphicon">WebNN</i></div><div class="timeline-panel tp-webnn"><div class="timeline-body"><p>${subgraphlist}</p></div></div></li>`;
      } else if (backend.indexOf('wasm') >-1) {
        tmp = `<li class="timeline-inverted"><div class="timeline-badge tb-wasm"><i class="glyphicon">WASM</i></div><div class="timeline-panel tp-wasm"><div class="timeline-body"><p>${subgraphlist}</p></div></div></li>`;
      } else if (backend.indexOf('webgl') >-1) {
        tmp = `<li class="timeline-inverted"><div class="timeline-badge tb-webgl"><i class="glyphicon">WebGL</i></div><div class="timeline-panel tp-webgl"><div class="timeline-body"><p>${subgraphlist}</p></div></div></li>`;
      }

      listhtml += tmp;
    }
    $('#subgraph').html(listhtml);
  }
}

const componentToggle = () => {
  $('#header-sticky-wrapper').slideToggle();
  $('#query').slideToggle();
  $('.nav-pills').slideToggle();
  $('.github-corner').slideToggle();
  $('footer').slideToggle();
  $('#extra span').toggle();
}

const formatToLogo = {
  'tflite': '../static/img/l-tflite.png',
  'onnx': '../static/img/l-onnx.png',
  'openvino': '../static/img/l-openvino.png',
};

const trademarks = (allFormats) => {
  let trademarknote = '';

  for (let format of allFormats) {
    let trademark = '';

    switch(format.toLowerCase()) {
      case 'tflite':
        trademark = 'TensorFlow, the TensorFlow logo and any related marks are trademarks of Google Inc.';
        break;
      case 'onnx':
        trademark += 'ONNX is a community project created by Facebook and Microsoft. ONNX is a trademark of Facebook, Inc.';
        break;
      case 'openvino':
        trademark += 'OpenVINO and the OpenVINO logo are trademarks of Intel Corporation or its subsidiaries in the U.S. and/or other countries.';
        break;
      default:
        break;
    }

    trademarknote += trademark;
  }

  if(trademarknote) {
    $('#trademark').html(trademarknote);
  }
}

let singleModelTable = (modelList, modelClass='model', showName='Model') => {
  const allFormats = new Set(modelList.map((m) => m.format));
  const tbody = $('#query tbody');
  const trows = [];
  for (const format of allFormats) {
    const trow = $(`<tr class='model' id='${modelClass}'>`);
    const tdata = $('<td>');
    trow.append(tdata);

    const logo = formatToLogo[format.toLowerCase()];
    tdata.append($(`<img src='${logo}' alt='${format} Format' title='${format} Format'>`));

    const models = modelList.filter((m) => format === m.format && !m.disabled);
    for (const model of models) {
      const modelName = model.modelName.replace(/ \(.*\)$/, '');
      const modelId = model.modelId;
      tdata.append($(`<input type='radio' class='d-none' name='m' id='${modelId}' value='${modelId}'>`));
      tdata.append($(`<label id='l-${modelId}' class='themodel' for='${modelId}' title='${modelName}'>${modelName}</label>`));
    }
    trows.push(trow);
  }
  trows[0].prepend($(`<th class='text-center' rowspan='${allFormats.size}'>
                        <a href='../model.html' title='View model details'>${showName}</a>
                      </th>`));
  tbody.prepend(trows);
  return allFormats;
}

const setPreferenceCodeToolTip = () => {
  if($('#backendpolyfilltitle')) {
    $('#backendpolyfilltitle').attr('data-html', 'true')
    .attr('data-placement', 'bottom')
    .attr('title',
      `<div class="backendtooltip">WASM: Compiled Tensorflow Lite C++ kernels to WebAssembly format.<br>
      WebGL: Tensorflow.js WebGL kernel.</div>`
    );
    $('#backendpolyfilltitle').tooltip();
  }
  if($('#backendwebnntitle')) {
    $('#backendwebnntitle').attr('data-html', 'true')
    .attr('data-placement', 'bottom')
    .attr('title',
      `<div class="backendtooltip">FAST_SINGLE_ANSWER: Prefer returning a single answer as fast as possible, even if this causes more power consumption.<br>
      SUSTAINED_SPEED: Prefer maximizing the throughput of successive frames, for example when processing successive frames coming from the camera.<br>
      LOW_POWER: Prefer executing in a way that minimizes battery drain. This is desirable for compilations that will be executed often.</div>`
    );
    $('#backendwebnntitle').tooltip();
  }
}

let isBackendSwitch = () => {
  return $('#backendswitch').is(':checked')
}

let isFrontFacingSwitch = () => {
  return $('#cameraswitch').is(':checked')
}

let getModelClasss = () => {
  let ids = [];
  for (let model of $('#query tbody .model')) {
    ids.push(model.id);
  }
  return [...new Set(ids)];
}

let strsearch;
let skeletonDetectionPath = location.pathname.toLocaleLowerCase().indexOf('skeleton_detection');
let facialLandmarkDetectionPath = location.pathname.toLocaleLowerCase().indexOf('facial_landmark_detection');


if (!location.search) {
  if (skeletonDetectionPath > -1) {
    strsearch = `?prefer=none&b=none&s=image&d=0`;
    currentBackend = 'none';
    let path = location.href;
    location.href = path + strsearch;
  } else {
    strsearch = `?prefer=none&b=WASM&m=none&s=image&d=0`;
    let path = location.href;
    location.href = path + strsearch;
  }
}

$('#header').sticky({ topSpacing: 0, zIndex: '50' });

$(window).scroll(() => {
  if ($(this).scrollTop() > 10) {
    $('#header').fadeOut();
    $('.scrolltop').fadeIn();
  } else {
    $('#header').fadeIn();
    $('.scrolltop').fadeOut();
  }
});

$('.scrolltop, #logo a').click(() => {
  $('html, body').animate({
    scrollTop: 0
  }, 1000, 'easeInOutExpo');
  return false;
});