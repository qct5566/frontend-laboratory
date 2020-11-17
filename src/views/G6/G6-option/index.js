import G6 from '@antv/g6'

const tc = document.createElement('div')
tc.id = 'toolbarContainer'
setTimeout(() => {
  document.getElementById('G6-container').appendChild(tc)
}, 400)
// plugins-Api:https://g6.antv.vision/zh/docs/api/Plugins#%E9%85%8D%E7%BD%AE%E9%A1%B9-1
// 插件
const plugins = [
  // 网格
  new G6.Grid({
    // img:''  //String ,grid 图片，base64 格式字符串
  }),
  // 右键菜单
  new G6.Menu({
    className: 'mouse-right-menu',
    getContent (e) {
      let i = 0
      const arr = new Array(5).fill(i++)
      const outDiv = document.createElement('div')
      outDiv.style.width = '180px'
      const domArr = arr.map(e => {
        return `<div class="__LW-bb __LW-plr10 __LW-ptb5">菜单${e + 1}</div>`
      })
      outDiv.innerHTML = domArr.join().replace(/,/g, '')
      return outDiv
    },
    handleMenuClick (target, item) {
      console.log(target, item)
    }
  }),
  new G6.ToolBar({
    container: tc
  }),
  // 预览区域
  new G6.Minimap({
    // container:'', //放置 Minimap 的 DOM 容器。若不指定则自动生成
    size: [225, 150],
    className: 'minimap',
    type: 'delegate' // 'delegate'：String,只渲染图上元素的大致图形，以降低渲染成本。渲染成本  'default' > 'keyShape' > 'delegate'
  })
]

const defalutOptions = {
  container: 'G6-pro', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
  modes: {
    default: ['click-add-edge', 'drag-node', 'drag-canvas', 'zoom-canvas']
  },
  defaultNode: {
    style: {
      fill: '#fff'
    }
  },
  fitView: true,
  autoPaint: true,
  linkCenter: false,
  nodeStateStyles: {
    hover: {
      stroke: '#b37feb'
    }
  },
  defaultEdge: {
    targetAnchor: 0,
    // 边的样式
    style: {
      stroke: '#666',
      fill: '#666',
      endArrow: {
        // path: G6.Arrow.vee(10, 20, -10),
        path: 'M 20,0 L 0,10 L 0,-10 Z',
        d: 20
      }
    },
    label: '边中间配置',
    labelCfg: {
      position: 'center', // 其实默认就是 center，这里写出来便于理解
      style: {
        stroke: 'white', // 给文本添加白边和白色背景
        lineWidth: 5, // 文本白边粗细
        fill: '#722ed1', // 文本颜色
        fontsize: 18
      }
    }
    // labelCfg: {
    //   autoRotate: true
    // }
  },
  renderer: 'svg',
  plugins //  插件
}

const G6graph = (options = {}) => {
  const container = options.container || defalutOptions.container
  const width = document.getElementById(container).scrollWidth
  const height = document.getElementById(container).scrollHeight
  // G6item.registerNode()
  return {
    width, // Number，必须，图的宽度
    height, // Number，必须，图的高度
    ...defalutOptions,
    ...options
  }
}

// export const getCanvasByPoint = () => {
//   const event = window.event
//   let x = 0
//   let y = 0
//   if (event.offsetX || event.offsetY) {
//     x = event.offsetX
//     y = event.offsetY
//   } else if (event.layerX || event.layerY) {
//     x = event.layerX - 1
//     y = event.layerY - 1
//   }
//   console.log('x, y', x, y)
//   // return G6graph().getPointByCanvas(x, y)
//   return { x: -100, y: 100 }
// }

export default G6graph
