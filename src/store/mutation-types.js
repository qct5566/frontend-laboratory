export const ACCESS_TOKEN = 'Access-Token'
export const ACCESS_LOGIN = 'Access-Login'
export const ACCESS_FORBIDDEN = 'Access-Forbidden'
export const ACCESS_KICK = 'Access-KICK'
export const ACCESS_CAS_LOGOUT = 'Access-Cas-Logout'
export const SIDEBAR_TYPE = 'sidebar_type'
export const TOGGLE_MOBILE_TYPE = 'is_mobile'
export const TOGGLE_NAV_THEME = 'nav_theme'
export const TOGGLE_LAYOUT = 'layout'
export const TOGGLE_FIXED_HEADER = 'fixed_header'
export const TOGGLE_FIXED_SIDEBAR = 'fixed_sidebar'
export const TOGGLE_CONTENT_WIDTH = 'content_width'
export const TOGGLE_HIDE_HEADER = 'auto_hide_header'
export const TOGGLE_COLOR = 'color'
export const TOGGLE_WEAK = 'weak'
export const TOGGLE_MULTI_TAB = 'multi_tab'
export const APP_LANGUAGE = 'app_language'

export const CONTENT_WIDTH_TYPE = {
  Fluid: 'Fluid',
  Fixed: 'Fixed'
}

/** APP */

export const STATE_STORAGE = {
  // 刷新后根据缓存获取vuex,初始化数据存ls，避免重启浏览器后数据还在
  // 缓存的key格式为 vuels的前缀+ 文件名- + state名 例 pro__APP-SIDEBAR
  paths: [ // 缓存文件中所有state
    // {
    //   path: 'config',
    //   type: 'lo'
    // },
  ],
  states: [ // 缓存某文件中某个state
    // {
    //   path: 'app',
    //   state: 'sidebar',
    //   type: 'ls',
    //   key: '' // 设置缓存的key名输出时会拼接上vuels的前缀,不设置时为默认格式
    // }
  ]
}
