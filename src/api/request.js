// import md5 from 'md5'
import Vue from 'vue'
import axios from 'axios'
import { remove } from 'lodash'
// import store from '@/store'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
// import { clearParams } from '@/utils/data'
import router from '@/router'

const _env = process.env.NODE_ENV
const MINI_TIME = 500 // 请求等待时间
const _requests = [] // 请求队列
let _timer = null // 进入队列定时器
let _random = {} // 队列请求的随机值，用于标识不同时间的请求
const loading = null // 存放loading组件
let isloading = false // 判断是否在loading中
let url = '' // 当前请求url
// const isHasConfirm = false
const pushRequest = config => {
  console.log(`${config.url}--begin`)
  _requests.push(config)
  isloading = true
  // loading = Loading.service({ fullscreen: true, spinner: 'el-icon-loading' })
}

const popRequest = config => {
  console.log(`${config.url}--end`)
  remove(_requests, r => {
    return r === config
  })
  if (!_requests.length) {
    setTimeout(() => {
      // url有get时不需要loading，判断loading存在再关闭
      if (isloading) {
        loading.close()
        isloading = false
      }
    }, 300)
  }
}

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: _env === 'development' ? 150000 : 30000 // 请求超时时间
})

/**
 * 异常拦截处理器
 * @param {*} error
 * @param {Promise} customErrHandler 自定义处理错误状态
 */
export const errorHandler = (error, customErrHandler) => {
  if (error.code === 'ECONNABORTED') {
    notification.error({
      message: '系统异常',
      description: '请求超时,请重试!'
    })
    return Promise.reject(error)
  }
  if (error.response) {
    const data = error.response.data
    // const token = Vue.ls.get(ACCESS_TOKEN)
    const notificationInfo = {
      title: '系统提示',
      description: ''
    }
    const errorStatus = error.response.status
    if (!customErrHandler) {
      switch (errorStatus) {
        case 500:
          notificationInfo.description = data
            ? data.message || (Object.keys(data).length ? data : '系统异常!')
            : '服务请求异常,请重新登陆!'
          break
        case 409:
          notificationInfo.description = data
          break
        case 403:
          notificationInfo.description = data.message
          break
        case 404:
          notificationInfo.description = data.message
          break
        case 401:

          break
      }
      if (notificationInfo.description) notification.error(notificationInfo)
    } else {
      customErrHandler()
    }
    // 跳转到错误页
    const jumpErrorPath = [404, 500, 403]
    if (jumpErrorPath.includes(errorStatus)) {
      router.push({ path: `/exception/${errorStatus + ''}` })
    }
    // if (token) {
    //   store.dispatch('Logout')
    // }
  } else {
    notification.error({
      message: '系统异常',
      description: error.isAxiosError ? '服务请求异常!' : error
    })
  }
  const useGlobalLoading = _requests.length
  if (useGlobalLoading) {
  // 非200时，也要删除对应请求
    clearTimeout(_timer)
    // 出现接口报错的时候，直接关闭loading
    _requests.splice(0)
    popRequest(_random)
  }
  return Promise.reject(error)
}

/**
 * axios请求拦截器
 * @param {*} config
 * @param {object} reqParams //子工程额外配置
 * @param {reqParams} params //子工程额外参数
 * @param {reqParams} useGlobalLoading //子工程是否开启全局loading
 * @param {reqParams} customReqHandler // 子工程设置其他请求相关,
 */
export const requestHandler = (config, reqParams) => {
  const { params = {}, useGlobalLoading = false, customReqHandler } = reqParams
  if (!config.params) {
    config.params = {}
  }
  // 判断是否使用公共参数配置
  const useCommon = !Object.keys(params).length
  if (useCommon) {
    const token = Vue.lo.get(ACCESS_TOKEN)
    if (token) {
      config.params.tokenId = token
      config.headers['Access-Token'] = token
    }
  }
  // 用于业务工程重置token的key名和增加其他参数等
  config.params = { ...config.params, ...params }
  if (config.method === 'get') {
    // get请求时候删除空参数
    // clearParams(config.params)
    // clearParams(config.data)
  }
  url = config.url
  if (useGlobalLoading) {
    _random = { stamp: Date.now(), url: url }
    const isGetUrl = config.method.toLowerCase() === 'get' // get数据请求小于时间数不加loading层
    _timer = setTimeout(
      () => {
      // 超过定义的请求时间时把random塞入config
        config.random = _random
        pushRequest(_random)
      },
      isGetUrl ? MINI_TIME : 0
    )
    config.timer = _timer
  }
  // 执行额外方法
  if (customReqHandler) customReqHandler()
  return config
}

/**
 * axios返回拦截器
 * @param {*} response
 * @param {object} resParams //子工程额外配置
 * @param {resParams} dataKey //获取data的key
 * @param {resParams} useGlobalLoading //子工程是否开启全局loading
 * @param {resParams} customResHandler // 子工程设置其他请求相关
 */
export const responseHandler = (response, resParams) => {
  const { useGlobalLoading = false, dataKey, customResHandler } = resParams
  // 判断请求时是否开启全局loading
  if (useGlobalLoading) {
    // 如果请求结束还未进入timer，直接删除定时器，让请求不走loading
    clearTimeout(response.config.timer)
    // 请求结束时判断定时器是否走完，走完即存在random，删除random
    if (response.config.random) {
      popRequest(response.config.random)
    }
  }
  const res = response.data
  if (res.code !== 0) {
    notification.error({
      message: '系统异常',
      description: res.msg
    })
  }
  // 执行额外方法
  if (customResHandler) customResHandler()
  return !dataKey ? res.data || res || {} : res[dataKey]
}

// request interceptor
service.interceptors.request.use(config => {
  return requestHandler(config, {})
}, errorHandler)

// response interceptor
service.interceptors.response.use(response => {
  return responseHandler(response, {})
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
