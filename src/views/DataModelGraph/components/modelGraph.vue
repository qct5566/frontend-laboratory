<template>
  <div class="graph-container">
    <div :id="container"></div>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import { option } from './G6/G6-option'
import { registerNode } from './G6/G6-nodes'
import { registerEdge } from './G6/G6-edges'
import { registerBehavior } from './G6/G6-behavior'
import { graphEvent } from './G6/G6-events'
import { jsonDeepClone } from './G6/G6-dataType'

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
        return {}
      }
    },
    currentGraph: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      container: 'data-model-graph',
      graph: {},
      data: {
        // 画布实时数据
        nodes: [],
        edges: []
      },
      oldValue: {
        // 按照需求回传的数据
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
    },
    zoom () {
      return Object.keys(this.graph).length ? this.graph.getZoom() : 1
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
    },
    // data: {
    //   handler (val, oldVal) {
    //     // 数据变化时传出数据,比较消耗性能，如果可以最好放在各个事件中进行
    //     this.getEndData()
    //   },
    //   deep: true
    // },
    graph: {
      handler (val, oldVal) {
        this.$emit('update:currentGraph', val)
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
      // 自定义交互
      registerBehavior(this)
      // 获取回填数据
      this.data = this.getInitData()
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
      const group = this.graph.get('group')
      group.sort()
      // 初始化事件
      graphEvent(this)
    },
    getInitData () {
      console.log('this.value', this.value)
      // 将初始数据处理成G6形式
      const nodes = this.value.tables.map((e) => {
        return {
          ...e,
          id: e.modelTableId,
          type: 'node-table'
        }
      })
      const edges = this.value.relations.map((e) => {
        const anchor = this.getAnchor(
          nodes,
          e.fromTableId,
          e.fromTableColumnId,
          e.toTableId,
          e.toTableColumnId
        )
        return {
          ...e,
          source: e.fromTableId,
          target: e.toTableId,
          type: 'edge-data-model',
          sourceAnchor:
            typeof e.fromAnchor === 'number'
              ? e.fromAnchor
              : anchor.sourceAnchor,
          targetAnchor:
            typeof e.fromAnchor === 'number' ? e.toAnchor : anchor.targetAnchor
        }
      })
      return { nodes, edges }
    },
    getAnchor (nodes, sourceId, sourceColumnId, targetId, targetColumnId) {
      // 处理节点锚点
      const sourceNode = nodes.find((node) => node.id === sourceId)
      const targetNode = nodes.find((node) => node.id === targetId)
      const sourceInLeft = sourceNode.x - targetNode.x < 0
      const sourcColumneIndex = sourceNode
        ? sourceNode.columns.findIndex(
          (col) => col.columnName === sourceColumnId
        )
        : 0
      const targetColumnIndex = targetNode
        ? targetNode.columns.findIndex(
          (col) => col.columnName === targetColumnId
        )
        : 0
      return {
        sourceAnchor: sourcColumneIndex * 2 + (sourceInLeft ? 1 : 0),
        targetAnchor: targetColumnIndex * 2 + (sourceInLeft ? 0 : 1)
      }
    },
    getEndData () {
      // 获取每次数据改变后的data
      const data = this.graph.save()
      console.log('this.data1111111', data)
      const emitData = {
        tables: data.nodes.map(e => {
          const item = jsonDeepClone(e)
          delete item.style
          delete item.type
          return item
        }),
        relations: data.edges.map(e => {
          return {
            ...e,
            fromTableId: e.source,
            toTableId: e.target,
            fromAnchor: e.sourceAnchor,
            toAnchor: e.targetAnchor
          }
        })
      }
      this.oldValue = emitData
      this.$nextTick(() => {
        this.$emit('get-data', emitData)
      })
    },
    changeGraph () {
      this.data = this.getInitData()
      this.graph.changeData(this.data)
    }
  }
}
</script>

<style lang="less">
@import './styles/index.less';
</style>
