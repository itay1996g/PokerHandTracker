import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from './store/index'
import router from './router'
import './index.css'

createApp(App).use(store, key).use(router).mount('#app')
