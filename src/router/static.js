/**
 * @description 静态路由
 */
export const staticRoute = [
  {
    path: '/',
    meta: { title: '首页' },
    name: 'Index',
    redirect: '/dashboard',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/passport/login.vue')
  },
  {
    path: '/404',
    name: 'Error404',
    component: () => import('@/views/error/404.vue')
  },
  {
    path: '/403',
    name: 'Error403',
    component: () => import('@/views/error/403.vue')
  },
  {
    path: '/500',
    name: 'Error500',
    component: () => import('@/views/error/500.vue')
  }
]

/**
 * @description 路由未找到
 */
export const notFoundRouter = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  redirect: '/404'
}
