/*
** 批量导入vuex模块
** 所有文件名和内部定义的state不允许重名,除非设置了namespaced为true
** 设置namespaced为true的情况下使用时区分模块
*/
const STORE_MODULES = {}

// 排除
const EXINCLUDE = ['./index.js']

const STORE_MODULES_LIST = require.context('./', true, /\.js$/)

STORE_MODULES_LIST.keys().filter(e => !EXINCLUDE.includes(e)).forEach(key => {
  STORE_MODULES[key.replace(/(\.\/|\.js)/g, '')] = STORE_MODULES_LIST(key).default || {}
})

export default STORE_MODULES
