/**
 * @description 文章管理
 */

const route = [
  {
    path: '/article',
    meta: { title: '文章管理', i18nName: 'tadArticle', icon: 'article' },
    name: 'Article',
    redirect: '/article/index',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'index',
        meta: { title: '文章管理', i18nName: 'tadArticle', icon: 'article' },
        name: 'articleIndex',
        component: () => import('@/views/article/index.vue')
      },
      {
        path: 'tags',
        meta: { title: '标签管理', i18nName: 'tadTags', icon: 'tags' },
        name: 'articleTags',
        component: () => import('@/views/article/tags/index.vue')
      },
      {
        path: 'category',
        meta: { title: '分类管理', i18nName: 'tadCategory', icon: 'category' },
        name: 'articleCategory',
        component: () => import('@/views/article/category/index.vue')
      },
      {
        path: 'messages',
        meta: { title: '留言管理', i18nName: 'tadMessages', icon: 'messages' },
        name: 'articleMessages',
        component: () => import('@/views/article/messages/index.vue')
      },
      {
        path: 'comments',
        meta: { title: '评论管理', i18nName: 'tadComments', icon: 'messages' },
        name: 'articleComments',
        component: () => import('@/views/article/comments/index.vue')
      }
    ]
  }
]

export default route
