import G6 from '@antv/g6'
import { isChinese } from '../utils'

const NodeDataTheme = (vm) => {
  const backColor = '#f5f5ef'
  const hoverBackColor = '#4a5e89'
  const nodeWidth = 200
  const nodeHeight = 30
  const nodeSpacing = 300
  const gridWidth = 99999
  let gridTop
  let gridBottom
  const NodeDataThemeDrop = async (item, name) => {
    // 节点拖拽逻辑
    // 拖拽结束时，判断当前位置范围内是否有节点，如果有，这找到该y轴范围最后一个节点,插入到该位置
    // 当边已经存在时不做动作，当不存在边时，自动与y轴范围右侧最后一个节点做关联
    const currentNodeInDataIndex = vm.data.nodes.findIndex(e => e.id === item._cfg.id)
    const currentNodeBox = item.getBBox()
    const currentNodeBoxX = currentNodeBox.x
    const currentNodeBoxY = currentNodeBox.y
    // 判断是否重叠，重叠时，找到当前Y轴范围最后一个节点，加到其后面
    const overlapNode = vm.graph.findAll('node', node => {
      const findNodeModel = node.get('model')
      const findNodeX = findNodeModel.x
      const findNodeY = findNodeModel.y
      return findNodeModel.id !== item._cfg.id &&
      Math.abs(currentNodeBoxY - findNodeY) < nodeHeight &&
       Math.abs(currentNodeBoxX - findNodeX) < nodeWidth + 100
    })
    // 获取Y轴范围内的其他所有节点
    const findYNodes = vm.graph.findAll('node', node => {
      const findNodeModel = node.get('model')
      const findNodeY = findNodeModel.y
      return findNodeModel.id !== item._cfg.id && Math.abs(currentNodeBoxY - findNodeY) < nodeHeight
    })
    // 获取当前节点所有边
    const currentEdges = item.getEdges()
    // 判断是否有边
    const hasEdges = currentEdges && currentEdges.length
    const currentDataNode = vm.data.nodes[currentNodeInDataIndex]
    // Y轴范围内的最后一个其他节点
    const lastYNode = findYNodes.length > 0 ? findYNodes[findYNodes.length - 1] : null
    const lastYNodeModel = lastYNode ? lastYNode.get('model') : { x: 0, y: 0 }
    if (name === 'drop') {
      if (hasEdges) {
        const newModel = currentDataNode
        // 边存在且有重叠节点时，把当前节点放在最后一个Y左边的后面
        if (findYNodes && findYNodes.length) {
          newModel.y = lastYNodeModel.y
          // 隐藏定位节点的定位线
          if (overlapNode && overlapNode.length) {
            newModel.x = lastYNodeModel.x + nodeSpacing
          }
          vm.data.nodes.splice(currentNodeInDataIndex, 1, newModel)
          vm.graph.updateItem(item, newModel)
          vm.changeData()
        }
      } else {
      // 边不存在时，如果Y轴范围有节点，根据边添加逻辑添加一条新的边
        if (findYNodes && findYNodes.length) {
          vm.data.nodes.splice(currentNodeInDataIndex, 1)
          const dropNode = {
            ...currentDataNode,
            x: lastYNodeModel.x + nodeSpacing,
            y: lastYNodeModel.y
          }
          vm.data.nodes.push(dropNode)
          vm.changeData(dropNode)
        }
      }
      gridTop.hide()
      gridBottom.hide()
    } else if (name === 'drag') {
      // 展示定位节点的定位线
      if (gridTop) gridTop.hide()
      if (gridBottom) gridBottom.hide()
      if (lastYNode) {
      // const lastYNodeItem = vm.graph.findById(lastYNode.cfg.id)
        const lastYNodeGroup = lastYNode.get('group')
        const lastYNodechildren = lastYNodeGroup.get('children')
        gridTop = lastYNodechildren.find(e => e.cfg.name === 'gridTop')
        gridBottom = lastYNodechildren.find(e => e.cfg.name === 'gridBottom')
        gridTop.show()
        gridBottom.show()
      }
    }
  }
  G6.registerNode(
    'node-data-theme',
    {
      // 绘制
      draw (cfg, group) {
        const backShape = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: nodeWidth,
            height: nodeHeight,
            fill: backColor,
            cursor: 'move'
          },
          name: 'backShape',
          draggable: true
        })
        const hasFlagColor = cfg.flagColor
        const flagBackground = hasFlagColor
          ? `background:${cfg.flagColor}`
          : hoverBackColor
        const flagShape = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 10,
            height: nodeHeight,
            fill: flagBackground,
            cursor: 'move'
          },
          name: 'flagShape',
          draggable: true
        })
        const newText = []
        const maxShowText = 14
        let currentLen = 0
        cfg.name.split('').forEach(e => {
          currentLen = newText.reduce((a, b) => {
            return a + (isChinese(b) ? 2 : 1)
          }, 0)
          if (currentLen < maxShowText) newText.push(e)
        })
        const showText = newText.join('')
        const maxTextLen = cfg.name.split('').reduce((a, b) => {
          return a + (isChinese(b) ? 2 : 1)
        }, 0)
        const currentTextLen = newText.reduce((a, b) => {
          return a + (isChinese(b) ? 2 : 1)
        }, 0)
        const nameShape = group.addShape('text', {
          attrs: {
            text: maxTextLen > currentTextLen ? showText + '...' : showText,
            fontSize: 14,
            fill: '#333',
            cursor: 'move'
          },
          name: 'nameShape',
          draggable: true
        })
        const nameBox = nameShape.getBBox()
        const flagbox = flagShape.getBBox()
        const backBox = backShape.getBBox()
        // const padding = 20
        // 配置盒子宽度
        // const backShapeWidth = nameBox.width + padding * 2 + flagbox.width
        backShape.attr({
          // width: backShapeWidth
        })
        nameShape.attr({
          x: (backBox.width - flagbox.width - nameBox.width) / 2,
          y: 24
        })
        group.addShape('rect', {
          attrs: {
            x: nameBox.x,
            y: nameBox.y,
            width: nameBox.width,
            height: nameBox.height,
            fill: '#333',
            opacity: 0
          },
          name: 'flagShape',
          draggable: true,
          zIndex: 20
        })
        group.addShape('path', {
          attrs: {
            stroke: '#c0c0c0',
            lineWidth: 1,
            path: [
              ['M', -gridWidth, backBox.y],
              ['L', gridWidth, backBox.y]
            ]
          },
          name: 'gridTop',
          zIndex: 999,
          visible: false
        })
        group.addShape('path', {
          attrs: {
            stroke: '#c0c0c0',
            lineWidth: 1,
            path: [
              ['M', -gridWidth, backBox.y + nodeHeight],
              ['L', gridWidth, backBox.y + nodeHeight]
            ]
          },
          name: 'gridBottom',
          zIndex: 999,
          visible: false
        })
        return backShape
      },
      setState (name, value, item) {
        const group = item.getContainer()
        const children = group.get('children')
        const backShape = children.find(e => e.cfg.name === 'backShape')
        const nameShape = children.find(e => e.cfg.name === 'nameShape')
        const model = item.get('model')
        if (name === 'hover') {
          backShape.attr({
            fill: value ? hoverBackColor : backColor
          })
          nameShape.attr({
            fill: value ? '#fff' : '#333'
          })
        }
        if (name === 'drop') {
          if (value) {
            const currentNodeIndex = vm.data.nodes.findIndex(e => e.id === model.id)
            const currentNode = vm.data.nodes[currentNodeIndex]
            vm.data.nodes.splice(currentNodeIndex, 1, {
              ...currentNode,
              x: model.x,
              y: model.y
            })
            vm.emitData(vm.data)
            vm.$nextTick(() => {
              NodeDataThemeDrop(item, name)
            })
          }
        }
        if (name === 'drag') {
          NodeDataThemeDrop(item, name)
        }
      }
    },
    'single-node'
  )
}

export const registerNode = (vm) => {
  NodeDataTheme(vm)
}
