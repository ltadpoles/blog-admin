import { createRouter, createWebHashHistory } from 'vue-router'
import { staticRoute } from './static'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/stores/modules/user'
import config from '@/config'
import { asyncRoute, setAsyncRoute } from './utils'
import { useSettingStore } from '@/stores/modules/setting'

// 获取前端注册所有动态路由
const modules = import.meta.glob('./modules/*.js', { eager: true })
const routes = []
for (const path in modules) {
  routes.push(...modules[path].default)
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: staticRoute,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        resolve(savedPosition)
      } else {
        if (from.meta.saveSrollTop) {
          const top = document.documentElement.scrollTop || document.body.scrollTop
          resolve({ left: 0, top })
        }
      }
    })
  }
})

/**
 * @description 路由拦截
 */
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const userStore = useUserStore()
  if (to.path === config.LOGIN_URL) {
    // 如果存在 token 不能返回登录页面
    if (userStore.token.token) {
      return next(from.fullPath)
    }
    return next()
  }

  // 如果跳转地址是白名单地址，直接跳转
  if (config.ROUTER_WHITE_LIST.includes(to.path)) {
    return next()
  }

  // 如果没有 token 跳转到登录页面并且携带当前页面路径
  if (!userStore.token.token) {
    return next({ path: config.LOGIN_URL, query: { from: to.fullPath } })
  }

  // 如果没有用户信息
  if (!userStore.userInfo.username) {
    await asyncRoute()
  }
  const settingStore = useSettingStore()
  // 如果用户菜单存在，但动态路由为空
  if (!settingStore.asyncRouteList || !settingStore.asyncRouteList.length) {
    setAsyncRoute(routes)

    return next({ ...to, replace: true })
  }

  // 以上条件都不满足，直接跳转
  return next()
})

/**
 * @description 每次导航之后被执行。返回一个用来移除该钩子的函数
 */
router.afterEach(() => {
  NProgress.done()
})

/**
 * @description 每次导航遇到未被捕获的错误出现时被调用
 */
router.onError(error => {
  NProgress.done()
  Promise.reject('路由跳转错误', error)
})

export default router
