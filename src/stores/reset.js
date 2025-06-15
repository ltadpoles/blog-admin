import { useUserStore } from './modules/user'

/**
 * @description 清空store存储信息
 */
export const RESETSTORE = () => {
  const userStore = useUserStore()

  userStore.$reset()
}
