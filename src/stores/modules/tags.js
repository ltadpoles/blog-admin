/*
 * @Description: tags store
 */
import { defineStore } from 'pinia'
import { ENV } from '@/config'

export const useTagsStore = defineStore('tagsStore', {
  state: () => ({
    // 用户打开页面
    tags: [
      {
        title: '首页',
        name: 'Dashboard',
        path: '/dashboard'
      }
    ],
  }),

  actions: {
    setTags(tag) {
      this.tags.push(tag)
    },
    delTag(tag) {
      let i = this.tags.findIndex(item => item.name === tag.name)
      this.tags.splice(i, 1)
    }
  },
  // 持久化存储
  persist: {
    storage: ENV.PINIASTORY
  }
})
