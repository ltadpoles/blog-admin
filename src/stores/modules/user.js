/*
 * @Description: 用户store
 */
import { defineStore } from 'pinia'
import config from '@/config'
import { getUserInfo } from '@/api/admin'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userInfo: {},
    token: {},
    menu: []
  }),
  actions: {
    setToken(data) {
      this.token = data
    },
    setUserInfo(data) {
      this.userInfo = data
    },
    setMenu(data) {
      this.menu = data
    },

    async getInfoAction() {
      let { data } = await getUserInfo()
      // 设置用户信息
      this.setUserInfo(data.data)
    }
  },
  // 持久化存储
  persist: {
    storage: config.PINIASTORY
  }
})
