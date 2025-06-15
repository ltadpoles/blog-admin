import config from '@/config'
import router from '.'
import { useUserStore } from '@/stores/modules/user'
import { RESETSTORE } from '@/stores/reset'
import { notFoundRouter } from './static'
import { useSettingStore } from '@/stores/modules/setting'

/**
 * @description 异步路由
 */
export const asyncRoute = async () => {
  const userStore = useUserStore()

  try {
    // 获取用户信息
    await userStore.getInfoAction()

    // 如果用户没有菜单
    if (!userStore.menu.length) {
      RESETSTORE()
      router.replace(config.LOGIN_URL)
      return Promise.reject('用户无菜单权限')
    }
  } catch (error) {
    // 如果获取动态路由步骤出错
    RESETSTORE()
    router.replace(config.LOGIN_URL)
    return Promise.reject(error)
  }
}

/**
 * @description 添加动态路由
 * @param {Array} routes 路由
 */
export const setAsyncRoute = routes => {
  let asyncRouteList = []
  const settingStore = useSettingStore()

  // 是否开启动态路由
  if (config.ISASYNCROUTER) {
    // 过滤路由
    asyncRouteList = []
  } else {
    asyncRouteList = routes
  }

  settingStore.setRouteList(asyncRouteList)

  // 添加动态路由
  asyncRouteList.forEach(route => {
    router.addRoute(route)
  })

  // 添加默认跳转路由
  router.addRoute(notFoundRouter)
}
