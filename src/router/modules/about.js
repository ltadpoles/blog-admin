/**
 * @description 关于
 */

const route = [
  {
    path: '/about',
    meta: { title: '关于', i18nName: 'tadAbout', icon: 'about' },
    name: 'About',
    redirect: '/about/index',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'index',
        name: 'AboutIndex',
        component: () => import('@/views/about/index.vue')
      }
    ]
  }
]

export default route
