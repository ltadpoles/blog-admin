import { createRouter, createWebHashHistory } from 'vue-router'
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
                component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard')
            },
            ...BaseRoutes,
            {
                path: '403',
                name: '403',
                component: () => import(/* webpackChunkName: "error" */ '@/views/error/403')
            },
            {
                path: '500',
                name: '500',
                component: () => import(/* webpackChunkName: "error" */ '@/views/error/500')
            },
            {
                path: '/:catchAll(.*)',
                name: '404',
                component: () => import(/* webpackChunkName: "error" */ '@/views/error/404')
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
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

export default router
