/**
 * 全局prototype管理
 */

import Vue from 'vue'
// import store from '@/store'
// 全局前缀
Vue.prototype.$prefix = className => $prefix(className)

// 用于template模板打印，可以查看数据是否正常更新
Vue.prototype.$log = window.console.log

export const $prefix = className => {
  const classNameArr = className ? className.split(' ') : []
  const NewClassName = classNameArr.filter(e => e).map(e => `__LW-${e}`)
  return NewClassName.join(' ')
}
