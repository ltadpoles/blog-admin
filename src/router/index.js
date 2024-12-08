import { createRouter, createWebHashHistory } from 'vue-router'
import { staticRoute } from './static'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: staticRoute,
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return new Promise(resolve => {
      if (savedPosition) {
        resolve(savedPosition)
      } else {
        if (from.meta.saveSrollTop) {
          const top = document.documentElement.scrollTop || document.body.scrollTop
          resolve({ left: 0, top })
        }
      }
    })
  }
})

export default router
