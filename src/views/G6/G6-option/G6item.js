// 配置 节点和边
import graph from './index'
import G6 from '@antv/g6'

export const registerNode = () => {
  G6.registerNode('node-group',
    {
      // 绘制
      draw (cfg, group) {
        const keyShape = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 400,
            height: 200,
            fill: cfg.style.fill,
            cursor: 'pointer',
            radius: 7,
            shadowColor: '#666',
            shadowBlur: 2
          }
        })

        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 400,
            height: 40,
            fill: '#f5f5ef'
          },
          draggable: true
        })

        group.addShape('text', {
          attrs: {
            text: cfg.label,
            x: 10,
            y: 28,
            fontSize: 14,
            fill: '#666'
          }
        })

        group.addShape('text', {
          attrs: {
            text: '这里是一堆图标',
            x: 10,
            y: 62,
            fontSize: 14,
            fill: '#666'
          }
        })

        const tableDom = list => {
          const newList = list.map((e, i) => {
            return `<div
            class="__LW-bb __LW-plr10 __LW-ptb5"
            style="background:${i % 2 === 0 ? '#FDFDF9' : ''};">
            ${e.label}：${cfg.component[e.value]}
            </div>`
          })
          return newList.join().replace(/,/g, '')
        }
        const groupTable = [
          {
            label: '队列',
            value: 'list'
          },
          {
            label: '输入',
            value: 'input'
          },
          {
            label: '读写',
            value: 'writeread'
          },
          {
            label: '输出',
            value: 'output'
          }
        ]

        group.addShape('dom', {
          attrs: {
            x: 0,
            y: 70,
            width: 400,
            height: 120,
            html: `${tableDom(groupTable)}`
          },
          name: 'tableDom',
          draggable: true
        })

        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 400,
            height: 200,
            cursor: 'pointer',
            radius: 7,
            opacity: 0,
            fill: '#f5f5ef'
          },
          draggable: true,
          zIndex: 999
        })
        return keyShape
      },
      update: null
    },
    'drag-node'
  )
  G6.registerNode('node-label',
    {
      // 绘制
      draw (cfg, group) {
        const keyShape = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 150,
            height: 150,
            fill: cfg.style.fill,
            cursor: 'pointer',
            radius: 7,
            shadowColor: '#000',
            shadowBlur: 10
          }
        })
        return keyShape
      },
      update: null
    },
    'drag-node'
  )
}
// 获取节点
export const getNode = id => graph.findById(id)

const G6Item = {
  /* ======= 节点操作 ============ */
  /**
   * lockNode
   * 锁定节点
   * id    String   节点id
   * bool  boolean  是否锁定
   */
  lockNode: (id, bool) => {
    const node = getNode(id)
    bool ? node.lock() : node.unlock()
  },

  /**
   * hasLocked
   * 判断节点是否已锁定
   * id    String   节点id
   */
  hasLocked: (id) => {
    const node = getNode(id)
    return node.hasLocked()
  },

  /**
   * getNeighbors
   * 获取相邻节点的类型，返回Array类型，值为所有符合的节点实例数组
   * id    String   当前节点id
   * type  String/undefined    'source' / 'target' / undefined 邻居类型
   *                           'source' 只获取当前节点的源节点，
   *                           'target' 只获取当前节点指向的目标节点， 若不指定则返回所有类型的邻居
   */
  getNeighbors: (id, type) => {
    const node = getNode(id)
    return node.getNeighbors(type)
  },
  /**
   * getAnchorPoints
   * 获取定义在节点上的锚点数据,返回Array类型
   * id    String   当前节点id
   * 返回值的数据结构：
   [
    (0: {
      x: 100,
      y: 105,
      index: 0,
    }),
    (1: {
      x: 200,
      y: 105,
      index: 1,
    }),
  ]
   */
  getAnchorPoints: (id) => {
    const node = getNode(id)
    return node.getAnchorPoints()
  },
  /**
   * getLinkPoint
   * 获取距离指定坐标最近的一个锚点
   * id    String   当前节点id
   * point  Object  节点外部的一个点，用于计算交点及最近的锚点
   * point = {
           x: 100,
           y: 105,
         }
   */
  getLinkPoint: (id, point) => {
    const node = getNode(id)
    return node.getLinkPoint(point)
  },
  /**
   * getLinkPointByAnchor
   * 根据锚点索引获取连接点的 x、y 坐标。
   * id    String   当前节点id
   * index  Number  锚点的索引
   * 返回格式 {
           x: 100,
           y: 105,
         }
   */
  getLinkPointByAnchor: (id, index) => {
    const node = getNode(id)
    return node.getLinkPointByAnchor(index)
  },
  /* ======= 边操作 ============ */
  /**
   * getInEdges
   * 获取与当前节点关联的所有入边
   * id    String   节点id
   */
  getInEdges: (id) => {
    const node = getNode(id)
    return node.getInEdges()
  },
  /**
   * getOutEdges
   * 获取与当前节点关联的所有出边
   * id    String   节点id
   */
  getOutEdges: (id) => {
    const node = getNode(id)
    return node.getOutEdges()
  },
  /**
   * addEdge
   * 添加指定的边到当前节点上。
   * id    String   节点id
   * edge    Edge   边实例
   *  new Edge({
        // TODO
      });
   */
  addEdge: (id, edge) => {
    const node = getNode(id)
    node.addEdge(edge)
  },
  /**
   * removeEdge
   * 移除与当前节点相关的指定边
   * id    String   节点id
   * edge    Edge   边实例
   */
  removeEdge: (id, edge) => {
    const node = getNode(id)
    node.removeEdge(edge)
  }

}

export default G6Item
