import { createRouter, createWebHashHistory } from 'vue-router'
import { Modal } from 'ant-design-vue'
import BaseRoutes from './base'

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
        component: () => import(/* webpackChunkName: "layout" */ '@/views/layout'),
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                meta: {
                    text: '首页'
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard')
            },
            ...BaseRoutes,
            {
                path: '500',
                name: '500',
                meta: {
                    text: '500'
                },
                component: () => import(/* webpackChunkName: "error" */ '@/views/error/500')
            },
            {
                path: '/:catchAll(.*)',
                name: '404',
                meta: {
                    text: '404'
                },
                component: () => import(/* webpackChunkName: "error" */ '@/views/error/404')
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            text: '登录'
        },
        component: () => import(/* webpackChunkName: "login" */ '@/views/login')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        // 始终滚动到顶部
        return { top: 0 }
    }
})

router.beforeEach((to, from, next) => {
    Modal.destroyAll()
    next()
})

export default router
