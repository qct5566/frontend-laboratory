/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    redirect: 'DataModelGraph'
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
