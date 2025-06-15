/* *
 * @description: tagStore
 */

import { defineStore } from 'pinia'

export const useTagStore = defineStore('tagStore', {
  // 初始化默认展示【工作台】标签导航
  state: () => ({
    tagList: [
      {
        meta: {
          i18nName: 'tadHome',
          icon: 'house',
          title: '首页'
        },
        name: 'Dashboard',
        path: '/dashboard'
      }
    ]
  }),
  actions: {
    addTag(item) {
      this.tagList.push(item)
    },
    delTag(item) {
      // 找出要删除的tag的索引值
      const i = this.tagList.findIndex(v => v.name === item.name)
      this.tagList.splice(i, 1)
    }
  }
})
