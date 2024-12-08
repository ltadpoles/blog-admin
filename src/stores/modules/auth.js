/*
 * @Description: 用户权限store
 */
import { defineStore } from 'pinia'
import { ENV } from '@/config'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    // 用户菜单
    menu: [],
    // 用户角色
    roles: [],
    // 用户权限按钮
    buttons: []
  }),

  actions: {
    setAuth(authInfo) {
      this.menu = authInfo.menu
      this.roles = authInfo.roles
      this.buttons = authInfo.buttons
    }
  },
  // 持久化存储
  persist: {
    storage: ENV.PINIASTORY
  }
})
