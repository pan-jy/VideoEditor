import { App } from 'vue'
import FFmpeg from '~/common/composables/useFFmpeg'
import { ElLoading } from 'element-plus'
import 'element-plus/es/components/loading/style/css'

const installFFmpeg = {
  install(app: App) {
    let loadingIns: ReturnType<typeof ElLoading.service>
    const ffmpeg = new FFmpeg({
      Hooks: {
        beforeInit: () => {
          loadingIns = ElLoading.service({
            text: '正在加载核心模块...',
            background: 'rgba(0, 0, 0, 0.7)',
            fullscreen: true
          })
        },
        afterInit: () => {
          loadingIns.close()
        }
      }
    })
    ffmpeg.init()
    app.provide('ffmpeg', ffmpeg)
  }
}

export default installFFmpeg
