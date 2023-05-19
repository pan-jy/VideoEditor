import { createApp } from 'vue'
import '~/styles/index.scss'
import App from './App.vue'
import installFFmpeg from '~/plugins/installFFmpeg' // ffmpeg 集成

const app = createApp(App)
app.use(installFFmpeg)
app.mount('#app')
