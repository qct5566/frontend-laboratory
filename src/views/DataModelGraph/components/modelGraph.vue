<template>
  <div class="graph-container">
    <div :id="container"></div>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import { option } from './G6/G6-option'
import { registerNode } from './G6/G6-node'
import { registerEdge } from './G6/G6-edges'
export default {
  name: 'DataModelGraph',
  props: {
    value: {
      type: Object,
      default () {
        return {
          nodes: [],
          edges: []
        }
      }
    },
    options: {
      type: Object,
      default () {
        return { }
      }
    }
  },
  data () {
    return {
      container: 'data-model-graph',
      graph: {},
      data: { // 画布实时数据
        nodes: [],
        edges: []
      },
      oldValue: { // 按照需求回传的数据
        nodes: [],
        edges: []
      }
    }
  },
  computed: {
    graphOptions () {
      const defaultOptions = {}
      // 设置变化后在此处更新画布
      return { ...defaultOptions, ...this.options }
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        // 监听数据变化实时更新画布
        if (JSON.stringify(val) !== JSON.stringify(this.oldValue)) {
          this.changeGraph()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.init()
    window.addEventListener('resize', this.resizeGraph)
  },
  destroyed () {
    window.removeEventListener('resize', this.resizeGraph)
  },
  methods: {
    getGraphContainer () {
      // 获取图容器
      const graphContainer = document.querySelector('.graph-container')
      const width = graphContainer.clientWidth
      const height = graphContainer.clientHeight
      return {
        width: width,
        height: height - 5
      }
    },
    resizeGraph () {
      // 监听重载画布宽高
      const graphContainer = this.getGraphContainer()
      const { width, height } = graphContainer
      this.graph.changeSize(width, height)
    },
    init () {
      // 自定义节点
      registerNode(this)
      // 自定义边
      registerEdge(this)
      // 获取回填数据
      this.data = this.getData()
      // 获取图容器
      const graphContainer = this.getGraphContainer()
      const { width, height } = graphContainer
      // 初始化图
      this.graph = new G6.Graph({
        ...option(this),
        width,
        height
      })
      this.graph.data(this.data)
      this.graph.render()
      // 初始化事件
      this.graphEvent()
    },
    graphEvent () {},
    changeGraph () {},
    getData () {
      // 将数据处理成G6形式
      const nodes = this.value.tables.map(e => {
        return {
          ...e,
          type: 'node-table'
        }
      })
      const edges = [] // this.value.relations.map(e => {
      //   return {
      //     ...e,
      //     type: 'egde-data-model'
      //   }
      // })
      return { nodes, edges }
    }
  }
}
</script>

<style lang="less">
@import './styles/index.less';
</style>
