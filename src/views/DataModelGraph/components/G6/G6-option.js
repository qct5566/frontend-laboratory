import G6 from '@antv/g6'
import { edgeShapeFlag, backRectFill } from './G6-dataType'
import { addEdgeAnchor } from './G6-events'
const defaultRightMenus = [
  // 默认右键菜单
  {
    label: '对应关系',
    value: 'setEdgeType'
  },
  {
    label: '删除连接线',
    value: 'delEdge'
  }
]

let menus = []
let currentEv = {}

// 配置插件
const plugins = (vm) => {
  return [
    // 网格 需要启用网格去掉注释即可
    new G6.Grid({
      // img:''  //String ,grid 图片，base64 格式字符串
    }),
    // 边的右键菜单配置
    new G6.Menu({
      className: 'mouse-right-menu',
      itemTypes: ['edge'], // 限制只有边开启菜单
      getContent (ev) {
        currentEv = ev
        const shape = ev.shape
        const shapeName = shape ? shape.get('name') : ''
        const isEdgeAnchor = shapeName.indexOf(edgeShapeFlag) !== -1
        const lastMenu = {
          label: isEdgeAnchor ? '删除锚点' : '添加锚点',
          value: isEdgeAnchor ? 'delEdgeAnchor' : 'addEdgeAnchor',
          shape
        }
        menus = [...defaultRightMenus, lastMenu]
        const rightMenus = vm.rightMenus || menus
        const outDiv = document.createElement('div')
        // outDiv.setAttribute('class', 'mouse-right-menu')
        const domArr = rightMenus.map((e) => {
          const isDel = e.value.indexOf('del') !== -1
          return `<div 
          class="mouse-right-menu-item ${isDel ? 'del-menu' : ''}" 
           value-menu="${e.value}">
           ${e.label}
           </div>`
        })
        outDiv.innerHTML = domArr.join().replace(/,/g, '')
        return outDiv
      },
      shouldBegin (ev) {
        const item = ev.item
        // 被选中时才能打开右键菜单
        const selected = item.get('selected')
        return !!selected
      },
      handleMenuClick (target, item) {
        const type = target.getAttribute('value-menu')
        const currentMenu = menus.find((e) => e.value === type)
        const currentShape = currentMenu ? currentMenu.shape : {}
        const group = item.get('group')
        const model = item.get('model')
        let name = ''
        let index
        switch (type) {
          case 'setEdgeType':
            vm.setEdgeTypeModal(item)
            break
          case 'delEdge':
            vm.graph.removeItem(item)
            break
          case 'delEdgeAnchor':
            name = currentShape.get('name')
            index = name.split(`-${edgeShapeFlag}`)[0]
            model.controlPoints.splice(index, 1)
            group.removeChild(currentShape)
            vm.graph.refreshItem(item)
            break
          case 'addEdgeAnchor':
            addEdgeAnchor(currentEv, vm)
            break
        }
      }
    }),
    // 预览区域
    new G6.Minimap({
      // container:'', //放置 Minimap 的 DOM 容器。若不指定则自动生成
      size: [225, 150],
      className: `minimap${vm.showMinimap ? '' : ' minimap-hide'}`,
      type: 'delegate', // 'delegate'：String,只渲染图上元素的大致图形，以降低渲染成本。渲染成本  'default' > 'keyShape' > 'delegate'
      delegateStyle: {
        fill: backRectFill
      }
    })
  ]
}

export const option = (vm) => {
  return {
    container: vm.container,
    modes: {
      default: [
        'drag-node', // 拖动节点
        'drag-canvas', // 拖动画布
        'zoom-canvas', // 缩放画布
        {
          type: 'click-select', // 点击选择节点
          multiple: false // 不允许多选
        },
        'brush-select', // 按住shift 框选节点
        'anchor-create-edge' // 锚点创建边
      ]
    },
    defaultNode: {},
    defaultEdge: {
      // color: '#c0c0c0', // 默认全局边的颜色
      // size: 2,
      // style: {
      //   cursor: 'pointer'
      // }
    },
    // renderer: 'svg',
    plugins: plugins(vm) //  插件
  }
}
