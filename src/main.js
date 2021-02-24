import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Ant from './plugins/Ant'

createApp(App)
    .use(store)
    .use(router)
    .use(Ant)
    .mount('#app')
