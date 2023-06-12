import { getResourcesType, getFileName } from '~/common/utils/getResourcesInfo'
import { TrackType } from '~/types/tracks'
import { getOffsetX } from '~/common/utils/getTrackElInfo'
import { pixelToFrameCount } from '~/common/utils/drawTimeLine'
import { getFileBuffer } from '~/common/utils/fetchFile'

class BaseTrackItem {
  file: File
  id: number
  type: TrackType
  name: string
  start = 0
  end = 0
  frameCount: number
  offsetL: number
  offsetR: number
  format: string
  source: string

  constructor(file: File, event: DragEvent, scale: number) {
    this.file = file
    this.id = event.timeStamp
    this.type = getResourcesType(file) as TrackType
    const { name, format } = getFileName(file.name)
    this.name = name
    this.format = format
    this.frameCount = 300
    this.setStart(event, scale)
    this.offsetL = 0
    this.offsetR = 0
    this.source = URL.createObjectURL(file)
  }

  setStart(event: DragEvent, scale: number) {
    this.start = pixelToFrameCount(scale, getOffsetX(event))
    this.end = this.start + this.frameCount - this.offsetL - this.offsetR
  }

  setFrameCount(frameCount: number) {
    this.frameCount = Math.round(frameCount)
    this.end = this.start + frameCount
  }
}

class VideoTrackItem extends BaseTrackItem {
  time: number
  cover: string
  width: number
  height: number
  fps: number

  constructor(file: File, event: DragEvent, scale: number) {
    super(file, event, scale)
    this.time = 0
    this.cover = ''
    this.width = 100
    this.height = 100
    this.fps = 30
  }

  async init() {
    return
  }
}
class AudioTrackItem extends BaseTrackItem {
  time: number
  cover: string

  constructor(file: File, event: DragEvent, scale: number) {
    super(file, event, scale)
    this.time = 0
    this.cover = ''
    // const audio = new Audio()
    // audio.src = this.source
    // audio.addEventListener('loadedmetadata', () => {
    //   this.time = audio.duration
    //   this.setFrameCount(this.time * 30)
    // })
    // audio.load()
  }

  async init(file: File) {
    const buffer = await getFileBuffer(file)
    const audioContext = new AudioContext()
    const audioBuffer = await audioContext.decodeAudioData(buffer)
    this.time = audioBuffer.duration
    this.setFrameCount(this.time * 30)
  }
}
class TextTrackItem extends BaseTrackItem {
  templateId: number
  content: string

  constructor(file: File, event: DragEvent, scale: number) {
    super(file, event, scale)
    this.templateId = 0
    this.content = '默认文本'
  }
}
class ImageTrackItem extends BaseTrackItem {
  cover: string
  width: number
  height: number
  sourceFrame: number

  constructor(file: File, event: DragEvent, scale: number) {
    super(file, event, scale)
    this.cover = this.source
    this.width = 100
    this.height = 100
    this.sourceFrame = 0
  }
}
// 指定轨道
const trackOrder: { [K in TrackType]: 0 | 1 | 2 } = {
  image: 0,
  text: 0,
  video: 1,
  audio: 2
}

const trackHeight: { [K in TrackType]: string } = {
  image: '1.5rem',
  text: '1.5rem',
  video: '4rem',
  audio: '3rem'
}

const trackLeftStart = 10

export {
  VideoTrackItem,
  AudioTrackItem,
  TextTrackItem,
  ImageTrackItem,
  trackOrder,
  trackHeight,
  trackLeftStart
}
