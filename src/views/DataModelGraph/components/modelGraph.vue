<template>
  <div class="graph-container">
    <div :id="container"></div>
    <div :class="`${container}-tip-text`">
      按住shift框选多个节点,按下M可打开或关闭缩略图，选中节点后使用delete或backspack删除节点
    </div>
    <export-graph
      v-model="exportGraphParams.visible"
      v-if="exportGraphParams.visible"
      :obj="exportGraphParams"
      :graph="graph"
    />
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
import exportGraph from './exportGraph'

export default {
  name: 'DataModelGraph',
  components: { exportGraph },
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
      },
      showMinimap: false,
      dataLog: [], // 操作日志，用于还原操作
      currentLogIndex: 0,
      keydownCtrl: false, // 按住ctrl
      exportGraphParams: {
        visible: false
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
        console.log('val', val, this.oldValue)
        if (JSON.stringify(val) !== JSON.stringify(this.oldValue)) {
          this.changeGraph()
        }
      },
      deep: true
    },
    dataLog: {
      handler (val, oldVal) {
        console.log('this.dataLog', this.dataLog)
      },
      deep: true
    },
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
      // 初始化日志
      this.dataLog = [
        {
          index: 0,
          data: jsonDeepClone(this.data)
        }
      ]
      this.currentLogIndex = 0
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
    operaDataLog (type) {
      // type--- ctrlZ 回退 ctrlY 前进
      let data = {}
      if (type === 'ctrlZ') {
        // 回退时，找到dataLog中的上一项
        if (this.currentLogIndex !== 0) {
          data = this.dataLog[this.currentLogIndex - 1].data
          this.$nextTick(() => {
            this.currentLogIndex = this.currentLogIndex - 1
          })
        }
      } else if (type === 'ctrlY') {
        if (this.currentLogIndex !== this.dataLog.length - 1) {
          data = this.dataLog[this.currentLogIndex + 1].data
          this.$nextTick(() => {
            this.currentLogIndex = this.currentLogIndex + 1
          })
        }
      }
      if (Object.keys(data).length) {
        this.data = jsonDeepClone(data)
        this.graph.changeData(this.data)
        this.getEmitData(data)
      }
    },
    getEmitData (data) {
      // 回调最终数据
      const emitData = {
        tables: data.nodes.map((e) => {
          const item = jsonDeepClone(e)
          delete item.style
          delete item.type
          return item
        }),
        relations: data.edges.map((e) => {
          return {
            ...e,
            fromTableId: e.source,
            toTableId: e.target,
            fromAnchor: e.sourceAnchor,
            toAnchor: e.targetAnchor
          }
        })
      }
      this.oldValue = jsonDeepClone(emitData)
      this.$nextTick(() => {
        this.$emit('get-data', emitData)
      })
    },
    getEndData () {
      // 获取每次数据改变后的data
      const data = this.graph.save()
      // 保存操作日志
      // 每次操作都从currentLogIndex开始拼上最新的操作
      const prveDataLogs = this.dataLog.slice(0, this.currentLogIndex + 1)
      this.dataLog = [
        ...prveDataLogs,
        {
          index: prveDataLogs.length,
          data: jsonDeepClone(data)
        }
      ]
      // 更新currentLogIndex
      this.currentLogIndex = this.dataLog.length - 1
      this.getEmitData(data)
    },
    changeGraph () {
      this.data = this.getInitData()
      this.graph.changeData(this.data)
      this.getEndData()
    },
    exportGraph () {
      // 使用ref 调用本方法导出图表
      this.exportGraphParams = {
        visible: true
      }
    }
  }
}
</script>

<style lang="less">
@import './styles/index.less';
</style>
