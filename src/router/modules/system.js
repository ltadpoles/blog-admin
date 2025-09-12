/**
 * @description 系统管理
 */

const route = [
  {
    path: '/system',
    meta: { title: '系统管理', i18nName: 'tadSysManagement', icon: 'system' },
    name: 'System',
    redirect: '/system/user',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'user',
        meta: { title: '用户管理', i18nName: 'tadUserManage', icon: 'user' },
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue')
      },
      {
        path: 'ip',
        meta: { title: 'IP管理', i18nName: 'tadIpManage', icon: 'visit' },
        name: 'SystemIp',
        component: () => import('@/views/system/ip/index.vue')
      }
    ]
  }
]

export default route
