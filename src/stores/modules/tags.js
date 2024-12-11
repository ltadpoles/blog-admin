/*
 * @Description: tags store
 */
import { defineStore } from 'pinia'
import { ENV } from '@/config'

export const useTagsStore = defineStore('tagsStore', {
  state: () => ({
    // 用户打开页面
    tagList: [
      {
        title: '首页',
        name: 'Dashboard',
        path: '/dashboard'
      }
    ],
  }),

  actions: {
    addTag(tag) {
      this.tagList.push(tag)
    },
    delTag(tag) {
      let i = this.tagList.findIndex(item => item.name === tag.name)
      this.tagList.splice(i, 1)
    }
  },
  // 持久化存储
  persist: {
    storage: ENV.PINIASTORY
  }
})
