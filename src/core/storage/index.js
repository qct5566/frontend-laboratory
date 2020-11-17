// vue-ls 配置文件
import Vue from 'vue'
import VueStorage from 'vue-ls'
// import config from '@/config/defaultSettings.js'

const clone = require('lodash.clonedeep')
const { storageOptions, storageOptionsLocal } = {
  storageOptions: {
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'session' // storage name session, local, memory
  },
  storageOptionsLocal: {
    namespace: 'pro__', // key prefix
    name: 'lo', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  }
}
// 使用 vue.ls 或 vue.lo
Vue.use(clone(VueStorage), storageOptions)
Vue.use(clone(VueStorage), storageOptionsLocal)

/**
 * 手动操作vuels缓存,初始化前使用
 * @param {string} type  缓存类型 lo/ls
 * @param {string} opera 操作类型 set/get
 * @param {string} key   缓存的key
 * @param {string} value   缓存的值
 */
export const storageOpear = info => {
  const { type, opera, key, value } = info
  const isLo = type === 'lo'
  const isSet = opera === 'set'
  const prefix = isLo ? storageOptionsLocal.namespace : storageOptions.namespace
  const stkey = `${prefix}${key}`
  if (isSet) {
    window[isLo ? 'localStorage' : 'sessionStorage'].setItem(stkey, { value: value })
  } else {
    const obj = JSON.parse(window[isLo ? 'localStorage' : 'sessionStorage'].getItem(stkey))
    return obj ? obj.value : null
  }
}

/**
 * 删除vuels缓存
 * @param {string} key  传key时删除key
 * @param {string} type 缓存类型 lo/ls
 */
export const clearStorage = (key, type) => {
  //  否则全部删除
  if (key) {
    type ? Vue[type].remove(key) : Vue.lo.remove(key)
  } else {
    type ? Vue[type].clear() : Vue.lo.clear()
  }
}

