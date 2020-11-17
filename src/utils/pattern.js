/* 包含常用的表单项验证的正则表达式 */

// 中国大陆的手机号码
export const TEL = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/

// 身份证号
export const ID_NUMBER = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/

// Email 邮箱地址
export const EMAIL = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/

// 邮政编码
export const ZIP_CODE = /^[0-9]\d{5}(?!\d)$/

// 密码强度，必须包含大写字母, 小写字母, 数字, 特殊字符四种中的三种, 长度要求 8 到 16 位
export const PASSWORD = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\\\W_!@#$%^&*`~()-+=]{8,16}$/

// url是否合法
export const URL_REGEX = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/

// 开头http或https
export const HAS_HTTP = /^(http?|https)/

/* 小写字母 */
export const LOWER_CASE = /^[a-z]+$/

/* 大写字母 */
export const UPPER_CASE = /^[A-Z]+$/

// 大于等于0的正整数
export const POSITIVE_INTEGER = /^[0-9]+$/

// 是否为正数
export const POSITIVE = /^\d+(?=\.{0,1}\d+$|$)/

// 是否为正整数
export const INTEGER = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/

// 大于0的整数
export const NO_ZERO_INTEGER = /^\+?[1-9]\d*$/

// 不限制小数点后位数
export const POSITIVE_NUMBER = /^([0-9]+(\.\d+)?|0\.\d+)$/

// 限制小数点后保留两位的正浮点数
export const FLOAT_POSITIVE_NUMBER = /^[0-9]+(.[0-9]{1,2})?$/

// 4-20位的非中文字符
export const NO_CHINESE_STR = /^[^\u4e00-\u9fa5]{6,20}$/

// 只能是非中文字符
export const NO_CHINESE = /^[^\u4e00-\u9fa5]+$/

// 多个热线电话逗号隔开，只能输入数字和符号 - 和 ,
export const HOT_LINE_MORE = /^[\d-,]*$/

// 限制1开头的11位手机号
export const MOBILE = /^1\d{10}/

// 身份证号码
export const ID_CARD_NO = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/

/**
 * 结尾包含B, KB, MB, GB, TB（支持大小写）
 * @param {*} rule 同a-form表单验证中参数
 * @param {*} value 同a-form表单验证中参数
 * @param {*} callback 同a-form表单验证中参数
 * @param {String} required  必填时的提示语
 * @param {Array} unitArr   自定义验证数组
 */
export const BITY_UTIL = (rule, value, callback, required, unitArr) => {
  const bityUnit = unitArr && Array.isArray(unitArr) && unitArr.length
    ? unitArr : [' B', 'KB', 'MB', 'GB', 'TB']
  // 转大写
  const upperValue = (value + '').toUpperCase()
  // 截取最后三位
  const unit = upperValue.substring(upperValue.length - 2)
  const isUnit = bityUnit.includes(unit)
  const reg = /^\d+(?=\.{0,1}\d+$|$)/
  const endUnit = isUnit && unit[0] !== ' ' ? ` ${unit}` : unit
  const isPositive = isUnit ? reg.test(upperValue.split(endUnit)[0]) : reg.test(upperValue)
  if (!upperValue && required && typeof required === 'string') {
    callback(new Error(required))
  } else if (upperValue && (!isPositive || !isUnit)) {
    callback(new Error(`格式为正数+空格+${bityUnit.map(e => e.replace(' ', '')).join(',')}大小写结尾`))
  }
  callback()
}

/**
 * 结尾包含
 * nanos, millis, secs, mins, hrs, days
 * nano, milli, sec, min, hr, day（支持大小写）
 * @param {*} rule  同a-form表单验证中参数
 * @param {*} value 同a-form表单验证中参数
 * @param {*} callback  同a-form表单验证中参数
 * @param {String} required  必填时的提示语
 * @param {Array} unitArr    自定义验证数组
 */
export const TIME_UTIL = (rule, value, callback, required, unitArr) => {
  const timeUnit = unitArr && Array.isArray(unitArr) && unitArr.length
    ? unitArr
    : [' nano', ' milli', ' sec', ' min', ' hr', ' day']
  // 转小写
  const lowerValue = (value + '').toLowerCase()
  // 判断字符串中包含验证单位
  const filterUnit = timeUnit.filter(e => {
    const plural = e + 's'
    return lowerValue.indexOf(e) !== -1 || lowerValue.indexOf(plural) !== -1
  })
  const filterUnitStr = filterUnit && filterUnit.length ? filterUnit[0] : ''
  const isPlural = filterUnitStr && lowerValue.indexOf(filterUnitStr + 's') !== -1
  const endUnitStr = isPlural ? filterUnitStr + 's' : filterUnitStr
  // 判断单位在字符串的末尾D
  const isEndUnit = filterUnitStr && lowerValue.substring(lowerValue.length - endUnitStr.length) === endUnitStr
  // 单位存在时验证数字是否符合正则，否则直接验证整段字符串
  const reg = /^\d+(?=\.{0,1}\d+$|$)/
  const isPositive = isEndUnit ? reg.test(lowerValue.split(filterUnitStr)[0]) : reg.test(lowerValue)
  if (!lowerValue && required && typeof required === 'string') {
    callback(new Error(required))
  } else if (lowerValue && (!isPositive || !isEndUnit)) {
    callback(new Error(`格式为正数+空格+${timeUnit.map(e => e.replace(' ', '')).join(',')}及其复数的大小写结尾`))
  }
  callback()
}
