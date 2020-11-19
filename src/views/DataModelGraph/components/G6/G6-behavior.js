import G6 from '@antv/g6'
// 创建边
const behaviorPointCreateEdge = (vm) => {
  const pointEdgeAttrs = {
    type: 'line',
    style: {
      stroke: 'steelblue',
      lineWidth: 1,
      lineDash: [6, 3]
    }
  }
  const pointEdgeType = 'edge-data-model'
  const getEventInfo = (ev) => {
    // 鼠标位置
    const mousePoint = { x: ev.x, y: ev.y }
    // 节点
    const node = ev.item
    // 节点Id
    const nodeId = (node && node._cfg) ? node.get('id') : ''
    // 操作图形
    const shape = ev.shape
    // 操作图形名称
    const shapeName = shape ? shape.get('name') : ''
    // 是否是锚点
    const isPoint = shapeName ? shapeName.indexOf('point-') !== -1 : false
    // 锚点位置
    const anchor = isPoint ? shapeName.split('-')[1] : ''
    return { mousePoint, nodeId, shape, shapeName, isPoint, anchor }
  }
  G6.registerBehavior('point-create-edge', {
    getEvents () {
      return {
        mousedown: 'onMousedown', // 鼠标按下时
        mousemove: 'onMousemove', // 鼠标移动时
        mouseup: 'onMouseup' // 鼠标松开时
      }
    },
    onMousedown (ev) {
      const graph = this.graph
      const originalEvent = ev.originalEvent
      const button = originalEvent.button
      //   button - 0 左键  1中键  2右键
      const isLeft = button === 0

      // 获取起始锚点
      const { mousePoint, nodeId, isPoint, anchor } = getEventInfo(ev)
      if (isLeft && isPoint) {
        // 左键点击时，创建边起点
        if (!this.addingEdge || !this.edge) {
          // 未开始创建边时，创建一条当前点为起点，鼠标所在位置为终点的边
          this.edge = graph.addItem('edge', {
            ...pointEdgeAttrs,
            source: nodeId,
            target: mousePoint,
            sourceAnchor: anchor
          })
          this.addingEdge = true
        }
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
    onMouseup (ev) {
      /**
       * 鼠标松开时
       * 1、在起始点锚点松开，删除边
       * 2、在非锚点松开，删除边
       * 3、在锚点松开，创建一条新边后
       * 所有操作执行结束后清除this的edge,this.addingEdge设置为false
       * */
      const graph = this.graph
      const { nodeId, isPoint, anchor } = getEventInfo(ev)
      if (this.addingEdge && this.edge) {
        if (!isPoint) {
          graph.removeItem(this.edge)
        } else {
          graph.updateItem(this.edge, {
            target: nodeId,
            targetAnchor: anchor,
            type: pointEdgeType
          })
          const data = graph.save()
          vm.data = data
        }
        this.edge = null
        this.addingEdge = false
      }
    }
  })
}

export const registerBehavior = (vm) => {
  behaviorPointCreateEdge(vm)
}
