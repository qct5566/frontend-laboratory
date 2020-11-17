import G6 from '@antv/g6'

const NodeTable = (vm) => {
  // 表格节点类型
  G6.registerNode(
    'node-table',
    {
      draw (cfg, group) {
        // 绘制
        // 定义基础字段
        console.log('model', cfg, cfg.x, cfg.y)
        console.log('group', group)
        const x = cfg.x || 0
        const y = cfg.y || 0
        const padding = 6 // 每列左右内边距
        const cols = cfg.cols || [ // 定义每列字段
          {
            columnName: 'columnName',
            hidden: false
          },
          {
            columnName: 'columnDesc',
            hidden: false
          },
          {
            columnName: 'columnType',
            hidden: false
          },
          {
            columnName: 'pk',
            hidden: false
          }
        ]
        const colsLen = cols.length // 列个数
        const colGroups = {} // 列的组元素group
        const colBoxs = {} // 列的包围盒信息bbox
        const tableData = cfg.columns // 表格数据
        let colBoxsLen = 0 // 成功生成的列元素个数
        let nodeWidth = cfg.width || 0 // 节点宽
        let nodeHeight = cfg.height || 0 // 节点高
        // 开始绘制
        // 绘制背景容器
        const backRect = group.addShape('rect', {
          attrs: {
            stroke: 'blue', // 边框颜色
            fill: cfg.color || '#5D616A' // 填充色
          },
          name: 'container-shape',
          draggable: true
        })
        // 绘制标题
        const title = group.addShape('text', {
          attrs: {
            text: `${cfg.physicalTableName}${cfg.desc ? ` [${cfg.desc}]` : ''}`,
            fill: '#1D95E2',
            fontSize: 14
            // textBaseline: 'top',
            // textAlign: 'center'
          },
          name: 'text-shape',
          draggable: true
        })
        // 绘制分割线
        const splitLine = group.addShape('line', {
          attrs: {
            stroke: '#4D5157'
          },
          name: 'splitLine-shape'
        })
        // 绘制表格列
        // 按顺序初始化列名
        cols.forEach((col) => {
          if (group) {
            colGroups[col.columnName] = group.addGroup()
          }
        })
        // 获取头部包围盒
        const titleBox = title.getBBox()
        // 获取每行高度
        const realLineHeight = (nodeHeight && ((nodeHeight - titleBox.height) / colsLen)) || 20
        const lineHeight = realLineHeight < 13 ? 13 : realLineHeight
        // 获取每列数据
        const getColumn = (column, columnName) => {
          let colText = ''
          const { isPk, isFk } = column
          const pkTitles = []
          switch (columnName) {
            case 'pk':
              if (isPk) pkTitles.push('PK')
              if (isFk) pkTitles.push('FK')
              // <>会造成text无法识别，使用〈〉代替使用
              // 因为text无值会造成模块宽度获取错误，这里使用null并设置透明度为0
              colText = pkTitles.length ? `〈${pkTitles.join(',')}〉` : 'null'
              break
            default:
              colText = column[columnName]
              break
          }
          const colColor = column.isPk
            ? '#C2A412'
            : column.isFk
              ? '#8F9C6D'
              : '#C5C6C5'
          return { colText, colColor }
        }
        // 绘制每一列
        tableData.forEach((column, i) => {
          Object.keys(colGroups).forEach((columnName) => {
            const columnInfo = getColumn(column, columnName)
            colGroups[columnName].addShape('text', {
              attrs: {
                x: x,
                y: y + lineHeight * i,
                text: columnInfo.colText,
                opacity: columnInfo.colText === 'null' ? 0 : 1,
                fill: columnInfo.colColor,
                textBaseline: 'top'
              },
              name: 'col-text-shape'
            })
            if (column.isPk) {
              // 如果是pk主键，给每列文字下方加下划线
              const box = colGroups[columnName].getBBox()
              colGroups[columnName] &&
                colGroups[columnName].addShape('line', {
                  attrs: {
                    x1: box.minX,
                    y1: box.maxY + 3,
                    x2: box.maxX,
                    y2: box.maxY + 3,
                    stroke: '#C2A412'
                  }
                })
            }
          })
        })
        // 获取每列包围盒信息
        cols.forEach((col) => {
          colBoxs[col.columnName] = colGroups[col.columnName].getBBox()
        })
        // 计算所有列合计宽度
        const allColWidth = Object.keys(colBoxs).reduce((a, b) => {
          return a + colBoxs[b].width
        }, 0)
        // 生成列组元素后获取组元素个数
        colBoxsLen = Object.keys(colBoxs).length
        // 计算每列右边距
        const offsetRight =
          ((nodeWidth || allColWidth) - allColWidth) / colsLen
        const marginRight = offsetRight < 0 ? 10 : offsetRight + 10
        // 节点最终宽度
        nodeWidth = allColWidth + marginRight * colBoxsLen + 2 * padding
        // 获取所有列中最大高度加title高度，即节点高度
        nodeHeight =
          Math.max(
            ...Object.keys(colBoxs).map((colbox) => colBoxs[colbox].height)
          ) + 4 * padding + titleBox.height
        // 获取每一行的高度
        const firstGroup = colGroups[Object.keys(colGroups)[0]]
        const rowHeight =
          (firstGroup &&
            firstGroup.get('children')[0] &&
            firstGroup.get('children')[0].getBBox().height) ||
          13
        // 采用相对位移坐标来平移 title 位置
        title.translate(0, -nodeHeight / 2 + padding)
        // 调整每一列的位置
        let boxWidth = 0
        Object.keys(colGroups).forEach((colGroup) => {
          // 根据顺序进行宽度叠加
          colGroups[colGroup].translate(
            -nodeWidth / 2 + boxWidth + padding,
            -nodeHeight / 2 + titleBox.height + 3 * padding
          )
          boxWidth += colBoxs[colGroup].width + marginRight
        })
        if (colBoxsLen === 0) {
          // 没有列元素的时候需要有一个默认宽度
          nodeWidth = titleBox.width
          nodeHeight = titleBox.height * 2
        }
        // 配置背景矩形宽高
        backRect.attrs = {
          ...backRect.attrs,
          x: x - nodeWidth / 2,
          y: y - nodeHeight / 2,
          width: nodeWidth,
          height: nodeHeight
        }
        // 配置title位置
        title.attrs = {
          ...title.attrs,
          x: x - (titleBox.width / 2),
          y: y + titleBox.height,
          width: nodeWidth
        }
        // 配置分割线
        splitLine.attrs = {
          ...splitLine.attrs,
          x1: x - nodeWidth / 2,
          y1: y - nodeHeight / 2 + 2 * padding + titleBox.height,
          x2: x + nodeWidth / 2,
          y2: y - nodeHeight / 2 + 2 * padding + titleBox.height
        }

        // 配置左右锚点
        const firstBox = colBoxs[Object.keys(colBoxs)[0]]

        const anchorPoints = []
        tableData.forEach((column, i) => {
          const r =
            (titleBox.height +
              (i * (firstBox.height + lineHeight - rowHeight)) /
                tableData.length +
              rowHeight / 2 +
              3 * padding) /
            nodeHeight
          anchorPoints.push([0, r])
          anchorPoints.push([1, r])
        })
        // 为每列添加锚点
        group.set('anchorPoints', anchorPoints)
        return backRect
      },
      getAnchorPoints (cfg, group) {
        return group.get('anchorPoints')
      },
      setState (name, value, item) {
        console.log('name, value, item', name, value, item)
      }
    }
  )
}

export const registerNode = (vm) => {
  NodeTable(vm)
}
