import G6 from '@antv/g6'

const EdgeDataModel = (vm) => {
  const stroke = '#666' // 边的颜色
  const lineWidth = 1 // 边的粗细
  // const fill = '#fff' // 边的填充色
  const lineAppendWidth = 3 // 边的相应范围
  // const shorten = 24
  const getEdgeData = (cfg, group) => {
    // 定义边数据
    // console.log('cfg, group', cfg, group)
    const currentEdge = group.get('children')[0]
    const sourceNode = vm.graph.findById(cfg.source)
    const targetNode = vm.graph.findById(cfg.target)
    const sourceNodeBox = sourceNode.getBBox()
    const targetNodeBox = targetNode.getBBox()
    const sourceNodeModel = sourceNode.get('model')
    const targetNodeModel = targetNode.get('model')
    const sPoint = cfg.startPoint
    const tPoint = cfg.endPoint
    return {
      currentEdge,
      sourceNode,
      targetNode,
      sourceNodeModel,
      targetNodeModel,
      sourceNodeBox,
      targetNodeBox,
      sPoint,
      tPoint
    }
  }
  const getArrowType = () => {
    // 配置箭头类型
    const r = 4
    const x = 15
    const y = 0
    return {
      '0,1': {
        attrs: {
          path: 'M' + x + ',' + (y - r) +
          ' a ' + r + ',' + r + ',0,1,1,0,' + (2 * r) +
          ' a ' + r + ',' + r + ',0,1,1,0,' + (-2 * r) +
          ' M ' + (x - r) + ',' + (r + 1) +
          ' L ' + (x - r) + ',' + (-r - 1) +
          ' M ' + (x - r) + ',0' +
          ' L 0,0' +
          ' Z'
        }
      },
      '0,n': {
        attrs: {
          path: 'M' + x + ',' + (y - r) +
          ' a ' + r + ',' + r + ',0,1,1,0,' + (2 * r) +
          ' a ' + r + ',' + r + ',0,1,1,0,' + (-2 * r) +
          ' M ' + (x - r) + ',' + (r + 1) +
          ' L ' + (x - r) + ',' + (-r - 1) +
          ' M ' + (x - r) + ',' + y +
          ' L ' + y + ',-' + r +
          ' M ' + (x - r) + ',' + y +
          ' L ' + y + ',' + r +
          ' M ' + (x - r) + ',0' +
          ' L 0,0' +
          ' z'
        }
      },
      1: {
        attrs: {
          path: 'M ' + (x - r) + ',' + (r + 1) +
          'L ' + (x - r) + ',' + (-r - 1) +
          'M ' + (x - r) + ',0' +
          'L 0,0' +
          'z'
        }
      },
      '1,n': {
        attrs: {
          path: 'M ' + (x - r) + ',' + (r + 1) +
          'L ' + (x - r) + ',' + (-r - 1) +
          'M ' + (x - r) + ',' + y +
          'L ' + y + ',-' + r +
          'M ' + (x - r) + ',' + y +
          'L ' + y + ',' + r +
          'M ' + (x - r) + ',0' +
          'L 0,0' +
          'z'
        }
      },
      0: {
        attrs: {
          path: 'M' + x + ',' + (y - r) +
          'a ' + r + ',' + r + ',0,1,1,0,' + (2 * r) +
          'a ' + r + ',' + r + ',0,1,1,0,' + (-2 * r)
        }
      }
    }
  }
  // const getShorterPath = (sA, tA, box, isCross) => {
  //   const margin = 10
  //   let topDistance, bottomDistance
  //   let shorter = 0

  //   // let path = [];

  //   if (isCross) {
  //     topDistance = box.minY - margin - tA.y
  //     bottomDistance = box.maxY + margin - tA.y
  //     const isTop = (Math.abs(topDistance) < Math.abs(bottomDistance))
  //     if (isTop) {
  //       shorter = box.minY - margin - sA.y
  //     } else {
  //       shorter = box.maxY + margin - sA.y
  //     }
  //   }

  //   return shorter
  // }
  G6.registerEdge(
    'edge-data-model',
    {
      draw (cfg, group) {
        const { sPoint, tPoint } = getEdgeData(cfg, group)
        // 获取起点和终点坐标
        const pathStart = ['M', sPoint.x, sPoint.y]
        const pathEnd = ['L', tPoint.x, tPoint.y]

        // 获取边锚点
        const controlPoints = cfg.controlPoints || []
        const hasControl = controlPoints.length > 0
        let path = []
        // 边锚点存在时，按照边锚点添加折线，否则按照默认规则添加
        if (hasControl) {
          path = controlPoints.map(controlPoint => ['L', controlPoint.x, controlPoint.y])
        } else {
          /**
           * 默认规则：
           * 连线时只连接头尾，当双击边的某个位置时，增加一个折线锚点，可拖动折线锚点到需要的位置
           * */
        }
        path.unshift(pathStart)
        path.push(pathEnd)

        // 获取箭头
        const relationArrow = getArrowType()
        const startArrow = relationArrow[cfg.fromArrow || '0,n']
        const endArrow = relationArrow[cfg.toArrow || '1']
        // 配置边图形
        const edgeShape = group.addShape('path', {
          attrs: {
            stroke,
            lineWidth,
            lineAppendWidth,
            path,
            startArrow: {
              path: startArrow.attrs.path
            },
            endArrow: {
              path: endArrow.attrs.path
            }
          },
          name: 'path-shape'
        })
        return edgeShape
      },
      afterDraw: function (cfg, group) {},
      setState (name, value, item) {
        const cfg = item.get('model')
        const group = item.get('group')
        const { currentEdge } = getEdgeData(cfg, group)
        const hoverStroke = '#1D95E2'// 边的颜色
        if (name === 'hover') {
          currentEdge.attr({
            stroke: value ? hoverStroke : stroke
          })
          // console.log('currentEdge', currentEdge)
        }
      },
      update: undefined
    }
    // 'line'
  )
}
export const registerEdge = (vm) => {
  EdgeDataModel(vm)
}
