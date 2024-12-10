import { ENV } from '../config'
import { useAuthStore } from './modules/auth'
import { useTagsStore } from './modules/tags'
import { useUserStore } from './modules/user'

/**
 * @description 清空store存储信息
 */
export const RESETSTORE = () => {
  const userStore = useUserStore()
  const authStore = useAuthStore()
  const tagsStore = useTagsStore()

  userStore.$reset()
  authStore.$reset()
  tagsStore.$reset()

  ENV.PINIASTORY.clear()
}
