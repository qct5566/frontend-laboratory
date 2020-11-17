import modules from './modules'

export const loadGetters = Allmodules => {
  const getters = {}
  for (const key in Allmodules) {
    const module = Allmodules[key]
    // 获取加入数组,如果设置为true则全部加入，如果为数组则取数组
    let inArr = []
    if (Array.isArray(module.inGetters)) {
      inArr = module.inGetters
    } else if (module.inGetters === true) {
      inArr = Object.keys(module.state)
    } else {
      if (module.inGetters !== undefined) {
        console.warn(`vuex模块中，${key}下的inGetters必须是布尔值的true或数组`)
      }
    }
    // 获取排除数组
    const exArr = Array.isArray(module.exGetters) ? module.exGetters : []
    // 筛选排除
    const lastInArr = inArr.filter(e => !exArr.includes(e))
    lastInArr.forEach(e => {
      getters[e] = state => state[key][e]
    })
  }
  return getters
}

const getters = {
  ...loadGetters(modules)

  /** app */
  // multiTab: state => state.app.multiTab,

  /** permission */
  // mainRouters: state => state.permission.mainRouters,
  // indexUrl: state => state.permission.indexUrl,

  /** user */
  // currentUser: state => state.user.currentUser,
  // welcome: state => state.user.welcome,
  // roles: state => state.user.roles,
  // executedLoadPermissionFromBackend: state => state.user.executedLoadPermissionFromBackend,

  /** config */
  // defaultConfig: state => state.config.defaultConfig,

  /** pages */
  // keepAlive: state => state.pages.keepAlive,

  /** asyncRouter */
  // addRouters: state => state.asyncRouter.addRouters,
}

export default getters
