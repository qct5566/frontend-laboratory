import {
  edgeShapeEvents,
  anchorAttrs,
  anchorSize,
  edgeAnchorZIndex,
  edgeShapeFlag
} from './G6-dataType'

export const graphEvent = (vm) => {
  // 针对元素的事件
  const itemEvents = [
    {
      // 鼠标进入锚点
      item: 'graph',
      type: 'click',
      event: 'click',
      value: false
    },
    {
      // 鼠标进入锚点
      item: 'anchor',
      type: 'anchorHover',
      event: 'mouseenter',
      value: true
    },
    {
      // 鼠标离开锚点
      item: 'anchor',
      type: 'anchorHover',
      event: 'mouseleave',
      value: false
    },
    {
      // 鼠标按住锚点
      item: 'anchor',
      type: 'anchorPress',
      event: 'mousedown',
      value: true
    },
    {
      // 鼠标松开锚点
      item: 'anchor',
      type: 'anchorPress',
      event: 'mouseup',
      value: false
    },
    {
      // 鼠标进入节点
      item: 'node',
      type: 'hover',
      event: 'node:mouseenter',
      value: true
    },
    {
      // 鼠标离开节点
      item: 'node',
      type: 'hover',
      event: 'node:mouseleave',
      value: false
    },
    {
      // 鼠标点击节点
      item: 'node',
      type: 'click',
      event: 'node:click',
      value: true
    },
    {
      // 鼠标进入边
      item: 'edge',
      type: 'hover',
      event: 'edge:mouseenter',
      value: true
    },
    {
      // 鼠标离开边
      item: 'edge',
      type: 'hover',
      event: 'edge:mouseleave',
      value: false
    },
    {
      // 鼠标点击边
      item: 'edge',
      type: 'click',
      event: 'edge:click',
      value: true
    },
    {
      // 鼠标按下边--用于重置鼠标点击边事件
      item: 'edge',
      type: 'click',
      event: 'edge:mousedown',
      value: false
    },
    {
      // 鼠标双击边
      item: 'edgeAnchor',
      type: 'dblclick',
      event: 'edge:dblclick'
    }
    // {
    //   item: 'node',
    //   type: 'drop',
    //   event: 'node:dragstart',
    //   value: false
    // },
    // {
    //   item: 'node',
    //   type: 'drag',
    //   event: 'node:drag'
    // },
    // {
    //   item: 'node',
    //   type: 'drop',
    //   event: 'node:dragend',
    //   value: true
    // }
  ]
  itemEvents.forEach((e) => {
    const itemType = e.item
    const { value, event, type } = e
    vm.graph.on(event, (ev) => {
      const item = ev.item
      const name = ev.name || ''
      const shape = ev.shape
      switch (itemType) {
        case 'anchor':
          // 锚点操作
          if (name.indexOf('anchor-') !== -1) {
            if (type === 'anchorHover') {
              shape.attr({
                shadowColor: value ? '#919fbd' : '',
                shadowBlur: 5
              })
            }
          }
          break
        case 'graph':
          // 点击事件触发
          if (type === 'click') {
            // const isEdge = item && item.get('type') === 'edge'
            const allEdge = vm.graph.getEdges()
            allEdge.forEach((e) => {
              edgeShapeEvents(e, false)
            })
          }
          break
        case 'edgeAnchor':
          if (type === 'dblclick') {
            addEdgeAnchor(ev, vm)
          }
          break
        default:
          vm.graph.setItemState(item, type, value)
          break
      }
    })
  })
}

export const addEdgeAnchor = (ev, vm) => {
  // 双击边时，在边当前位置增加一个锚点
  const item = ev.item
  const group = item.get('group')
  const model = item.get('model')
  model.controlPoints = model.controlPoints || []
  const anchorPoit = { x: ev.x - anchorSize / 2, y: ev.y - anchorSize / 2 }

  group.addShape('rect', {
    attrs: {
      ...anchorAttrs,
      ...anchorPoit
    },
    name: `${model.controlPoints.length}-${edgeShapeFlag}`,
    visible: true,
    zIndex: edgeAnchorZIndex
  })
  model.controlPoints.push(anchorPoit)
  vm.getEndData()
}
