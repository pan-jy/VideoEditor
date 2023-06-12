import { App } from 'vue'
import { FFmpegManager } from '~/common/composables/useFFmpeg'
import { ElLoading } from 'element-plus'
import 'element-plus/es/components/loading/style/css'

const installFFmpeg = {
  install(app: App) {
    let loadingIns: ReturnType<typeof ElLoading.service>
    const ffmpeg = new FFmpegManager({
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
      },
      log: false
    })
    ffmpeg.init()
    app.provide('ffmpeg', ffmpeg)
  }
}

export default installFFmpeg
