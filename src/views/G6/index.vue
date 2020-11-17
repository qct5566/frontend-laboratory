<template>
  <layout>
    <a-button
      :draggable="true"
      :class="$prefix('mb20 mr20')"
      type="primary"
      v-for="item in btnLs"
      :key="item.value"
      @dragstart="dragstart($event, item)"
    >{{ item.label }}</a-button
    >
    <a-button @click="reset">还原</a-button>
    <div id="G6-container">
      <div
        ref="G6-pro"
        id="G6-pro"
        :class="$prefix('wp100 hp100')"
        @drop="getPosition($event)"
      ></div>
    </div>
  </layout>
</template>

<script>
import uuid from 'uuid'
import G6graph from './G6-option'
import { registerNode } from './G6-option/G6item'
import G6 from '@antv/g6'
export default {
  data () {
    return {
      btnLs: [
        {
          label: '组件',
          value: 'node-group'
        },
        {
          label: '标签',
          value: 'node-label'
        }
      ],
      addNodeType: '',
      data: {
        nodes: [
          {
            x: 10,
            y: 100,
            description: 'ant_type_name_...',
            label: 'node1',
            color: '#2196f3',
            meta: {
              creatorName: 'a_creator'
            },
            id: 'node1',
            type: 'node-group'
          },
          {
            x: 550,
            y: 100,
            description: 'node2_name...',
            label: 'node2',
            color: '#2196f3',
            meta: {
              creatorName: 'a_creator'
            },
            id: 'node2',
            type: 'node-group'
          }
        ],
        edges: []
      },
      graph: {},
      resizeing: false
    }
  },
  mounted () {
    this.data.nodes = this.getData()
    this.G6Init()
    // window.addEventListener('resize', this.G6Init)
  },
  methods: {
    reset () {
      this.data.nodes = this.getData()
      this.data.edges = []
      this.graph.changeData(this.data)
    },
    getData (type = 'node-group') {
      let i = 0
      const arr = new Array(5).fill(i++)
      return arr.map((e, i) => {
        const x = i % 2 === 0 ? 10 : 550 // 10 + (i % 3) * 550
        const y = 100 + i * 150
        return {
          x,
          y,
          description: 'ant_type_name_...',
          label: `node${i + 1}`,
          color: '#2196f3',
          meta: {
            creatorName: 'a_creator'
          },
          id: `node${i + 1}`,
          type: i % 3 === 0 ? type : 'node-group',
          component: {
            list: (i + 1) * 213,
            input: (i + 1) * 3,
            writeread: (i + 1) * 223,
            output: (i + 1) * 4
          }
        }
      })
    },
    G6Init () {
      if (!this.resizeing) {
        this.resizeing = true
        registerNode()
        this.clickAddEdge()
        this.graph = new G6.Graph(G6graph())
        this.graph.data(this.data)
        this.graph.render()
        // this.graph.on('node:mouseenter', evt => {
        //   console.log('evt', evt)
        // })
        setTimeout(() => {
          this.resizeing = false
        }, 1000)
      }
    },
    operationClick (type) {
      switch (type) {
        case 'GG':
          break
      }
    },
    getEdges () {
      // 返回映射数组
      const edgesKey = this.data.edges.map((e) => {
        return {
          sourceKey: e.sourceKey,
          targetKey: e.targetKey
        }
      })
      this.$emit('get-edges', edgesKey)
      this.$emit('update:edgesKey', edgesKey)
    },
    // 为data数据添加边
    addDataEdge (item) {
      this.data.edges =
        this.data.edges && this.data.edges.length ? this.data.edges : []
      const ishas = this.data.edges.findIndex((e) => {
        return e.source === item.source && e.target === item.target
      })
      const edge = {
        source: item.source,
        target: item.target
      }
      if (!ishas || ishas === -1) this.data.edges.push(edge)
      this.getEdges()
    },
    // 为data数据删除边
    delDataEdge (item) {
      const source =
        item.source ||
        (item.defaultCfg
          ? item.defaultCfg.source.defaultCfg.id
          : item._cfg.source._cfg.id)
      const target =
        item.target ||
        (item.defaultCfg
          ? item.defaultCfg.target.defaultCfg.id
          : item._cfg.target._cfg.id)
      this.data.edges = this.data.edges.filter((e) => {
        return !(e.source === source && e.target === target)
      })
      this.getEdges()
    },
    clickAddEdge () {
      const that = this
      // 封装点击添加边的交互
      G6.registerBehavior('click-add-edge', {
        // 下面的this指向本对象，非vue的this
        // 设定该自定义行为需要监听的事件及其响应函数
        getEvents () {
          return {
            'node:click': 'onClick', // 监听事件 node:click，响应函数是 onClick
            mousemove: 'onMousemove', // 监听事件 mousemove，响应函数是 onMousemove
            'edge:dblclick': 'onEdgeDblclick' // 监听事件 edge:dblclick，响应函数是 onEdgeDblclick
            // 'node:dblclick': 'nodeDblclick'
          }
        },
        // nodeDblclick (ev) {
        //   that.data.nodes = that.getData('node-label')
        //   that.data.edges = []
        //   that.graph.changeData(that.data)
        // },
        // getEvents 中定义的 'node:click' 的响应函数
        onClick (ev) {
          console.log('ev', ev)
          const node = ev.item
          const graph = this.graph
          // 鼠标当前点击的节点的位置
          const point = { x: ev.x, y: ev.y }
          const model = node.getModel()
          const nodeId = node.defaultCfg ? node.defaultCfg.id : node._cfg.id
          if (this.addingEdge && this.edge) {
            // 不允许起始点和结束点是同一个点
            const edgeSourceId = this.edge.defaultCfg
              ? this.edge.defaultCfg.source.defaultCfg.id
              : this.edge._cfg.source._cfg.id
            // 判断新的边时否是已经存在的，防止重复添加
            // const isRepeat = that.data.edges.filter(e => {
            //   return `left-${e.sourceKey}` === edgeSourceId && `right-${e.targetKey}` === nodeId
            // })
            // if (isRepeat && isRepeat.length) return
            if (nodeId === edgeSourceId) return
            // if (!that.sameSideMapping) {
            //   const sourceSide = edgeSourceId.split('-')[0]
            //   const nodeSide = nodeId.split('-')[0]
            //   if (sourceSide === nodeSide) return
            // }
            // 更新结束点
            graph.updateItem(this.edge, {
              target: model.id
            })
            const edgeTargetId = this.edge.defaultCfg
              ? this.edge.defaultCfg.target.defaultCfg.id
              : this.edge._cfg.target._cfg.id
            const edge = {
              source: edgeSourceId,
              target: edgeTargetId
            }
            that.addDataEdge(edge)
            this.edge = null
            this.addingEdge = false
          } else {
            // if (that.nodeSourceType === 'left' && nodeId.indexOf('right-') !== -1) return
            // if (that.nodeSourceType === 'right' && nodeId.indexOf('left-') !== -1) return
            // 在图上新增一条边，结束点是鼠标当前点击的节点的位置
            this.edge = graph.addItem('edge', {
              source: model.id,
              target: point
            })
            this.addingEdge = true
          }
        },
        // getEvents 中定义的 mousemove 的响应函数
        onMousemove (ev) {
          // 鼠标的当前位置
          const point = { x: ev.x, y: ev.y }
          if (this.addingEdge && this.edge) {
            // 更新边的结束点位置为当前鼠标位置
            this.graph.updateItem(this.edge, {
              target: point
            })
          }
        },
        // getEvents 中定义的 'edge:click' 的响应函数
        onEdgeDblclick (ev) {
          const currentEdge = ev.item
          // 拖拽过程中，双击清除拖拽的边，否则清除对应边
          // if (this.addingEdge && this.edge === currentEdge) {
          this.graph.removeItem(this.edge || currentEdge)
          if (!this.addingEdge) that.delDataEdge(currentEdge)
          this.edge = null
          this.addingEdge = false
          // }
        }
      })
    },
    dragstart (evt, item) {
      this.addNodeType = item.value
    },
    drag (e) {
      e.preventDefault()
    },
    getPosition (evt) {
      console.log('uuid', evt)
      // const position = { x: 1, y: 2 } // getCanvasByPoint()
      const model = {
        //  x: position.x,
        //  y: position.y,
        description: 'ant_type_name_...',
        label: '12312',
        color: '#2196f3',
        meta: {
          creatorName: 'a_creator'
        },
        id: uuid(),
        type: this.addNodeType,
        component: {
          list: 213,
          input: 123,
          writeread: 123,
          output: 1232
        }
      }
      // this.graph.on('drop', evt => {
      // 一些操作
      const point = this.graph.getPointByCanvas(evt.offsetX, evt.offsetY)
      model.x = point.x
      model.y = point.y
      // if (!evt.item) {
      console.log('evt', point, this.data.nodes)
      this.data.nodes.push(model)
      this.graph.changeData(this.data)
      // }
      // this.graph.addItem(model)
      // })
      //
      // this.graph.data(this.data)
      // this.graph.render()
    }
  }
}
</script>

<style lang="less">
#G6-container {
  position: relative;
  width: 100%;
  height: 80vh;
  #G6-pro {
    .minimap {
      position: absolute;
      top: 60px;
      right: 0px;
      border: 2px solid #666;
      background: #fff;
    }
  }
  #toolbarContainer {
    position: absolute;
    width: 250px;
    top: 20px;
    right: -25px;
  }
}
.mouse-right-menu {
  border: 1px solid #666;
  border-radius: 2px;
  background: #fff;
}
</style>
