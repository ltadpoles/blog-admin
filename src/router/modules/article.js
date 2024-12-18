/**
 * @description 文章
 */

const routes = [
  {
    path: '/article',
    name: 'Article',
    redirect: '/article/index',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: 'index',
        meta: { title: '文章管理', icon: 'Memo' },
        name: 'ArticleIndex',
        component: () => import('@/views/article/index/index.vue')
      },
      {
        path: 'tag',
        meta: { title: '标签管理', icon: 'PriceTag' },
        name: 'ArticleTag',
        component: () => import('@/views/article/tag/index.vue')
      },
      {
        path: 'category',
        meta: { title: '类别管理', icon: 'CollectionTag' },
        name: 'ArticleCategory',
        component: () => import('@/views/article/category/index.vue')
      }
    ]
  }
]

export default routes