const websiteRoute = [
  {
    path: '/website',
    meta: { title: '网站管理', i18nName: 'tadWebsiteManage', icon: 'system' },
    name: 'Website',
    redirect: '/website/basic',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'basic',
        meta: { title: '基础信息', i18nName: 'tadBasicInfo', icon: 'system' },
        name: 'WebsiteBasic',
        component: () => import('@/views/website/basic/index.vue')
      }
    ]
  }
]

export default websiteRoute
