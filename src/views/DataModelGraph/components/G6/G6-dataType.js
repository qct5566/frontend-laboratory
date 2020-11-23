/** ****  边  ******/
export const edgeShapeFlag = 'edgeAnchor-shape' // 边锚点标识
export const edgePathShapeName = 'edge-path-shape' // 边线的名称
export const anchorSize = 8 // 边锚点宽高-默认正方形
export const edgeAnchorZIndex = 1000 // 边锚点zIndex
export const lineAppendWidth = 3 // 边的相应范围
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
