export const graphEvent = (vm) => {
  // 针对元素的事件
  const itemEvents = [
    {
      // 鼠标进入锚点
      item: 'point',
      type: 'pointHover',
      event: 'mouseenter',
      value: true
    },
    {
      // 鼠标离开锚点
      item: 'point',
      type: 'pointHover',
      event: 'mouseleave',
      value: false
    },
    {
      // 鼠标按住锚点
      item: 'point',
      type: 'pointPress',
      event: 'mousedown',
      value: true
    },
    {
      // 鼠标松开锚点
      item: 'point',
      type: 'pointPress',
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
  itemEvents.forEach((e) => {
    const itemType = e.item
    const { value, event, type } = e
    vm.graph.on(event, (ev) => {
      const item = ev.item
      const name = ev.name || ''
      switch (itemType) {
        case 'point':
          // 锚点操作
          if (name.indexOf('point-') !== -1) {
            const shape = ev.shape
            if (type === 'pointHover') {
              shape.attr({
                shadowColor: value ? '#919fbd' : '',
                shadowBlur: 5
              })
            }
            if (type === 'pointPress') {
            }
          }
          break
        default:
          vm.graph.setItemState(item, type, value)
          break
      }
    })
  })
}
