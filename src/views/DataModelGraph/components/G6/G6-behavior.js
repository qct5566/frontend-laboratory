import G6 from '@antv/g6'
import { edgeShapeFlag } from './G6-dataType'
const anchorEdgeAttrs = {
  type: 'line',
  style: {
    stroke: 'steelblue',
    lineWidth: 1,
    lineDash: [6, 3]
  }
}

const anchorEdgeType = 'edge-data-model'

const getEventInfo = (ev) => {
  const originalEvent = ev.originalEvent
  const button = originalEvent ? originalEvent.button : null
  //   button - 0 左键  1中键  2右键
  const mouseisLeft = button === 0
  // 鼠标位置
  const mousePoint = { x: ev.x, y: ev.y }
  // 节点
  const node = ev.item
  // 节点Id
  const nodeId = node && node._cfg ? node.get('id') : ''
  // 节点model
  const nodeModel = node && node._cfg ? node.get('model') : {}
  // 节点的包围盒
  const nodeBox = node && node._cfg ? node.getBBox() : {}
  // 操作图形
  const shape = ev.shape
  // 操作图形名称
  const shapeName = shape ? shape.get('name') : ''
  // 是否是节点锚点
  const isAnchor = shapeName ? shapeName.indexOf('anchor-') !== -1 : false
  // 是否是边锚点
  const isEdgeAnchor = shapeName
    ? shapeName.indexOf(`${edgeShapeFlag}`) !== -1
    : false
  // 锚点的包围盒
  const anchorBox = shape && isAnchor ? shape.getBBox() : {}
  // 锚点在数组中的下标位置
  const anchor = isAnchor ? shapeName.split('-')[1] : ''
  // 当前锚点的和节点的关系位置
  const anchorPoint = isAnchor ? shapeName.split('-')[2] : ''
  const anchorPointX = anchorPoint ? +anchorPoint.split(',')[0] : ''
  const anchorPointY = anchorPoint ? +anchorPoint.split(',')[1] : ''
  // 锚点对应数据
  const columns = nodeModel.columns || []
  const columnIndex = parseInt(anchor / 2)
  const anchorColumn = columns && columns.length ? columns[columnIndex] : {}
  return {
    mousePoint,
    node,
    nodeBox,
    nodeId,
    nodeModel,
    shape,
    shapeName,
    isAnchor,
    anchor,
    anchorBox,
    anchorPoint,
    anchorPointX,
    anchorPointY,
    anchorColumn,
    columnIndex,
    mouseisLeft,
    isEdgeAnchor
  }
}

export const setEditEdge = (key, point, model, anchorIndex) => {
  return key !== 'controlPoints'
    ? {
      [key]: point
    }
    : {
      controlPoints: model.controlPoints.map((e, i) =>
        +anchorIndex === i ? point : e
      )
    }
}

const getColumn = (node, index) => {
  console.log('node', node)
  const nodeModel = node.get('model')
  const columns = nodeModel.columns
  return columns[index]
}

// 创建和编辑边
const behaviorAnchorCreateEdge = (vm) => {
  G6.registerBehavior('anchor-create-edge', {
    getEvents () {
      return {
        'edge:mousedown': 'onEdgeMousedown', // 鼠标按下边时
        mousedown: 'onMousedown', // 鼠标按下时
        mousemove: 'onMousemove', // 鼠标移动时
        mouseup: 'onMouseup' // 鼠标松开时
      }
    },
    onMousedown (ev) {
      // 创建边流程
      const graph = this.graph

      // 获取起始锚点
      const {
        mousePoint,
        node,
        nodeId,
        anchorColumn,
        isAnchor,
        anchor,
        anchorPointX,
        anchorPointY,
        columnIndex,
        mouseisLeft
      } = getEventInfo(ev)
      if (mouseisLeft && isAnchor) {
        // 左键点击时，创建边起点
        if (!this.addingEdge || !this.edge) {
          // 未开始创建边时，创建一条当前点为起点，鼠标所在位置为终点的边
          this.edge = graph.addItem('edge', {
            ...anchorEdgeAttrs,
            source: nodeId,
            target: mousePoint,
            sourceAnchor: anchor,
            fromArrow: '0,n',
            fromTableColumnId: anchorColumn.columnType
          })
          this.sourceNode = node
          this.sourceNodeId = nodeId
          this.sourceColumnType = anchorColumn.columnType
          this.sourceAnchorX = anchorPointX
          this.sourceAnchorY = anchorPointY
          this.sourceColumnIndex = columnIndex
          this.addingEdge = true
        }
      }
    },
    onEdgeMousedown (ev) {
      // 编辑边流程
      // 编辑边时，先判断是否按住的是边锚点

      // 如果按住的是开始锚点，则起点为折线锚点组的第一个锚点，终点为当前鼠标位置，生成直线

      // 如果按住的是终点锚点，则起点为折线锚点组的最后一个锚点，终点为当前鼠标位置，生成直线

      // 如果按住是折线锚点组中的任意一个，
      // 则起点锚点为所有锚点中位于其上一个的锚点，终点为其下一个的锚点，鼠标所在位置生成折线点

      // 获取起始锚点
      const { mousePoint, mouseisLeft, shapeName, isEdgeAnchor } = getEventInfo(
        ev
      )
      const graph = this.graph
      const edge = ev.item
      const model = edge.get('model')
      // 左键点击边锚点
      if (mouseisLeft && isEdgeAnchor) {
        const isStart = shapeName.indexOf('start-') !== -1
        const isEnd = shapeName.indexOf('end-') !== -1
        const editType = isStart ? 'start' : isEnd ? 'end' : 'L'
        const LIndex = shapeName.split(`-${edgeShapeFlag}`)[0]
        console.log('edge', edge)
        // 开始编辑边
        if (!this.editingEdge || !this.edge) {
          switch (editType) {
            case 'start':
              this.editKey = 'source'
              break
            case 'end':
              this.editKey = 'target'
              break
            case 'L':
              this.editKey = 'controlPoints'
              break
          }
          const editEdge = {
            ...model,
            ...setEditEdge(this.editKey, mousePoint, model, LIndex),
            oldEdgeId: model.id
          }
          delete editEdge.id
          this.edge = graph.addItem('edge', {
            ...editEdge,
            ...anchorEdgeAttrs,
            type: 'polyline'
          })
          // 用于鼠标松开时，获取和目标点对应的起始点数据
          this.sourceNodeId = model[editType === 'start' ? 'target' : 'source']
          const anchorPointIndex =
            model[editType === 'start' ? 'endPoint' : 'startPoint'].index
          const columnIndex = parseInt(anchorPointIndex / 2)
          const sourceNode = edge._cfg[editType === 'start' ? 'targetNode' : 'sourceNode']
          const column = getColumn(
            sourceNode,
            columnIndex
          )
          this.sourceColumnType = column.columnType
          const sourceModel = sourceNode.get('model')
          const sourceAnchorPoints = sourceModel.anchorPoints[anchorPointIndex]
          this.sourceAnchorY = sourceAnchorPoints[1]
          // 边model
          this.edgeModel = model
          // 编辑的边锚点下标
          this.edgeLIndex = LIndex
          // 编辑的节点类型
          this.editType = editType
          // 被编辑的原边
          this.oldEdge = edge
          // 是否正在编辑边
          this.editingEdge = true
        }
      }
    },
    // getEvents 中定义的 mousemove 的响应函数
    onMousemove (ev) {
      // 鼠标的当前位置
      const point = { x: ev.x, y: ev.y }
      if ((this.addingEdge || this.editingEdge) && this.edge) {
        // 更新边的结束点位置为当前鼠标位置
        const editEdge = this.addingEdge
          ? {
            target: point
          }
          : setEditEdge(this.editKey, point, this.edgeModel, this.edgeLIndex)
        this.graph.updateItem(this.edge, editEdge)
      }
    },
    onMouseup (ev) {
      /**
       * 鼠标松开时
       * 1、在 起始节点 且 起始锚点同行的 任意锚点 相连时，不创建边
       * 2、在 非锚点 松开，不创建边
       * 3、在 其他节点的 任意锚点 松开，创建一条新边
       * 4、在 起始节点 且 起始锚点非同行的 其他 数据类型相同的锚点 松开时，创建一条边
       * 所有操作执行结束后清除this的edge,this.addingEdge设置为false
       * */
      const graph = this.graph
      const {
        nodeId,
        isAnchor,
        anchor,
        anchorPointY,
        anchorColumn
      } = getEventInfo(ev)
      const isSameNode = this.sourceNodeId === nodeId
      const isSameRowAnchor = anchorPointY === this.sourceAnchorY
      const isSameColumnType =
        anchorColumn.columnType === this.sourceColumnType
      if (this.addingEdge && this.edge) {
        if (!isAnchor || (isSameNode && isSameRowAnchor) || !isSameColumnType) {
          graph.removeItem(this.edge)
        } else {
          // 同节点且同边相连时，增加一个折线锚点,anchorPointX---0 左边 1右边
          // const controlPoints =isSameAnchorX? [{}]
          /**
           * 折线规则  s-起始 t-目标
           * 1、s锚点和t锚点在同节点同一侧
           * 添加一个折线坐标，x轴位于30的绝对值，y轴位于两锚点的中间
           * 2、s锚点和t锚点在同节点不同侧
           * 添加两个折线坐标
           * 第一个坐标 x轴 位于s锚点30的绝对值位置，
           *           y轴 如果起始锚点在节点一半的上方，
           */
          console.log('this.edge', this.edge)
          graph.updateItem(this.edge, {
            target: nodeId,
            targetAnchor: anchor,
            type: anchorEdgeType,
            controlPoints: [],
            toTableColumnId: anchorColumn.columnType,
            toArrow: '1'
          })
          // 更新起始点的FK值
          const sourceNodeModel = this.sourceNode.get('model')
          const sourceNodeIndex = vm.data.nodes.findIndex(
            (e) => e.id === sourceNodeModel.id
          )
          const newSource = {
            ...sourceNodeModel,
            columns: sourceNodeModel.columns.map((e, i) => {
              return {
                ...e,
                isFk: this.sourceColumnIndex === i ? 1 : e.isFk
              }
            })
          }
          vm.data.nodes.splice(sourceNodeIndex, 1, newSource)
          graph.updateItem(this.sourceNodeId, newSource)

          vm.getEndData()
        }
        this.edge = null
        this.addingEdge = false
      } else if (this.editingEdge && this.edge) {
        // 编辑边
        const isEditL = this.editType === 'L'
        console.log('isAnchor', isAnchor, isSameNode, isSameRowAnchor, isSameColumnType)
        const isRemove = isEditL
          ? false
          : !isAnchor || (isSameNode && isSameRowAnchor) || !isSameColumnType
        if (!isRemove) {
          let editEdgeEnd = {}
          if (isEditL) {
            console.log('this.edge', this.edge)
            const edgeModel = this.edge.get('model')
            editEdgeEnd = {
              controlPoints: edgeModel.controlPoints || []
            }
          } else {
            // 起始点被改变时，执行节点锚点添加逻辑
            switch (this.editType) {
              case 'start':
                editEdgeEnd = {
                  source: nodeId,
                  sourceAnchor: anchor,
                  fromTableColumnId: anchorColumn.columnType
                }
                break
              case 'end':
                editEdgeEnd = {
                  target: nodeId,
                  targetAnchor: anchor,
                  toTableColumnId: anchorColumn.columnType
                }
                break
            }
          }
          vm.graph.updateItem(this.oldEdge, { ...editEdgeEnd, type: anchorEdgeType })
          vm.getEndData()
        }
        graph.removeItem(this.edge)
        this.oldEdge = null
        this.edge = null
        this.editingEdge = false
      }
    }
  })
}

export const registerBehavior = (vm) => {
  behaviorAnchorCreateEdge(vm)
}
