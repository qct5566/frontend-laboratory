import G6 from '@antv/g6'

const defaultRightMenus = [ // 默认节点菜单
  {
    label: '删除',
    value: 'delNode'
  }
]

// 配置插件
const plugins = (vm) => {
  return [
    // 网格 需要启用网格去掉注释即可
    // new G6.Grid({
    // // img:''  //String ,grid 图片，base64 格式字符串
    // }),
    // 右键菜单
    new G6.Menu({
      className: 'mouse-right-menu',
      itemTypes: ['node'], // 限制只有节点开启菜单
      getContent (e) {
        const rightMenus = vm.rightMenus || defaultRightMenus
        const outDiv = document.createElement('div')
        // outDiv.setAttribute('class', 'mouse-right-menu')
        const domArr = rightMenus.map((e) => {
          return `<div class="mouse-right-menu-item" value-menu="${e.value}">
             <a href="javascript:;">${e.label}</a>
          </div>`
        })
        outDiv.innerHTML = domArr.join().replace(/,/g, '')
        return outDiv
      },
      handleMenuClick (target, item) {
        const type = target.getAttribute('value-menu')
        vm.rightMenuOpera(type, item._cfg.model)
      }
    }),
    new G6.Tooltip({
      itemTypes: ['node'],
      getContent: ev => {
        // console.log(ev)
        return ev.item._cfg.id
      },
      offsetY: 30
    })
  ]
}

export const option = (vm) => {
  return {
    modes: {
      default: ['drag-node', 'drag-canvas', 'zoom-canvas']
    },
    defaultNode: {
      anchorPoints: [ // 默认节点接入锚点位置
        [0, 0.5],
        [1, 0.5]
      ]
    },
    layout: {
      workerEnabled: true
    },
    defaultEdge: {
      style: {
        cursor: 'pointer'
        // offset: 80
      }
    },
    // renderer: 'svg',
    plugins: plugins(vm) //  插件
  }
}
