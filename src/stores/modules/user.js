/*
 * @Description: 用户store
 */
import { defineStore } from 'pinia'
import { getUserInfo, getUserMenu } from '@/api/admin'
import { useAuthStore } from './auth'
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
      const { data } = await getUserInfo()
      const menu = await getUserMenu()
      const authStore = useAuthStore()
      // 设置用户信息
      this.setUserInfo(data.data)
      // 设置用户权限信息
      authStore.setAuth({menu: menu.data.data})
    }
  },
  // 持久化存储
  persist: {
    storage: ENV.PINIASTORY
  }
})
