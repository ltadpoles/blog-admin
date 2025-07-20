import { useTagStore } from './modules/tag'
import { useUserStore } from './modules/user'

/**
 * @description 清空store存储信息
 */
export const RESETSTORE = () => {
  const userStore = useUserStore()
  const tagStore = useTagStore()

  userStore.$reset()
  tagStore.$reset()
}
