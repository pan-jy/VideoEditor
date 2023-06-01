import { createApp } from 'vue'
import '~/styles/index.scss'
import App from './App.vue'
// import installFFmpeg from '~/plugins/installFFmpeg' // ffmpeg 集成
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
// app.use(installFFmpeg)
app.mount('#app')
