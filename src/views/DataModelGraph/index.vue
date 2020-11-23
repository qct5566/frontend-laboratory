<template>
  <div :class="classPrefix">
    <div :class="`${classPrefix}-header`">
      <div :class="`${classPrefix}-header-text`">
        说明：按住shift后使用鼠标左键框选多个节点
      </div>
      <div :class="`${classPrefix}-header-zoom`">放大倍数：{{ zoom }}X</div>
    </div>
    <div :class="`${classPrefix}-content`">
      <model-graph v-model="modelData" :currentGraph.sync="graph" @get-data="getData"/>
    </div>
    <div :class="`${classPrefix}-footer`"></div>
  </div>
</template>

<script>
import modelGraph from './components/modelGraph'
import { modelData } from './const'
export default {
  name: 'DataModelGraphDom',
  components: { modelGraph },
  data () {
    return {
      classPrefix: 'data-model-layout',
      modelData,
      graph: {}
    }
  },
  computed: {
    zoom () {
      const zoom = Object.keys(this.graph).length ? this.graph.getZoom() : 1.0
      return zoom.toFixed(1)
    }
  },
  methods: {
    getData (data) {
      console.log('data', data)
    }
  }
}
</script>

<style lang="less" scope>
@import '~ant-design-vue/lib/style/index';
@headerHeight: 30px;
@FooterHeight: 0px;

.data-model-layout {
  width: 100%;
  height: 100vh;
  overflow: auto;
  &-header {
    background: #fff;
    box-shadow: 0 0 5px 0 #cacaca;
    height: @headerHeight;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-text {
      padding: 0 20px;
      color: green;
    }
    &-zoom {
      padding: 0 20px;
      color: green;
    }
  }
  &-content {
    width: 100%;
    height: calc(100% - @headerHeight);
  }
}
</style>
