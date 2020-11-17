// ie polyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/'
import '@/styles/index.less'
import '@/core/use' // 其他全局配置
import Layout from '@/component/Layout'
Vue.component('Layout', Layout)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

