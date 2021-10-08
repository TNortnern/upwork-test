import { createApp } from 'vue'
import VueCookies from 'vue3-cookies'
import api from './lib/api'
import store from './store'
import App from './App.vue'
import './index.css'
const app = createApp(App)
app.config.globalProperties.$axios = api
app.use(store)
app.use(VueCookies)
app.mount('#app')
