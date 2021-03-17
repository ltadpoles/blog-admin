const routes = [
    {
        path: 'board',
        name: 'Board',
        meta: {
            text: '留言管理'
        },
        component: () => import(/* webpackChunkName: "board" */ '@/views/board')
    },
    {
        path: 'tag',
        name: 'Tag',
        meta: {
            text: '标签管理'
        },
        component: () => import(/* webpackChunkName: "tag" */ '@/views/tag')
    },
    {
        path: 'article',
        name: 'Article',
        meta: {
            text: '文章管理'
        },
        component: () => import(/* webpackChunkName: "article" */ '@/views/article')
    },
    {
        path: 'article-publish',
        name: 'ArticlePublish',
        meta: {
            text: '文章发布'
        },
        component: () => import(/* webpackChunkName: "article-publish" */ '@/views/article/publish')
    },
    {
        path: 'about',
        name: 'About',
        meta: {
            text: '关于我'
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/about')
    }
]

export default routes
