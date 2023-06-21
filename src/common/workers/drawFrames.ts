export type {}
import type { CanvasAttr, FramesInfo, VideoTrackInfo } from '~/types/canvas'
let frames: Frames
self.addEventListener('message', (e) => {
  console.log(e.data)
  const action = e.data.action

  if (action === 'init') {
    frames = new Frames(e.data.canvas)
  } else if (action === 'setBuffers') {
    frames.setBuffers(e.data.buffers)
  } else if (action === 'setConfig') {
    frames.setConfig(e.data.canvasAttr, e.data.videoTrackInfo)
  }
})

class Frames {
  private canvas: OffscreenCanvas
  private context: CanvasRenderingContext2D
  private buffers!: Array<ArrayBuffer>
  private imageBitmaps!: Array<ImageBitmap>
  private canvasAttr!: CanvasAttr
  private framesInfo!: FramesInfo
  private videoTrackInfo!: VideoTrackInfo

  constructor(canvas: OffscreenCanvas) {
    this.canvas = canvas
    this.context = canvas.getContext(
      '2d'
    ) as unknown as CanvasRenderingContext2D
  }

  setBuffers(buffers: Array<ArrayBuffer>) {
    this.buffers = buffers
    this.imageBitmaps = new Array(this.buffers.length)
  }

  setConfig(canvasAttr: CanvasAttr, videoTrackInfo: VideoTrackInfo) {
    this.canvas.width = canvasAttr.width
    this.canvas.height = canvasAttr.height
    this.canvasAttr = canvasAttr
    this.videoTrackInfo = videoTrackInfo
    const { width, height } = canvasAttr
    const { start, end, videoW, videoH } = videoTrackInfo
    const frameW = Math.ceil(videoW / (videoH / height))
    const frameCount = end - start
    const maxFrame = Math.min(Math.ceil(width / frameW), frameCount)
    this.framesInfo = { height, width: frameW, frameCount, maxFrame }
    this.drawFrames()
  }

  private async drawFrame(
    frameBuffer: ArrayBuffer,
    frameIndex: number,
    drawIndex = 0,
    margin = 0
  ) {
    const frameBlob = new Blob([frameBuffer], { type: 'image/jpeg' })
    let imageBitmap = this.imageBitmaps[frameIndex]
    // console.log(frameIndex, frameBlob)
    if (!imageBitmap) {
      imageBitmap = await createImageBitmap(frameBlob)
      this.imageBitmaps[frameIndex] = imageBitmap
    }
    const { width: containerWidth } = this.canvasAttr
    const { width, height, maxFrame } = this.framesInfo
    const { videoW, videoH } = this.videoTrackInfo
    const left =
      drawIndex === maxFrame - 1
        ? containerWidth - width
        : drawIndex * (width + margin)
    this.context.drawImage(
      imageBitmap,
      0,
      0,
      videoW,
      videoH,
      left,
      0,
      width,
      height
    )
  }

  drawFrames() {
    if (this.buffers.length === 0) return
    const { width: containerWidth } = this.canvasAttr
    const { width, frameCount, maxFrame } = this.framesInfo
    const frameStep = Math.max(maxFrame - 1, 1) // 帧间距数，最小为1帧
    const renderSpace = Math.max(Math.floor(frameCount / frameStep), 1) // 间隔多少帧渲染一次，最小为1帧
    let overFrame = Math.floor(frameCount - 1 - renderSpace * frameStep) // 不能整除时溢出帧数
    const offset = Math.max(containerWidth - Math.floor(maxFrame * width), 0) // 不够撑满canvas宽度的情况
    const marginSpace = Math.max(Math.round(offset / frameStep), 0) // 帧数不够填满容器时的间距
    let frameIndex = this.videoTrackInfo.offsetL // 开始下标
    for (let i = 0; i < maxFrame; i++) {
      frameIndex = Math.floor(frameIndex)
      const frameBuffer = this.buffers[frameIndex]
      this.drawFrame(frameBuffer, frameIndex, i, marginSpace)
      frameIndex = Math.min(frameIndex + renderSpace, frameCount - 1)
      if (overFrame > 0) {
        frameIndex += 1
        overFrame--
      }
    }
  }
}
