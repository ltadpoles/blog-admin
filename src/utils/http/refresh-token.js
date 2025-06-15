import { useUserStore } from '@/stores/modules/user'
import { refreshToken } from '@/api/user'
import { ElMessage } from 'element-plus'

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

export const refresh = (http, config) => {
  // 如果没有在刷新
  const userStore = useUserStore()
  const token = userStore.token.token
  if (!isRefreshing) {
    isRefreshing = true
    if (!token.refresh_token) {
      // 清空本地缓存
      userStore.$reset()
      return ElMessage({
        message: '登录已过期，请重新登录',
        type: 'error'
      })
    }
    refreshToken(token.refresh_token)
      .then(res => {
        userStore.setToken(res.data)
        // 已经刷新了token，将所有队列中的请求进行重试
        requests.forEach(cb => cb(res.data.access_token))
        requests = []
        // 重新发起当次过期的请求
        return http(config)
      })
      .catch(() => {
        userStore.$reset()
        return ElMessage({
          message: '登录已过期，请重新登录',
          type: 'error'
        })
      })
      .finally(() => {
        isRefreshing = false
      })
  } else {
    // 正在刷新token，将返回一个未执行resolve的promise
    return new Promise(resolve => {
      // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
      requests.push(() => {
        resolve(http(config))
      })
    })
  }
}
