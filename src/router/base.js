/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    redirect: 'vue3DModel'
  },
  {
    path: '/vue3DModel',
    name: 'vue3DModel',
    meta: { title: 'vue3DModel' },
    component: () => import('@/views/Three/vue-3d-model/demo1')
  },
  {
    path: '/L7',
    name: 'L7',
    meta: { title: 'L7' },
    component: () => import('@/views/L7')
  },
  {
    path: '/G6',
    name: 'G6',
    meta: { title: 'G6' },
    component: () => import('@/views/G6')
  },
  {
    path: '/DataThemeGraph',
    name: 'DataThemeGraph',
    meta: { title: 'DataThemeGraph' },
    component: () => import('@/views/DataThemeGraph/demo')
  },
  {
    path: '/DataModelGraph',
    name: 'DataModelGraph',
    meta: { title: 'DataModelGraph' },
    component: () => import('@/views/DataModelGraph/demo')
  }
]
