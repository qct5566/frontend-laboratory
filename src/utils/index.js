import _ from 'lodash'

/**
 * 获取全大写下划线格式字符串
 * @param {string} str
 */
export const getUpSnake = str => {
  // strObj  =>   STR_OBJ
  return _.toUpper(_.snakeCase(str))
}

/**
 * 全大写下划线格式转小驼峰字符串
 * @param {string} str
 */
export const getCamelCase = str => {
  //  STR_OBJ =>strObj
  return _.camelCase(_.toLower(str))
}

/**
 *  让所有对象一起使用某个方法
 *  @param {object} obj 对象
 *  @param {function} fn 方法
 * */

export const eachOwn = (obj, fn) => {
  for (const key in obj) {
    // eslint-disable-next-line
    if (obj.hasOwnProperty(key)) {
      fn(obj[key], key, obj)
    }
  }
}

/**
 * 判断滚动条是否到element底部
 *  @param {element} element 需要判断的元素
 */
export const scrollBottom = (element, ctx) => {
  // 在mounted配合 window.addEventListener('scroll', FN, true) 使用
  const scrollHeight = element.scrollHeight
  const scrollTop = element.scrollTop
  const clientHeight = element.clientHeight
  return scrollTop + clientHeight === scrollHeight && scrollTop !== 0
}

/**
 * 获取当前element滚动条位置，返回两个值top 最顶端 bottom 最低端
 *  @param {element} element 需要判断的元素
 */
export const getSrcollPosition = element => {
  return scrollBottom(element) ? 'bottom' : element.scrollTop === 0 ? 'top' : ''
}

/**
 * 批量导出当前文件夹下的某格式文件
 * @param {function} r  //通过context.require导出的文件路径列表
 * @param {array} exinclude  //排除此数组中的文件或文件夹
 * @param {string} fileType  //排除此数组中的文件或文件夹
 */
export const requireFolderName = (r, exinclude, fileType = 'index') => {
  const contents = {}
  const paths = exinclude && exinclude.length ? r.keys().filter(p => {
    return exinclude.indexOf(p) === -1
  }) : r.keys()
  for (const p of paths) {
    const fn = r(p).default ? r(p).default : r(p)
    const _array = p.split('/')
    // 将路径中，
    const index = _array.findIndex(item => item === fileType)
    contents[_array[index - 1]] = fn
    const name = _array[1].split('.')[0]
    contents[name] = fn
  }
  return contents
}

/**
 * 排序
 * @param {object} a  //sort中的a参数
 * @param {object} b  //sort中的b参数
 * @param {string} property  //a,b参数中需要排序的key
 * @param {string} order  //默认ascend，ascend时升序，descend降序
 *
 */
export const sortRule = (a, b, property, order = 'ascend') => {
  // 非字符串时转字符串
  const isObj = typeof a[property] === 'object'
  const aStr = isObj ? JSON.stringify(a[property]) : String(a[property])
  const bStr = isObj ? JSON.stringify(b[property]) : String(b[property])
  // 使用charCodeAt()转换成Unicode编码进行排序.Unicode 是 0 - 65535 之间的整数
  if (aStr && bStr) {
    const isNum = !isNaN(Number(aStr)) && !isNaN(Number(bStr))
    // const alink = isNum ? aStr : aStr.charCodeAt()
    // const blink = isNum ? bStr : bStr.charCodeAt()
    if (order === 'ascend') {
      // order不传或者为ascend时升序
      return isNum ? aStr - bStr : aStr === bStr ? 0 : aStr > bStr ? 1 : -1
    } else if (order === 'descend') {
      // 降序
      return isNum ? bStr - aStr : bStr === aStr ? 0 : bStr > aStr ? 1 : -1
    }
  }
}

/**
 * 监听各类事件
 * @param {string} type  //监听类型
 * @param {function} fun  //监听后执行的方法
 * @param {element} el  //针对某元素监听,默认window
 * 注意：resize无法监听单个元素，只能使用window
 */
export const addEvent = (type, fun, el = window) => {
  const element = el === window ? window : document.querySelector(el)
  if (!element) return false
  if (typeof element.addEventListener !== 'undefined') {
    element.addEventListener(type, fun, false)
  } else if (typeof element.attachEvent !== 'undefined') {
    element.attachEvent(type, fun, false)
  } else {
    element['on' + type] = fun /* 直接赋给事件 */
  }
}

/**
 * 摧毁各类监听事件
 * @param {string} type  //监听类型
 * @param {function} fun  //监听后执行的方法
 * @param {element} el  //针对某元素监听,默认window
 */
export const removeEvent = (type, fun, el = window) => {
  const element = el === window ? window : document.querySelector(el)
  if (!element) return false
  if (typeof element.removeEventListener !== 'undefined') {
    element.removeEventListener(type, fun, false)
  } else if (typeof element.deattachEvent !== 'undefined') {
    element.deattachEvent(type, fun, false)
  } else {
    element['on' + type] = null /* 直接赋给事件 */
  }
}

// 请求时清除无效项
export const clearParams = params => {
  const isHave = params && Object.keys(params).length
  if (!isHave) return false
  for (const i in params) {
    const key = params[i]
    const errorArray = Array.isArray(key) && !key.length
    const errorObj = Object.prototype.toString.call(key) === '[Object Object]' && !Object.keys(key).length
    if ((!key && key !== 0 && key !== false) || errorArray || errorObj) {
      delete params[i]
    }
  }
}

// 判断是否是pc端
export const isPC = () => {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod']
  const flag = Agents.filter(e => userAgentInfo.indexOf(e) !== -1)
  return !!flag.length
}

// 判断是否是微信端
export const isWeiXin = () => {
  const ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('micromessenger') !== -1
}

