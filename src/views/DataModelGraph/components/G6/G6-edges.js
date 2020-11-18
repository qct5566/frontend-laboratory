import G6 from '@antv/g6'

const EdgeDataModel = (vm) => {
  const stroke = '#666'
  const lineWidth = 1
  const fill = '#fff'
  const shorten = 24
  console.log('lineWidth', stroke, fill, lineWidth)
  const getEdgeData = (cfg, group) => {
    // 定义边数据
    console.log('cfg, group', cfg, group)
    const currentEdge = group.get('children')[0]
    const sourceNode = vm.graph.findById(cfg.source)
    const targetNode = vm.graph.findById(cfg.target)
    const sourceNodeBox = sourceNode.getBBox()
    const targetNodeBox = targetNode.getBBox()
    const sourceNodeModel = sourceNode.get('model')
    const targetNodeModel = targetNode.get('model')
    return {
      currentEdge,
      sourceNode,
      targetNode,
      sourceNodeModel,
      targetNodeModel,
      sourceNodeBox,
      targetNodeBox
    }
  }
  const getShorterPath = (sA, tA, box, isCross) => {
    const margin = 10
    let topDistance, bottomDistance
    let shorter = 0

    // let path = [];

    if (isCross) {
      topDistance = box.minY - margin - tA.y
      bottomDistance = box.maxY + margin - tA.y
      const isTop = (Math.abs(topDistance) < Math.abs(bottomDistance))
      if (isTop) {
        shorter = box.minY - margin - sA.y
      } else {
        shorter = box.maxY + margin - sA.y
      }
    }

    return shorter
  }
  G6.registerEdge(
    'edge-data-model',
    {
      draw (cfg, group) {
        const { sourceNodeBox, targetNodeBox } = getEdgeData(cfg, group)
        const sBox = sourceNodeBox
        const tBox = targetNodeBox
        const s1 = cfg.startPoint
        const t1 = cfg.endPoint
        // 箭头方向
        const sPosition = (sBox.minX === s1.x) ? -1 : 1
        const tPosition = (tBox.minX === t1.x) ? -1 : 1

        // 根据箭头重新固定起点
        const s2 = { x: s1.x + sPosition * shorten, y: s1.y }
        const t2 = { x: t1.x + tPosition * shorten, y: t1.y }

        const gapX = t2.x - s2.x
        const gapY = t2.y - s2.y

        // 判断线条有没有穿过表
        const sIsCross = sPosition * gapX < 0
        const tIsCross = -tPosition * gapX < 0
        const path = [['M', s1.x, s1.y]]
        path.push(['L', s2.x, s2.y])
        const ctrlPoints = [] // cfg.origin.controlPoints
        if (ctrlPoints && ctrlPoints.length > 2) {
          for (var i = 1; i < ctrlPoints.length - 1; i++) {
            path.push(['L', ctrlPoints[i].x, ctrlPoints[i].y])
          }
        } else {
          const sY = getShorterPath(s2, t2, sBox, sIsCross)
          const tY = getShorterPath(t2, s2, tBox, tIsCross)
          if (sY !== 0 && tY !== 0) {

          }
          if (gapX > 0) {
            // source锚点在左
            if (sY !== 0) {
              path.push(['L', s2.x, s2.y + sY])
            }
            path.push(['L', s2.x + gapX / 2, s2.y + sY])
            path.push(['L', t2.x - gapX / 2, t2.y + tY])
            if (tY !== 0) {
              path.push(['L', t2.x, t2.y + tY])
            }
          } else {
            // source锚点在右
            path.push(['L', s2.x, s2.y + gapY / 2])
            path.push(['L', t2.x, t2.y - gapY / 2])
          }
        }

        path.push(['L', t2.x, t2.y])
        path.push(['L', t1.x, t1.y])

        console.log('sPosition', path)

        const edgeShape = group.addShape('path', {
          attrs: {
            stroke,
            path
            // path: [
            //   ['M', startPoint.x, startPoint.y],
            //   ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
            //   ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
            //   ['L', endPoint.x, endPoint.y]
            // ]
          },
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: 'path-shape'
        })
        return edgeShape
      },
      // getShorterPath: function (sA, tA, box, isCross) {
      //   const margin = 10
      //   let topDistance, bottomDistance
      //   let shorter = 0

      //   // const path = []

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
      // },
      // getPath: function (cfg, group, s, t) {
      //   const shorten = 24
      //   const sBox = s.getBBox()
      //   const tBox = t.getBBox()
      //   const points = cfg.points
      //   const s1 = points[0]
      //   const t1 = points[points.length - 1]

      //   // 箭头方向
      //   const sPosition = (+sBox.minX === +s1.x) ? -1 : 1
      //   const tPosition = (+tBox.minX === +t1.x) ? -1 : 1

      //   // 根据箭头重新固定起点
      //   const s2 = { x: s1.x + sPosition * shorten, y: s1.y }
      //   const t2 = { x: t1.x + tPosition * shorten, y: t1.y }

      //   const gapX = t2.x - s2.x
      //   const gapY = t2.y - s2.y

      //   // 判断线条有没有穿过表
      //   const sIsCross = sPosition * gapX < 0
      //   const tIsCross = -tPosition * gapX < 0

      //   const path = [['M', s1.x, s1.y]]
      //   path.push(['L', s2.x, s2.y])
      //   const ctrlPoints = cfg.origin.controlPoints
      //   if (ctrlPoints && ctrlPoints.length > 2) {
      //     for (var i = 1; i < ctrlPoints.length - 1; i++) {
      //       path.push(['L', ctrlPoints[i].x, ctrlPoints[i].y])
      //     }
      //   } else {
      //     const sY = +this.getShorterPath(s2, t2, sBox, sIsCross)
      //     const tY = +this.getShorterPath(t2, s2, tBox, tIsCross)
      //     if (sY !== 0 && tY !== 0) {

      //     }
      //     if (gapX > 0) {
      //       // source锚点在左
      //       if (sY !== 0) {
      //         path.push(['L', s2.x, s2.y + sY])
      //       }
      //       path.push(['L', s2.x + gapX / 2, s2.y + sY])
      //       path.push(['L', t2.x - gapX / 2, t2.y + tY])
      //       if (tY !== 0) {
      //         path.push(['L', t2.x, t2.y + tY])
      //       }
      //     } else {
      //       // source锚点在右
      //       path.push(['L', s2.x, s2.y + gapY / 2])
      //       path.push(['L', t2.x, t2.y - gapY / 2])
      //     }
      //   }

      //   path.push(['L', t2.x, t2.y])
      //   path.push(['L', t1.x, t1.y])
      //   return path
      // },
      afterDraw: function (cfg, group) {
        // const { currentEdge, sourceNodeModel, targetNodeModel } = getEdgeData(
        //   cfg,
        //   group
        // )
        // console.log(
        //   'nodeModel',
        //   currentEdge,
        //   sourceNodeModel,
        //   targetNodeModel
        // )
        // currentEdge.attr({
        //   stroke,
        //   lineWidth
        //   // path: [

        //   // ]
        // })
        // const edgeModel = {
        //   ...edge,
        //   sourceAnchor,
        //   targetAnchor
        // }
        // edge.set('sourceAnchor', sourceAnchor)
        // edge.set('targetAnchor', targetAnchor)

        // cfg.origin.relation = cfg.origin.relation || '0,n:1'
        // var points = cfg.points
        // var s1 = points[0]
        // var e1 = points[points.length - 1]
        // var s2 = keyShape.getPoint(0.01)
        // var e2 = keyShape.getPoint(0.99)

        // const r = 4
        // const x = -15
        // const y = 0
        // const relationArrow = {
        //   '0,1': {
        //     attrs: {
        //       x: 0,
        //       y: 0,
        //       path:
        //         'M' +
        //         x +
        //         ',' +
        //         (y - r) +
        //         'a ' +
        //         r +
        //         ',' +
        //         r +
        //         ',0,1,1,0,' +
        //         2 * r +
        //         'a ' +
        //         r +
        //         ',' +
        //         r +
        //         ',0,1,1,0,' +
        //         -2 * r +
        //         'M ' +
        //         (x + r + 1) +
        //         ',' +
        //         (r + 1) +
        //         'L ' +
        //         (x + r + 1) +
        //         ',' +
        //         (-r - 1) +
        //         'M ' +
        //         (x + r + 1) +
        //         ',0' +
        //         'L 0,0' +
        //         'z',

        //       stroke,
        //       fill
        //     },
        //     class: 'arrow',
        //     zIndex: 10
        //   },
        //   '0,n': {
        //     attrs: {
        //       x: 0,
        //       y: 0,
        //       path:
        //         'M' +
        //         x +
        //         ',' +
        //         (y - r) +
        //         'a ' +
        //         r +
        //         ',' +
        //         r +
        //         ',0,1,1,0,' +
        //         2 * r +
        //         'a ' +
        //         r +
        //         ',' +
        //         r +
        //         ',0,1,1,0,' +
        //         -2 * r +
        //         'M ' +
        //         (x + r + 1) +
        //         ',' +
        //         (r + 1) +
        //         'L ' +
        //         (x + r + 1) +
        //         ',' +
        //         (-r - 1) +
        //         'M ' +
        //         (x + r + 1) +
        //         ',' +
        //         y +
        //         'L ' +
        //         y +
        //         ',-' +
        //         r +
        //         'M ' +
        //         (x + r + 1) +
        //         ',' +
        //         y +
        //         'L ' +
        //         y +
        //         ',' +
        //         r +
        //         'M ' +
        //         (x + r + 1) +
        //         ',0' +
        //         'L 0,0' +
        //         'z',

        //       stroke: this.stroke,
        //       fill: '#fff'
        //     },
        //     class: 'arrow',
        //     zIndex: 10
        //   },
        //   1: {
        //     attrs: {
        //       x: 0,
        //       y: 0,
        //       path:
        //         'M ' +
        //         (x + r + 1) +
        //         ',' +
        //         (r + 1) +
        //         'L ' +
        //         (x + r + 1) +
        //         ',' +
        //         (-r - 1) +
        //         'M ' +
        //         (x + r + 1) +
        //         ',0' +
        //         'L 0,0' +
        //         'z',

        //       stroke: this.stroke,
        //       fill: '#fff'
        //     },
        //     class: 'arrow',
        //     zIndex: 10
        //   },
        //   '1,n': {
        //     attrs: {
        //       x: 0,
        //       y: 0,
        //       path:
        //         'M ' +
        //         (x + r + 1) +
        //         ',' +
        //         (r + 1) +
        //         'L ' +
        //         (x + r + 1) +
        //         ',' +
        //         (-r - 1) +
        //         'M ' +
        //         (x + r + 1) +
        //         ',' +
        //         y +
        //         'L ' +
        //         y +
        //         ',-' +
        //         r +
        //         'M ' +
        //         (x + r + 1) +
        //         ',' +
        //         y +
        //         'L ' +
        //         y +
        //         ',' +
        //         r +
        //         'M ' +
        //         (x + r + 1) +
        //         ',0' +
        //         'L 0,0' +
        //         'z',

        //       stroke: this.stroke,
        //       fill: '#fff'
        //     },
        //     class: 'arrow',
        //     zIndex: 10
        //   },
        //   0: {
        //     attrs: {
        //       x: 0,
        //       y: 0,
        //       path:
        //         'M' +
        //         x +
        //         ',' +
        //         (y - r) +
        //         'a ' +
        //         r +
        //         ',' +
        //         r +
        //         ',0,1,1,0,' +
        //         2 * r +
        //         'a ' +
        //         r +
        //         ',' +
        //         r +
        //         ',0,1,1,0,' +
        //         -2 * r,
        //       stroke: this.stroke,
        //       fill: '#fff'
        //     },
        //     class: 'arrow',
        //     zIndex: 10
        //   }
        // }
        // console.log(relationArrow)
        // // if (cfg.origin.relation) {
        // //   var relation = cfg.origin.relation.split(':')
        // //   if (relation.length === 2 && s2) {
        // //     var startArrow = group.addShape('path', relationArrow[relation[0]])
        // //     G6.Util.arrowTo(startArrow, s1.x, s1.y, s2.x, s2.y, s1.x, s1.y)
        // //     var endArrow = group.addShape('path', relationArrow[relation[1]])
        // //     G6.Util.arrowTo(endArrow, e1.x, e1.y, e2.x, e2.y, e1.x, e1.y)
        // //   }
        // // }
        // console.log('endcfg', cfg, group)
      },
      update: undefined
    }
    // 'polyline'
  )
}
export const registerEdge = (vm) => {
  EdgeDataModel(vm)
}
