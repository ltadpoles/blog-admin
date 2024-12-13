/**
 * @description 关于
 */

const routes = [
  {
    path: '/about',
    name: 'About',
    redirect: '/about/index',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: 'index',
        meta: { title: '关于', icon: 'Warning' },
        name: 'AboutIndex',
        component: () => import('@/views/about/index.vue')
      }
    ]
  }
]

export default routes