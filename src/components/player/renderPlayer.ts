import { onMounted, reactive, Ref, ref, watch } from 'vue'
import { FFmpegManager } from '~/common/composables/useFFmpeg'
import { useThrottleFn, useDebounceFn } from '@vueuse/core'
import { ImageTrackItem, TrackItem, VideoTrackItem } from '~/types/tracks'
import { usePlayerState } from '~/stores/playerState'
import { CanvasTextBaseline, CanvasTextAlign, CanvasAttr } from '~/types/canvas'

type TextOptions = {
  textBaseLine: CanvasTextBaseline
  textAlign: CanvasTextAlign
  bgColor: string
}

export class RenderPlayer {
  public loading = ref(true)

  private player: Ref<HTMLCanvasElement | undefined>
  private playerContext: CanvasRenderingContext2D | null = null
  private preRenderPlayer: HTMLCanvasElement
  private preRenderContext: CanvasRenderingContext2D | null = null
  private ffmpeg: FFmpegManager
  private playerState
  private containerSize
  private canvasAttr = reactive<CanvasAttr>({ width: 0, height: 0 })
  private textOptions: TextOptions = {
    textBaseLine: 'middle',
    textAlign: 'center',
    bgColor: '#111827'
  }

  constructor(
    player: Ref<HTMLCanvasElement | undefined>,
    ffmpeg: FFmpegManager,
    containerSize: {
      width: Ref<number>
      height: Ref<number>
    }
  ) {
    this.player = player
    this.preRenderPlayer = document.createElement('canvas')
    this.ffmpeg = ffmpeg
    this.containerSize = containerSize
    this.playerState = usePlayerState()
    onMounted(() => {
      this.initContent()
    })
  }

  private initContent() {
    if (!this.player.value) return
    this.playerContext = this.player.value.getContext('2d')
    this.preRenderContext = this.preRenderPlayer.getContext('2d')
    if (this.preRenderContext) {
      this.preRenderContext.font = this.getFont()
      this.preRenderContext.textBaseline = this.textOptions.textBaseLine
      this.preRenderContext.textAlign = this.textOptions.textAlign
    }
    this.initWatch()
  }

  private getFont(size = 14) {
    return `${size}px -apple-system, ".SFNSText-Regular", "SF UI Text", "PingFang SC", "Hiragino Sans GB", "Helvetica Neue", "WenQuanYi Zen Hei", "Microsoft YaHei", Arial, sans-serif`
  }

  private initWatch() {
    // 大小变化时则更新大小
    watch(
      [
        () => this.playerState.playerWidth,
        () => this.playerState.playerHeight,
        () => this.containerSize
      ],
      useDebounceFn(() => {
        const size = {
          videoW: this.playerState.playerWidth,
          videoH: this.playerState.playerHeight,
          containerW: this.containerSize.width.value,
          containerH: this.containerSize.height.value
        }
        this.updateCanvasSize(size)
      }, 100),
      {
        deep: true,
        immediate: true
      }
    )
    // 加载状态变化时修改加载状态并绘制帧
    watch(
      [this.ffmpeg.isLoaded(), () => this.playerState.inLoadingCount],
      () => this.checkLoading(),
      {
        immediate: true
      }
    )
    // 播放列表及播放器大小变化时绘制帧
    watch(
      [() => this.playerState.playTargetTrackMap, () => this.canvasAttr],
      useThrottleFn(() => {
        this.drawCanvas()
      }, 30),
      { deep: true }
    )
    // 帧变化时绘制帧
    watch(
      () => this.playerState.playingFrame,
      () => this.drawCanvas()
    )
  }

  private checkLoading() {
    this.loading.value = true
    if (this.ffmpeg.isLoaded() && this.playerState.inLoadingCount === 0) {
      this.loading.value = false
      this.drawCanvas()
    }
  }

  private updateCanvasSize(size: {
    videoW: number
    videoH: number
    containerW: number
    containerH: number
  }) {
    const { videoW, videoH, containerW, containerH } = size
    if (!this.player.value) return
    // 按高缩放后视频的宽
    const scaleW =
      videoW === 0 ? containerW : Math.floor((containerH / videoH) * videoW)
    // 按宽缩放后视频的高
    const scaleH =
      videoH === 0 ? containerH : Math.floor((containerW / videoW) * videoH)
    // console.log('W:', videoW, containerW, scaleW)
    // console.log('H:', videoH, containerH, scaleH)
    const width = Math.min(scaleW, containerW)
    const height = Math.min(scaleH, containerH)
    if (this.canvasAttr.width !== width || this.canvasAttr.height !== height) {
      this.canvasAttr.width = width
      this.canvasAttr.height = height
      this.preRenderPlayer.width = width
      this.preRenderPlayer.height = height
      this.player.value.width = width
      this.player.value.height = height
    }
  }

  private clearCanvas() {
    if (this.preRenderContext === null) return
    this.preRenderContext.fillStyle = this.textOptions.bgColor
    this.preRenderContext.fillRect(
      0,
      0,
      this.canvasAttr.width,
      this.canvasAttr.height
    )
  }

  private async drawCanvas() {
    if (
      this.loading.value ||
      this.canvasAttr.width === 0 ||
      this.canvasAttr.height === 0
    )
      return
    const videoList: Array<() => Promise<boolean>> = []
    const otherList: Array<() => Promise<boolean>> = []
    this.playerState.playTargetTrackMap.forEach((trackItem: TrackItem) => {
      const type = trackItem.type
      if (type === 'video') {
        videoList.unshift(() =>
          this.drawToPreRenderCanvas(trackItem, this.playerState.playingFrame)
        )
      } else {
        otherList.unshift(() =>
          this.drawToPreRenderCanvas(trackItem, this.playerState.playingFrame)
        )
      }
    })
    this.clearCanvas()
    // 按顺序绘制，先绘制视频，保证视频在底部
    await videoList.reduce(
      (chain, nextPromise) => chain.then(() => nextPromise()),
      Promise.resolve(true)
    )
    await otherList.reduce(
      (chain, nextPromise) => chain.then(() => nextPromise()),
      Promise.resolve(true)
    )
    this.drawToPlayerCanvas()
  }

  private drawToPreRenderCanvas(
    trackItem: TrackItem,
    frameIndex: number
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const { left, top, drawW, drawH } = this.computedItemShowArea(trackItem)
      const { type, start, end, offsetL, name, format } = trackItem
      if (frameIndex > end) {
        resolve(true)
      } else if (type === 'video') {
        const { width, height } = trackItem as VideoTrackItem
        frameIndex = Math.max(frameIndex - start + offsetL, 1)
        const frameBuffer = this.ffmpeg.getFrame(name, frameIndex).buffer
        const frameBlob = new Blob([frameBuffer], { type: 'image/jpeg' })
        createImageBitmap(frameBlob).then((imageBitmap) => {
          this.preRenderContext?.drawImage(
            imageBitmap,
            0,
            0,
            width,
            height,
            left,
            top,
            drawW,
            drawH
          )
          resolve(true)
        })
      } else if (type === 'image') {
        const { width, height, sourceFrame } = trackItem as ImageTrackItem
        let frameBlob: Blob
        if (format === 'gif' && sourceFrame !== 0) {
          frameIndex = Math.max(frameIndex - start, 1)
          const showFrame = frameIndex % sourceFrame
          frameBlob = this.ffmpeg.getGifFrame(
            name,
            showFrame === 0 ? sourceFrame : showFrame
          )
        } else {
          frameBlob = this.ffmpeg.getFileBlob(
            this.ffmpeg.pathConfig.resourcePath,
            name,
            format
          )
        }

        createImageBitmap(frameBlob).then((imageBitmap) => {
          this.preRenderContext?.drawImage(
            imageBitmap,
            0,
            0,
            width,
            height,
            left,
            top,
            drawW,
            drawH
          )
          resolve(true)
        })
      } else if (type === 'text') {
        resolve(true)
      } else {
        resolve(true)
      }
    })
  }

  private drawToPlayerCanvas() {
    this.playerContext?.drawImage(
      this.preRenderPlayer,
      0,
      0,
      this.canvasAttr.width,
      this.canvasAttr.height,
      0,
      0,
      this.canvasAttr.width,
      this.canvasAttr.height
    )
  }

  private computedItemShowArea(trackItem: TrackItem) {
    const { width: canvasW, height: canvasH } = this.canvasAttr
    const { type } = trackItem
    let drawW = canvasW
    let drawH = canvasH
    if (type === 'video' || type === 'image') {
      const { width, height } = trackItem as VideoTrackItem | ImageTrackItem
      // 按高缩放后 trackItem 的宽度
      const scaleW = Math.floor((canvasH / height) * width)
      // 按宽缩放后 trackItem 的高度
      const scaleH = Math.floor((canvasW / width) * height)
      if (scaleW > canvasW) {
        drawH = scaleH
      } else if (scaleH > canvasH) {
        drawW = scaleW
      } else {
        if (type === 'image') {
          drawW = width
          drawH = height
        }
      }
    }
    const left = Math.floor((canvasW - drawW) / 2)
    const top = Math.floor((canvasH - drawH) / 2)

    return {
      left,
      top,
      drawW,
      drawH
    }
  }
}
