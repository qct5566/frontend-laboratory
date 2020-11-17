<template>
  <div class="graph-container">
    <div id="data-theme-graph"></div>
    <set-edges-type
      v-model="edgesTypeParams.visible"
      v-if="edgesTypeParams.visible"
      :obj="edgesTypeParams"
      :graph="graph"
      @after-save="afterSave"
    />
  </div>
</template>

<script>
// !! props中的value的数据格式必须符合mock中的relationship数据格式
/**
 * 节点添加逻辑
 * ******* 节点添加位置逻辑
 * 第一个节点添加时，为节点添加初始坐标
 * 如果新节点与旧节点有关联，则自动链接旧节点
 * 当链接的旧节点上没有其他链接节点时，
 * 新节点的y坐标为链接节点的y坐标，x坐标增加300
 * 当链接的旧节点上已经有其他链接节点时，
 * 新节点的x坐标应该为最后一个链接的节点x坐标，y坐标增加50
 * 如果无关联关系，链接到最后一个节点，并使用警告模式
 * 坐标为最后一个节点的x轴增加300，y轴相同
 * ******** 节点连接关系逻辑
 * 节点之间有关联关系时，旧节点永远都是from节点，新节点永远都是to节点
 *
 *
 */

import G6 from '@antv/g6'
import { option } from './G6/G6-option'
import { registerNode } from './G6/G6-node'
import { registerEdge } from './G6/G6-edges'
import { relationship } from './mock'
import setEdgesType from './setEdgesType'
export default {
  name: 'DataThemeGraph',
  components: { setEdgesType },
  props: {
    value: {
      // 当前值
      type: Object,
      default () {
        return relationship
      }
    },
    edgesHasError: {
      // 回传是否存在错误的边
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      graph: {},
      data: {
        nodes: [],
        edges: []
      },
      edgesTypeParams: {
        visible: false,
        edge: {}
      },
      nowRelationship: {
        nodes: [],
        edges: []
      },
      hasError: false
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        if (JSON.stringify(val) !== JSON.stringify(this.nowRelationship)) {
          this.changeData()
        }
      },
      deep: true
    },
    hasError (value) {
      this.$emit('update:edgesHasError', value)
      this.$emit('get-edges-has-error', value)
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
    resizeGraph () {
      // 监听重载画布宽高
      const graphContainer = document.querySelector('.graph-container')
      this.graph.changeSize(
        graphContainer.clientWidth,
        graphContainer.clientHeight
      )
    },
    init () {
      // 自定义节点
      registerNode(this)
      // 自定义边
      registerEdge(this)
      // 获取回填数据
      this.data = this.getData()
      // console.log(this.data)
      // 获取图容器
      const graphContainer = document.querySelector('.graph-container')
      // 初始化图
      this.graph = new G6.Graph({
        ...option(this),
        container: 'data-theme-graph',
        width: graphContainer.clientWidth,
        height: graphContainer.clientHeight
      })
      this.graph.data(this.data)
      this.graph.render()
      // 初始化事件
      this.graphEvent()
    },
    graphEvent () {
      // 画布事件
      const events = [
        {
          item: 'node',
          type: 'hover',
          event: 'node:mouseenter',
          value: true
        },
        {
          item: 'node',
          type: 'hover',
          event: 'node:mouseleave',
          value: false
        },
        {
          item: 'edge',
          type: 'hover',
          event: 'edge:mouseenter',
          value: true
        },
        {
          item: 'edge',
          type: 'hover',
          event: 'edge:mouseleave',
          value: false
        },
        {
          item: 'edge',
          type: 'click',
          event: 'edge:click',
          value: true
        },
        {
          item: 'edge',
          type: 'mousedown',
          event: 'edge:mousedown',
          value: true
        },
        {
          item: 'node',
          type: 'drop',
          event: 'node:dragstart',
          value: false
        },
        {
          item: 'node',
          type: 'drag',
          event: 'node:drag'
        },
        {
          item: 'node',
          type: 'drop',
          event: 'node:dragend',
          value: true
        }
      ]
      events.forEach((e) => {
        this.graph.on(e.event, (ev) => {
          const item = ev.item
          this.graph.setItemState(item, e.type, e.value)
        })
      })
    },
    changeData (dropNode) {
      /** 更新数据逻辑
       * 新节点添加时，判断fkey是否存在，
       * 存在则和相关旧节点相连，且旧节点为from新节点为to
       * 不存在则和最后一个旧节点相连，并创建错误边连线
       * 节点删除时，删除所有和其关联的边，但是不删除关联的节点
       *
       * 警告错误逻辑
       * 所有边的出入节点去重后和节点数量不相等时报错
       *
       */
      const hasError = this.data.edges.findIndex((e) => e.isError)
      this.hasError = hasError !== -1
      const isAdd = this.data.nodes.length < this.value.tables.length
      const noChangeSum = this.data.nodes.length === this.value.tables.length
      const isError = isAdd ? this.hasError : false
      if (!isError || noChangeSum) {
        this.$set(this, 'data', this.getData(dropNode))
        this.graph.changeData(this.data)
      } else {
        this.$message.warning('请正确关联表后再关联新的表！')
      }
    },
    emitData (data) {
      // emit数据
      const newRelationship = {
        tables:
          data.nodes && data.nodes.length
            ? data.nodes.map((e) => {
              return {
                id: e.oldId,
                name: e.name,
                columns: e.columns,
                x: e.x,
                y: e.y
              }
            })
            : [],
        edges:
          data.edges && data.edges.length
            ? data.edges.map((e) => {
              return {
                from: e.from,
                to: e.to,
                op: e.op,
                condition: e.condition,
                fromAxis: e.startPoint
                  ? { x: e.startPoint.x, y: e.startPoint.y }
                  : e.fromAxis,
                toAxis: e.endPoint
                  ? { x: e.endPoint.x, y: e.endPoint.y }
                  : e.toAxis
              }
            })
            : []
      }
      this.nowRelationship = JSON.parse(JSON.stringify(newRelationship))
      this.$emit('input', JSON.parse(JSON.stringify(newRelationship)))
      this.$emit(
        'get-relationship',
        JSON.parse(JSON.stringify(newRelationship))
      )
    },
    rightMenuOpera (type, item) {
      // 右键的操作
      switch (type) {
        case 'delNode': // 删除节点
          this.data.nodes = this.data.nodes.filter((e) => e.id !== item.id)
          this.data.edges = this.delEdges(this.data.edges, item)
          this.graph.changeData(this.data)
          this.emitData(this.data)
          break
      }
    },
    edgesOpera (type, item) {
      const cfg = item._cfg || {}
      // console.log('item', item)
      // 边的操作
      switch (type) {
        case 'click':
          this.edgesTypeParams = {
            visible: true,
            row: cfg.model || {},
            source: cfg.source._cfg || {},
            target: cfg.target._cfg || {},
            data: this.data
          }
          break
      }
    },
    getData (dropNode) {
      // dropNode 被拖动的无边的节点
      // 更新节点和边
      const tables = this.value.tables || []
      let edges =
        this.data.edges && this.data.edges.length
          ? this.data.edges
          : this.value.edges
      edges = edges.filter((e) => e.from && e.to)
      // 旧有节点
      // console.log('tables', tables, edges)
      const DataNodes = this.data.nodes || []
      // 非删减节点
      const isNoAddorDel = DataNodes.length === tables.length
      let newNodes = isNoAddorDel
        ? DataNodes
        : tables.map((e) => {
          // 判断有变化的节点是否在旧节点列表中，在则更新，否则添加
          const hasNode = DataNodes.find((dataNode) => dataNode.id === e.name)
          const node = hasNode
            ? { ...hasNode, ...e, id: hasNode.id, oldId: e.id }
            : {
              ...e,
              id: e.name
            }
          return {
            ...node,
            type: 'node-data-theme'
          }
        })
      // 根据节点关系获取边
      const setEdges = this.setEdges(newNodes, edges, dropNode)
      let newEdges = [...edges, ...setEdges]
      // 删除边
      const newNodesIds = newNodes.map((e) => e.id)
      if (newNodesIds && newNodesIds.length) {
        const delNode = DataNodes.find((e) => !newNodesIds.includes(e.id))
        if (delNode) newEdges = this.delEdges(newEdges, delNode)
      }
      if (newEdges.length) {
        // edges存在数据时，把坐标回填给节点
        newNodes = newNodes.map((node) => {
          // 节点坐标存在使用节点坐标 否则使用默认坐标
          let x = node.x || 0
          let y = node.y || 0
          // 边存在时，通过边获取节点位置
          newEdges.forEach((edge) => {
            if (edge.from === node.id) {
              x = x || edge.fromAxis.x
              y = y || edge.fromAxis.y
            } else if (edge.to === node.id) {
              x = x || edge.toAxis.x
              y = y || edge.toAxis.y
            }
          })
          return {
            ...node,
            x,
            y
          }
        })
      } else {
        if (newNodes.length === 1) {
          newNodes[0].x = newNodes[0].x || 20
          newNodes[0].y = newNodes[0].y || 20
        }
      }
      newEdges = newEdges.map((e) => {
        return {
          ...e,
          source: e.from,
          target: e.to,
          type: 'edge-data-theme'
        }
      })
      const data = {
        nodes: newNodes,
        edges: newEdges
      }
      this.emitData(data)
      return data
    },
    setEdges (nodes, edges, dropNode) {
      // 找到不在data.nodes中的边--如果逻辑正确这里必是最后一个
      const oldNodes = this.data.nodes.filter(e => !(dropNode && e.id === dropNode.id))
      const oldNodesIds = oldNodes.map((e) => e.id) || []
      const newNode = nodes.find(
        (e) => oldNodesIds && oldNodesIds.length && !oldNodesIds.includes(e.id)
      ) || dropNode
      // newNode 存在时是添加，不存在说明做了删除动作
      const newEdges = []
      if (newNode) {
        // 如果关联字段中包含新添加的id，则创建关联关系
        oldNodes.forEach((oldNode) => {
          // const oldColumns = oldNode.columns
          // 判断链接上是否有节点，有就插入到右侧，否则插入到最后一个下方
          const oldNodeCfg = this.graph.findById(oldNode.id)
          const oldNodeRelationNode = oldNodeCfg
            ? oldNodeCfg.getNeighbors()
            : []
          const len = oldNodeRelationNode.length - 1
          const lastNodeModel =
            len !== -1
              ? oldNodeRelationNode[len]._cfg.model
              : oldNodeCfg._cfg.model
          const hasMore = lastNodeModel.id !== oldNode.id
          // 旧节点from 新节点to
          // 考虑多个的情况
          // oldColumns.forEach((oldColumn) => {
          //   const fKey = oldColumn.fKey || {}
          //   if (fKey.refTables === newNode.id) {
          //     // from 在旧节点列表 ，to为新添加的节点的情况
          //     // 获取所有和oldNode关联的to节点，
          //     // const targets = oldNode.getNeighbors('target')
          //     const forwardEdge = {
          //       from: oldNode.id,
          //       to: newNode.id,
          //       op: 'Left join',
          //       fromAxis: { x: oldNode.x, y: oldNode.y },
          //       toAxis: {
          //         x: lastNodeModel.x + (hasMore ? 0 : 300),
          //         y: lastNodeModel.y + (hasMore ? 50 : 0)
          //       },
          //       condition: [
          //         {
          //           fromField: fKey.refColumnName,
          //           compareOp: '=',
          //           toField: oldColumn.name
          //         }
          //       ]
          //     }
          //     newEdges.push(forwardEdge)
          //   }
          // })

          // 旧的都为from新的都为to
          newNode.columns.forEach((column) => {
            if (column.fKey && column.fKey.refTable === oldNode.id) {
              const reverseEdge = {
                from: oldNode.id, //,
                to: newNode.id,
                op: 'Left join',
                fromAxis: { x: oldNode.x, y: oldNode.y },
                toAxis: {
                  x: lastNodeModel.x + (hasMore ? 0 : 300),
                  y: lastNodeModel.y + (hasMore ? 50 : 0)
                },
                condition: [
                  {
                    fromField: column.name,
                    compareOp: '=',
                    toField: column.fKey.refColumnName
                  }
                ]
              }
              newEdges.push(reverseEdge)
            }
          })
        })
        // 如果新添加的节点和所有节点都没有任何关系，则在最后一个旧节点上添加一条错误边
        if (!newEdges || !newEdges.length) {
          const errLastNode = oldNodes[oldNodes.length - 1] || {}
          const errEdge = {
            from: errLastNode.id,
            to: newNode.id,
            op: 'Left join',
            toAxis: { x: errLastNode.x + 300, y: errLastNode.y },
            fromAxis: { x: errLastNode.x, y: errLastNode.y },
            color: '#ad1b1b',
            isError: true,
            condition: [{ fromField: '', compareOp: '=', toField: '' }]
          }
          newEdges.push(errEdge)
        }
      }
      // edges 去重
      return newEdges.filter((newEdge) => {
        const newEdgeFrom = newEdge.from
        const newEdgeTo = newEdge.to
        const isINEdges = edges.findIndex((edge) => {
          return edge.from === newEdgeFrom && edge.to === newEdgeTo
        })
        return isINEdges === -1
      })
    },
    delEdges (edges, node) {
      // 删除边的逻辑
      const delNode = this.graph.findById(node.id)
      const delEdges = delNode.getEdges()
      const delEdgesIds = delEdges.map((e) => e._cfg.model.id)
      return edges.filter((e) => !delEdgesIds.includes(e.id))
    },
    afterSave () {
      // 保存中间
      this.graph.changeData(this.data)
      this.emitData(this.data)
    }
  }
}
</script>

<style lang="less">
@import './G6/G6.less';
</style>
