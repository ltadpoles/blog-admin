/*
 * @Description: 用户store
 */
import { defineStore } from 'pinia'
// import { getUserInfo } from '@/api/user'
// import { useAuthStore } from './auth'
import { ENV } from '@/config'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userInfo: {},
    token: {}
  }),
  actions: {
    setToken(data) {
      this.token = data
    },
    setUserInfo(data) {
      this.userInfo = data
    },
    async getInfoAction() {
      // const { data } = await getUserInfo()
      // const { avatar, buttons, roles, menu, name } = data
      // const authStore = useAuthStore()
      // 设置用户信息
      // this.setUserInfo({ avatar, name })
      // 设置用户权限信息
      // authStore.setAuth({ buttons, roles, menu })
    }
  },
  // 持久化存储
  persist: {
    storage: ENV.PINIASTORY
  }
})
