import router from './index'
import { ENV } from '../config'
// import { useAuthStore } from '../stores/modules/auth'
import { useUserStore } from '../stores/modules/user'
import { RESETSTORE } from '../stores/reset'
// import { filterAsyncRoutes, getRouteNameList } from './utils'
import { notFoundRouter } from './static'
import { useSettingStore } from '../stores/modules/setting'
// import { ElNotification } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 获取前端注册所有动态路由
const modules = import.meta.glob('./modules/*.js', { eager: true })
const allAsyncRoutes = []
for (const path in modules) {
  allAsyncRoutes.push(...modules[path].default)
}

/**
 * @description 每次导航之前被执行。返回一个用来移除该钩子的函数
 */
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (to.path === ENV.LOGIN_URL) {
    // 如果存在 token 不能返回登录页面
    if (userStore.token.token) {
      return next(from.fullPath)
    }
    return next()
  }

  // 如果跳转地址是白名单地址，直接跳转
  if (ENV.ROUTER_WHITE_LIST.includes(to.path)) {
    return next()
  }

  // 如果没有 token 跳转到登录页面并且携带当前页面路径
  if (!userStore.token.token) {
    return next({ path: ENV.LOGIN_URL, query: { redirect: to.fullPath } })
  }

  // 如果没有用户菜单就再去请求一次用户信息
  if (!userStore.userInfo.username) {
    await asyncRoute()
  }

  const settingStore = useSettingStore()
  // 如果用户菜单存在，但动态路由为空
  if (!settingStore.asyncRouteList || !settingStore.asyncRouteList.length) {
    setAsyncRoute(allAsyncRoutes)

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
  Promise.reject('路由跳转错误', error.message)
})

/**
 * @description 异步路由
 */
const asyncRoute = async () => {
  const userStore = useUserStore()
  // const authStore = useAuthStore()

  try {
    // 获取用户信息
    await userStore.getInfoAction()

    // 如果用户没有菜单
    // if (!authStore.menu.length) {
    //   ElNotification({
    //     title: '无权限访问',
    //     message: '当前账号无任何菜单权限，请联系系统管理员！',
    //     type: 'warning',
    //     duration: 3000
    //   })
    //   RESETSTORE()
    //   router.replace(ENV.LOGIN_URL)
    //   return Promise.reject('用户无菜单权限')
    // }

    // // 添加动态路由
    setAsyncRoute(allAsyncRoutes)
  } catch (error) {
    // 如果获取动态路由步骤出错
    RESETSTORE()
    router.replace(ENV.LOGIN_URL)
    return Promise.reject(error)
  }
}

/**
 * @description 添加动态路由
 * @param {Array} allAsyncRoutes 路由
 */
const setAsyncRoute = allAsyncRoutes => {
  const settingStore = useSettingStore()
  // const authStore = useAuthStore()

  let asyncRouteList = []

  // if (ENV.ISASYNCROUTER) {
  //   // 过滤路由
  //   const authRouterList = getRouteNameList(authStore.menu, 'routeName')
  //   const routerList = filterAsyncRoutes(allAsyncRoutes, authRouterList)
  //   asyncRouteList = routerList
  // } else {
  asyncRouteList = allAsyncRoutes
  // }

  settingStore.setRouteList(asyncRouteList)

  // 添加动态路由
  asyncRouteList.forEach(route => {
    router.addRoute(route)
  })

  // 添加默认跳转路由
  router.addRoute(notFoundRouter)
}
