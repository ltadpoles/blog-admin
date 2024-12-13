/**
 * @description 系统管理
 */

const routes = [
  {
    path: '/admin',
    meta: { title: '系统管理', icon: 'Setting' },
    name: 'Admin',
    redirect: '/admin/user',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: 'user',
        name: 'AdminUser',
        meta: { title: '用户管理', icon: 'User' },
        component: () => import('@/views/admin/user/index.vue')
      }
    ]
  }
]

export default routes