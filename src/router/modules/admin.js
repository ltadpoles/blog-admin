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
      },
      {
        path: 'menu',
        name: 'AdminMenu',
        meta: { title: '菜单管理', icon: 'Menu' },
        component: () => import('@/views/admin/menu/index.vue')
      }
    ]
  }
]

export default routes