/**
 * @description 消息管理
 */

const route = [
  {
    path: '/message',
    meta: { title: '消息管理', i18nName: 'tadMessageManage', icon: 'messages' },
    name: 'Message',
    redirect: '/message/messages',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'messages',
        meta: { title: '留言管理', i18nName: 'tadMessages', icon: 'messages' },
        name: 'messageMessages',
        component: () => import('@/views/article/messages/index.vue')
      },
      {
        path: 'comments',
        meta: { title: '评论管理', i18nName: 'tadComments', icon: 'comment' },
        name: 'messageComments',
        component: () => import('@/views/article/comments/index.vue')
      },
      {
        path: 'notification',
        meta: { title: '通知管理', i18nName: 'tadNotification', icon: 'notification' },
        name: 'messageNotification',
        component: () => import('@/views/system/notification/index.vue')
      }
    ]
  }
]

export default route
