import { createFFmpeg } from '@ffmpeg/ffmpeg'
import type { CreateFFmpegOptions, FFmpeg } from '@ffmpeg/ffmpeg'

export default class FFmpegManager {
  private static Hooks = {
    beforeInit: (ins: FFmpegManager) => {
      console.log(ins)
    },
    afterInit: (ins: FFmpegManager) => {
      console.log(ins)
    }
  }
  private ffmpeg: FFmpeg
  constructor(
    options?: Record<string, unknown> &
      CreateFFmpegOptions & { Hooks: typeof FFmpegManager.Hooks }
  ) {
    Object.assign(FFmpegManager.Hooks, options?.Hooks || {})
    const createFFmpegOptions: CreateFFmpegOptions = {
      log: options?.log ? options.log : false,
      logger: (msg) => {
        console.log(msg)
      },
      progress: (p) => {
        console.log(p)
      }
    }
    this.ffmpeg = createFFmpeg(createFFmpegOptions)
  }
  async init() {
    FFmpegManager.Hooks.beforeInit(this)
    await this.ffmpeg.load()
    FFmpegManager.Hooks.afterInit(this)
  }
}
