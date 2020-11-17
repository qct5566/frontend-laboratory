import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from './base'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: constantRouterMap
})

// 重写addRoutes方法，解决重复添加路由问题
router.$addRoutes = (params) => {
  router.matcher = new Router({
    mode: 'hash',
    routes: constantRouterMap
  }).matcher
  router.addRoutes(params)
}

// router.beforeEach((to, from, next) => {
//   if (to.path === '/') {
//     next({ path: '/G6' })
//   } else {
//     next()
//   }
// })

export default router
