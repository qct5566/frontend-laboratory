import Vue from 'vue'

// base library

import Viser from 'viser-vue' // 图表美化
import VueCropper from 'vue-cropper' // 图片裁剪
import 'ant-design-vue/dist/antd.less'

// ext library
import VueClipboard from 'vue-clipboard2' // 剪贴板
// import PageLoading from '@/components/PageLoading' // 页面spin优化
// import PermissionHelper from './prototype/permission' //按钮权限，按需使用
// import './directives/action' //按钮指令，按需使用
import './storage'
import './prototype/index.js'
import './updateInit'

VueClipboard.config.autoSetContainer = true

const Antd = require('ant-design-vue')
Vue.use(Antd)
Vue.use(Viser)
// Vue.use(PageLoading)
Vue.use(VueClipboard)
// Vue.use(PermissionHelper)
Vue.use(VueCropper)

