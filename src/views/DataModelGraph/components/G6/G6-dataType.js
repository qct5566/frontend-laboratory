
/** ****  节点  ******/
export const backRectStroke = 'blue' // 节点边框色
export const backRectFill = '#5D616A' // 节点背景色

/** ****  边  ******/
export const edgeShapeFlag = 'edgeAnchor-shape' // 边锚点标识
export const edgePathShapeName = 'edge-path-shape' // 边线的名称
export const anchorSize = 8 // 边锚点宽高-默认正方形
export const edgeAnchorZIndex = 1000 // 边锚点zIndex
export const lineAppendWidth = 5 // 边的响应范围
export const anchorAttrs = {
  // 边锚点属性
  stroke: '#666',
  fill: '#fff',
  width: anchorSize,
  height: anchorSize
}

/**
 *  操作边的锚点的显隐
 * @param {object} item  边实例
 * @param {boolean} isShow  是否显示锚点
 */
export const edgeShapeEvents = (item, isShow) => {
  const group = item.get('group')
  const children = group.get('children')
  children.forEach((e) => {
    const shapeName = e.get('name') || ''
    if (shapeName.indexOf(edgeShapeFlag) !== -1) {
      const visible = typeof isShow === 'boolean' ? !isShow : e.get('visible')
      visible ? e.hide() : e.show()
      item.set('selected', !visible)
    }
  })
}

/** ****  画布  ******/
/**
 * 获取画布比例
 * @param {vm} vm vue的this
 */
export const getZoom = (vm) => {
  return vm.graph ? vm.graph.getZoom() : 1
}

/** 公用方法 */
// json方式深拷贝，注意不能拷贝复杂对象
export const jsonDeepClone = (json) => {
  return json !== undefined ? JSON.parse(JSON.stringify(json)) : undefined
}
