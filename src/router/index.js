import { createRouter, createWebHashHistory } from 'vue-router'
import BaseRoutes from './base'

const routes = [
    {
        path: '/',
        name: 'Layout',
        component: () => import(/* webpackChunkName: "layout" */ '@/views/layout'),
        children: [
            {
                path: '404',
                name: '404',
                component: () => import(/* webpackChunkName: "error" */ '@/views/error/404')
            },
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
            ...BaseRoutes
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
    routes
})

export default router
