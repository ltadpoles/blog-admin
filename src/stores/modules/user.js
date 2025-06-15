/*
 * @Description: 用户store
 */
import { defineStore } from 'pinia'
import config from '@/config'

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
      // 设置用户信息
      this.setUserInfo({
        username: 'ltadpole',
        name: '游荡de蝌蚪',
        age: 18,
        sex: 1
      })
      this.setToken({ token: ' 123456' })
      this.setMenu([
        {
          name: '首页',
          path: '/'
        }
      ])
    }
  },
  // 持久化存储
  persist: {
    storage: config.PINIASTORY
  }
})
