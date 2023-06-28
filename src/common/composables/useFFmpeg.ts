import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import type { CreateFFmpegOptions, FFmpeg } from '@ffmpeg/ffmpeg'
import { reactive, ref, watch } from 'vue'
import { Command } from '../utils/ffmpegCommand'
import { TrackItem } from '~/types/tracks'

interface Task {
  instance: Promise<unknown>
  commands: string[]
  resolve: (value: unknown) => void
  reject: (error?: unknown) => void
}

type LogParams = { type: string; message: string }
type ProgressParams = { ratio: number }

const FileTypeMap = {
  bpm: 'image/bpm',
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  mp3: 'audio/mp3',
  mp4: 'video/mpeg4',
  aac: 'audio/x-mei-aac'
}

export class FFmpegManager {
  private ffmpeg: FFmpeg
  private taskQueue = reactive<Task[]>([]) // 任务队列
  private running = ref(false) // 运行状态
  public showLog = true
  public playTimeCache = new Map()
  public audioCache: string[] = []
  public baseCommand = new Command()
  public pathConfig = {
    resourcePath: '/resource/', // 资源目录，存放视频、音频等大文件
    framePath: '/frame/', // 持久化帧文件，用于轨道
    playFrame: '/pframe/', // 播放帧文件，因为文件体积大，可能会不定时删除
    audioPath: '/audio/', // 合成音频文件
    logPath: '/logs/', // 命令日志文件目录
    wavePath: '/wave/' // 音频波形文件目录
  }
  private static Hooks = {
    beforeInit: (ins: FFmpegManager) => {
      console.log(ins)
    },
    afterInit: (ins: FFmpegManager) => {
      console.log(ins)
    }
  }
  constructor(
    options?: Record<string, unknown> &
      CreateFFmpegOptions & { Hooks: typeof FFmpegManager.Hooks }
  ) {
    Object.assign(FFmpegManager.Hooks, options?.Hooks || {})
    const createFFmpegOptions: CreateFFmpegOptions = {
      log: options?.log ? options.log : false,
      logger: this.logger,
      progress: this.logProgress
    }
    this.ffmpeg = createFFmpeg(createFFmpegOptions)
    watch(this.taskQueue, () => {
      this.startRunTask()
    })
  }
  async init() {
    FFmpegManager.Hooks.beforeInit(this)
    await this.ffmpeg.load()
    this.initFileSystem()
    FFmpegManager.Hooks.afterInit(this)
  }

  exit() {
    return this.ffmpeg.exit()
  }

  logger(msg: LogParams) {
    console.log(`${msg.type}: ${msg.message}--${Date.now().toLocaleString()}`)
  }

  logProgress(p: ProgressParams) {
    console.log(p)
  }

  logDir(filePath: string) {
    this.showLog && console.log(this.readDir(filePath))
  }
  private readDir(filePath: string) {
    return this.ffmpeg.FS('readdir', filePath)
  }

  isLoaded() {
    return this.ffmpeg.isLoaded
  }

  private startRunTask() {
    if (this.running.value || this.taskQueue.length === 0) return
    this.running.value = true
    this.loopRunTask()
  }

  private async loopRunTask() {
    const task = this.taskQueue[0]
    if (!task) {
      this.running.value = false
      return
    }
    const { commands, resolve, reject } = task
    console.log(task)
    try {
      const res = await this.ffmpeg.run(...commands)
      resolve(res)
    } catch (error) {
      reject(error)
    }
    this.taskQueue.shift()
    if (this.taskQueue.length > 0) await this.loopRunTask()
    else this.running.value = false
  }
  /**
   * 判断任务队列中是否存在执行此命令的任务，如果存在则返回该任务，否则返回 undefined
   * @param commands 待执行命令
   * @returns 执行该命令的任务，没有则返回 undefined
   */
  private existTask(commands: string[]) {
    return this.taskQueue.find(
      (task) => task.commands.join('') === commands.join('')
    )
  }

  createTask(commands: string[]) {
    const task = this.existTask(commands)
    if (task) {
      return task.instance
    } else {
      const callbacks = {}
      const instance = new Promise((resolve, reject) => {
        Object.assign(callbacks, {
          resolve,
          reject
        })
      })
      this.taskQueue.push({
        instance,
        commands,
        ...callbacks
      } as Task)
      return instance
    }
  }

  private initFileSystem() {
    this.mkdir(Object.values(this.pathConfig))
  }

  private mkdir(paths: string[]) {
    paths.forEach((path) => {
      this.ffmpeg.FS('mkdir', path)
    })
  }

  rmFile(filePath: string) {
    return this.ffmpeg.FS('unlink', filePath)
  }

  fileExist(filePath: string, fileName: string) {
    try {
      return this.readDir(filePath).indexOf(fileName) > -1
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async writeFile(
    filePath: string,
    fileName: string,
    file: File,
    force = false
  ) {
    if (force || !this.fileExist(filePath, fileName)) {
      this.ffmpeg.FS(
        'writeFile',
        `${filePath}${fileName}`,
        await fetchFile(file)
      )
    }
    this.logDir(filePath)
  }

  getFileBuffer(filePath: string, fileName: string, format: string) {
    const localPath = `${fileName}.${format}`
    return this.ffmpeg.FS('readFile', `${filePath}${localPath}`)
  }

  // 获取文件Blob
  getFileBlob(filePath: string, fileName: string, format: string) {
    const fileBuffer = this.getFileBuffer(filePath, fileName, format)
    return new Blob([fileBuffer], {
      type: FileTypeMap[format as keyof typeof FileTypeMap]
    })
  }
  /**
   * 获取文件url，用于下载
   * */
  getFileURL(filePath: string, fileName: string, format: string) {
    const fileBlob = this.getFileBlob(filePath, fileName, format)
    return window.URL.createObjectURL(fileBlob)
  }
  /**
   * 获取文件file对象
   * */
  getFile(filePath: string, fileName: string, format: string) {
    const localPath = `${fileName}.${format}`
    const fileBuffer = this.getFileBuffer(filePath, fileName, format)
    return new File([fileBuffer], localPath, {
      type: FileTypeMap[format as keyof typeof FileTypeMap]
    })
  }
  // 音频合成
  async mergeAudio(
    start: number,
    itemList: TrackItem[],
    fileName: string,
    filePath: string
  ) {
    const { commands } = this.baseCommand.mergeAudio(
      this.pathConfig,
      start,
      itemList
    )
    if (this.audioCache.indexOf(commands.join('')) > -1) return false
    this.audioCache = [commands.join('')]
    if (this.fileExist(filePath, fileName)) this.rmFile(filePath)
    return this.createTask(commands)
  }
  /**
   * 从视频中分离音频
   * */
  async splitAudio(videoName: string, format: string, force = false) {
    const { commands, audioPath, audioName } = this.baseCommand.splitAudio(
      this.pathConfig.resourcePath,
      videoName,
      format
    )
    if (force || !this.fileExist(this.pathConfig.resourcePath, audioName)) {
      await this.createTask(commands)
    }
    return { audioPath, audioName }
  }
  // 生成音波
  async genWave(
    sourceName: string,
    frameCount: number,
    format = 'aac',
    force = false
  ) {
    let audioPath = Command.genVideoAAC(
      this.pathConfig.resourcePath,
      sourceName
    )
    if (format !== 'aac') {
      audioPath = `${this.pathConfig.resourcePath}${sourceName}.${format}`
    }
    const { commands, fileName } = this.baseCommand.genWave(
      audioPath,
      sourceName,
      this.pathConfig.wavePath,
      frameCount
    )
    if (force || !this.fileExist(this.pathConfig.wavePath, fileName)) {
      await this.createTask(commands)
    }
    return { audioPath, wavePath: fileName }
  }
  /**
   * 视频/gif 抽帧（全量，用于轨道）
   * */
  async genFrame(
    fileName: string,
    format: string,
    size: { w: number; h: number }
  ) {
    const framePath = `${this.pathConfig.framePath}${fileName}`
    const filePath = `${fileName}.${format}`

    // 如果视频不存在
    if (!this.fileExist(this.pathConfig.resourcePath, filePath))
      return { framePath, frameCount: 0 }
    // 如果帧不存在
    if (!this.fileExist(this.pathConfig.framePath, fileName)) {
      this.mkdir([framePath])
      const { commands } = this.baseCommand.genFrame(
        `${this.pathConfig.resourcePath}${filePath}`,
        framePath,
        size,
        format
      )
      await this.createTask(commands)
    }
    this.logDir(this.pathConfig.framePath)
    this.logDir(framePath)
    const frameCount = this.readDir(framePath).length - 2

    return {
      framePath,
      frameCount
    }
  }
  /**
   * 视频抽帧指定时间（用于播放）
   * */
  async genPlayFrame(
    videoName: string,
    format: string,
    size: { w: number; h: number },
    time: number
  ) {
    return new Promise((resolve) => {
      const framePath = `${this.pathConfig.playFrame}${videoName}`
      const videoFilePath = `${videoName}.${format}`
      const fileName = `pic-${time}-1.jpg`
      const genCache = this.playTimeCache.get(videoName) || [] // 缓存已加载时间
      if (genCache.indexOf(time) > -1) {
        resolve({ framePath })
        return
      }
      if (!this.fileExist(this.pathConfig.resourcePath, videoFilePath)) {
        resolve({ framePath })
        return
      }
      if (!this.fileExist(this.pathConfig.playFrame, videoName))
        this.mkdir([framePath])
      if (!this.fileExist(this.pathConfig.playFrame, fileName)) {
        // 不重复抽帧
        const { commands } = this.baseCommand.genPlayFrame(
          `${this.pathConfig.resourcePath}${videoFilePath}`,
          framePath,
          size,
          time
        )
        this.createTask(commands).then(() => {
          genCache.push(time)
          this.playTimeCache.set(videoName, genCache)
          resolve({ framePath })
        })
      } else {
        resolve({ framePath })
      }
    })
  }
  // 获取视频帧图片
  getFrame(videoName: string, frameIndex: number) {
    const framePath = `${this.pathConfig.framePath}${videoName}`
    const fileName = `/pic-${frameIndex}`
    // return this.getFileBlob(framePath, fileName, 'jpg')
    return this.getFileBuffer(framePath, fileName, 'jpg')
  }
  // 获取播放视频帧图片
  getPFrame(videoName: string, frameIndex: number) {
    let time = Math.floor(frameIndex / 30)
    let frame = frameIndex % 30
    if (frame === 0) {
      if (frameIndex === 0) {
        frame = 1
      } else {
        time--
        frame = 30
      }
    }
    const framePath = `${this.pathConfig.playFrame}${videoName}`
    const fileName = `/pic-${time}-${frame}`
    return this.getFileBlob(framePath, fileName, 'jpg')
  }
  // 获取Gif图片
  getGifFrame(gifName: string, frameIndex: number) {
    const framePath = `${this.pathConfig.framePath}${gifName}`
    const fileName = `/gif-${frameIndex}`
    return this.getFileBlob(framePath, fileName, 'png')
  }
  // 获取指定的某一帧
  async getPIFrame(
    videoName: string,
    format: string,
    size: { w: number; h: number },
    start: number
  ) {
    const fileName = `/pic`
    const framePath = `${this.pathConfig.playFrame}${videoName}`
    const videoFilePath = `${videoName}.${format}`
    if (!this.fileExist(this.pathConfig.resourcePath, videoFilePath))
      return false
    if (!this.fileExist(this.pathConfig.playFrame, videoName))
      this.mkdir([framePath])
    const { commands } = this.baseCommand.genPlayIFrame(
      `${this.pathConfig.resourcePath}${videoFilePath}`,
      framePath,
      size,
      start
    )
    await this.createTask(commands)
    // const fileBuffer = this.getFileBuffer(framePath, fileName, 'jpg')
    return this.getFileBlob(framePath, fileName, 'jpg')
  }
  // 获取波形
  getWavePng(sourceName: string) {
    return this.getFileURL(this.pathConfig.wavePath, sourceName, 'png')
  }
  // 获取音频
  async getAudio(itemList: TrackItem[]) {
    const fileName = 'audio.mp3'
    const filePath = `${this.pathConfig.audioPath}${fileName}`
    let start = 0
    let end = 0
    itemList.forEach((trackItem) => {
      start = Math.min(trackItem.start, start)
      end = Math.max(trackItem.end, end)
    })
    await this.mergeAudio(start, itemList, fileName, filePath)
    if (!this.fileExist(this.pathConfig.audioPath, fileName)) {
      return {
        start,
        end,
        audioUrl: ''
      }
    }
    const audioUrl = this.getFileURL(this.pathConfig.audioPath, 'audio', 'mp3')
    return {
      start,
      end,
      audioUrl
    }
  }
}
