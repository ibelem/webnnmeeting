<template>
  <section class="section">
    <div class="home-center control-scale">
      <div class="title">Background Replacement</div>
      <b-table :data="data" :columns="columns"></b-table>
      <div class="columns">
        <div class="column ltr">
          DeepLab / MobileNet v2 / Dilated (a.k.a. atrous) / 8.4MB Input Size:
          257
        </div>
        <div class="column rtl">* Ice Lake</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Home',
  layout: 'sceneryhome',
  data() {
    return {
      data: [
        {
          backend: 'WASM',
          fps: '1',
          inference: '1235.2'
        },
        {
          backend: 'WebGL',
          fps: '2',
          inference: '1235.2'
        },
        {
          backend: 'WebNN (DNNL)',
          fps: '10',
          inference: '1235.2'
        }
      ],
      columns: [
        {
          field: 'backend',
          label: 'Backend'
        },
        {
          field: 'fps',
          label: 'FPS'
        },
        {
          field: 'inference',
          label: 'Inference Time (ms)'
        }
      ]
    }
  }
}
</script>
<style scope>
.home-center {
  margin: 0 auto;
  text-align: center;
}

.title {
  font-size: 1rem;
  color: rgba(255, 255, 255, 1);
  font-weight: 400;
}

.table {
  background-color: transparent;
  color: rgba(255, 255, 255, 0.8);
}

.table td,
.table th {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-width: 0 0 1px;
}

.table thead td,
.table thead th {
  color: rgba(204, 255, 144, 1);
}

.table tr:hover {
  background-color: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 1);
}

.column {
  border: 0px;
}

.ltr {
  text-align: left;
}

.rtl {
  text-align: right;
}

/*

.control-scale:hover,
.control-scale:focus {
  transition: all 0.3s ease;
  transform: scale(1.5);
}

.control-scale:not(:hover) {
  transition: all 1s ease;
  transform: scale(1);
}

@media (max-width: 768px) {
  .control-scale:hover,
  .control-scale:focus {
    transition: all 0.3s ease;
    transform: scale(1.5);
  }
}
*/
</style>
