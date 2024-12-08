/*
 * @Description: 项目配置store
 */
import { defineStore } from 'pinia'
import { darken, lighten } from '@/utils/theme'

export const useSettingStore = defineStore('settingStore', {
  state: () => ({
    isCollapsed: false, // 菜单收缩控制
    primaryColor: '#409eff', // 项目主题色
    asyncRouteList: [] // 动态路由数组
  }),
  actions: {
    increment() {
      this.isCollapsed = !this.isCollapsed
    },
    setPrimaryColor(color = this.primaryColor) {
      this.primaryColor = color
      const el = document.documentElement
      // 获取 css 变量
      getComputedStyle(el).getPropertyValue('--el-color-primary')
      // 设置 css 变量
      el.style.setProperty('--el-color-primary', color)

      // 获取其他色调的颜色
      for (let i = 1; i <= 9; i++) {
        el.style.setProperty(`--el-color-primary-light-${i}`, lighten(color, i / 10))
        el.style.setProperty(`--el-color-primary-dark-${i}`, darken(color, i / 10))
      }
    },
    setRouteList(list) {
      this.asyncRouteList = list
    }
  }
})
