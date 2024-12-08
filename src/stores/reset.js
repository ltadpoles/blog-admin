import { ENV } from '../config'
import { useAuthStore } from './modules/auth'
import { useUserStore } from './modules/user'

/**
 * @description 清空store存储信息
 */
export const RESETSTORE = () => {
  const userStore = useUserStore()
  const authStore = useAuthStore()

  userStore.$reset()
  authStore.$reset()

  ENV.PINIASTORY.clear()
}
