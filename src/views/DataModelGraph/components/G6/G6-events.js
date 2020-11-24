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
      // 操作键盘
      item: 'graph',
      type: 'keydown',
      event: 'keydown',
      value: false
    },
    {
      // 操作键盘
      item: 'graph',
      type: 'keyup',
      event: 'keyup',
      value: true
    },
    {
      // 鼠标点击
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
    // {
    //   // 鼠标点击节点
    //   item: 'node',
    //   type: 'click',
    //   event: 'node:click',
    //   value: true
    // },
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
    },
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
    { // 节点拖拽结束后
      item: 'node',
      type: 'drop',
      event: 'node:dragend',
      value: true
    }
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
            // 隐藏所有边锚点锚点
            allEdge.forEach((e) => {
              edgeShapeEvents(e, false)
            })
          }
          if (type === 'keyup') {
            console.log('ev.keyCode', ev.keyCode)
            switch (ev.keyCode) {
              case 77:
                // M键切换预览图显隐
                vm.showMinimap = !vm.showMinimap
                const minimap = document.querySelector('.minimap')
                let currentMiniMapClass = minimap.getAttribute('class')
                currentMiniMapClass = vm.showMinimap
                  ? currentMiniMapClass.replace(/ minimap-hide/g, '')
                  : `${currentMiniMapClass} minimap-hide`
                minimap.setAttribute('class', currentMiniMapClass)
                break
              case 46:
              case 8:
                // backspace/delete 删除选中节点
                const allNodes = vm.graph.getNodes()
                allNodes.forEach(e => {
                  const states = e.get('states')
                  if (states.includes('selected')) {
                    vm.$nextTick(() => {
                      vm.graph.removeItem(e)
                    })
                  }
                })
                vm.getEndData()
                break
              case 17:
                // 松开Ctrl
                vm.keydownCtrl = false
                break
              case 90:
              case 89:
                // Ctrl+Z操作回退 和Ctrl + Y操作前进
                if (vm.keydownCtrl) {
                  vm.operaDataLog(ev.keyCode === 90 ? 'ctrlZ' : 'ctrlY')
                }
                break
            }
          }
          if (type === 'keydown') {
            if (ev.keyCode === 17) {
              // 按住ctrl标识
              vm.keydownCtrl = true
            }
          }
          break
        case 'edgeAnchor':
          if (type === 'dblclick') {
            addEdgeAnchor(ev, vm)
          }
          break
        default:
          vm.graph.setItemState(item, type, value)
          if (itemType === 'node' && event === 'node:dragend') {
            vm.getEndData()
          }
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
  // 将锚点插入数组对应的位置
  const leftArr = model.controlPoints.filter(e => +e.x < +anchorPoit.x)
  const currentIndex = leftArr.length
  group.addShape('rect', {
    attrs: {
      ...anchorAttrs,
      ...anchorPoit
    },
    name: `${currentIndex}-${edgeShapeFlag}`,
    visible: true,
    zIndex: edgeAnchorZIndex
  })
  model.controlPoints.splice(currentIndex, 0, anchorPoit)
  vm.getEndData()
}
