const routes = [
    {
        path: 'board',
        name: 'Board',
        component: () => import(/* webpackChunkName: "board" */ '@/views/board')
    } /* 留言管理 */,
    {
        path: 'article',
        name: 'Article',
        component: () => import(/* webpackChunkName: "article" */ '@/views/article')
    } /* 文章管理 */,
    {
        path: 'about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '@/views/about')
    } /* 个人中心 */
]

export default routes
