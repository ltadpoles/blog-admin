import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Ant from './plugins/Ant'
import vueMarkDown from './plugins/editor'

createApp(App)
    .use(vueMarkDown)
    .use(store)
    .use(router)
    .use(Ant)
    .mount('#app')
