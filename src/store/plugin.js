import Vue from 'vue'
import { storageOpear } from '@/core/storage'
import { getUpSnake, getCamelCase } from '@/utils'
import { STATE_STORAGE } from '@/store/mutation-types'

// 获取所有缓存的state
const getStorageKey = (state, path) => {
  // 把所有的state拍平成一级，格式为 文件名的全大写下划线-state名全大写下划线 例APP-SIDEBAR
  const storageKeyObj = {}
  const stateObj = path ? state[path] : state
  for (const key in stateObj) {
    if (!path) {
      for (const stateKey in stateObj[key]) {
        storageKeyObj[`${getUpSnake(key)}-${getUpSnake(stateKey)}`] = stateObj[key][stateKey]
      }
    } else {
      storageKeyObj[`${getUpSnake(path)}-${getUpSnake(key)}`] = stateObj[key]
    }
  }
  return storageKeyObj
}

const getStorage = obj => {
  const newStorage = { }
  if (!Object.keys(obj).length) return false
  const local = {}
  const session = {}
  // 获取缓存
  for (const key in obj) {
    const localKey = storageOpear({ type: 'lo', opera: 'get', key })
    const sessionKey = storageOpear({ type: 'ls', opera: 'get', key })
    if (localKey !== null) local[key] = localKey
    if (sessionKey !== null) session[key] = sessionKey
  }
  // 同名只保留session中的值
  const allKey = { ...local, ...session }
  for (const key in allKey) {
    const fullKey = key.split('-')
    const path = getCamelCase(fullKey[0])
    const stateKey = getCamelCase(fullKey[1])
    newStorage[path] = { ...newStorage[path] }
    newStorage[path][stateKey] = allKey[key]
  }
  return newStorage
}

function createPersistedState ({ paths = [], states = [] }) {
  return store => {
    const state = store.state
    // 从缓存中重置state
    try {
      const storageKeyObj = getStorageKey(state)
      const changeState = getStorage(storageKeyObj)
      const replaceState = {}
      for (const key in state) {
        replaceState[key] = { ...state[key], ...changeState[key] }
      }
      store.replaceState(replaceState)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('恢复VUEX缓存数据失败', error)
    }

    let setCached = false // 是否已设置缓存,每次监听mutation都只调用一次
    store.subscribe((mutation, state) => {
      if (setCached) return false
      // 设置缓存
      paths.forEach(e => {
        const pathStorageKeyObj = getStorageKey(state, e.path)
        for (const key in pathStorageKeyObj) {
          Vue[e.type].set(key, pathStorageKeyObj[key])
        }
      })
      states.forEach(e => {
        const storageKey = e.key || `${getUpSnake(e.path)}-${getUpSnake(e.state)}`
        Vue[e.type].set(storageKey, state[e.path][e.state])
      })
      setCached = true
    })
  }
}

/**
 * 单个state设置缓存
 * @param {string} key 缓存的key，vuex中的必须遵循 文件名大写_State大写的原则  APP_STATE
 */
const setStatePersisted = (stateInfo, stateStorage = STATE_STORAGE) => {
  const { key, path, value } = stateInfo
  const { paths, states } = stateStorage
  // 判断是否在vuex设置的缓存配置中
  const pathObj = paths ? paths.find(e => e.path === path) : null
  const stateObj = states ? states.find(e => e.path === path && e.state === getCamelCase(key)) : null
  const currentObj = pathObj || stateObj || {}
  const fullKey = `${getUpSnake(path)}-${getUpSnake(key)}`
  if (Object.keys(currentObj).length) {
    // 有配置，按照配置方式添加
    Vue[currentObj.type].set(currentObj.key || fullKey, value)
  } else {
    // 无配置，直接存local
    Vue.lo.set(fullKey, value)
  }
}

export {
  createPersistedState,
  setStatePersisted
}
