import { createApp } from 'vue'
import router from './router'
import { store, key } from './store'
import Layout from './scene/Layout.vue'
import 'virtual:windi.css'
import './style/index.css'
// import 'virtual:windi-devtools'

createApp(Layout).use(router).use(store, key).mount('#app')
