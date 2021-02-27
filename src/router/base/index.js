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
        path: 'article',
        name: 'Article',
        meta: {
            text: '文章管理'
        },
        component: () => import(/* webpackChunkName: "article" */ '@/views/article')
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
