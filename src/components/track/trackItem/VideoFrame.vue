<template>
  <div ref="framesContainer" class="framesContainer">
    <canvas v-bind="canvasAttr" ref="frames" />
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { FFmpegManager } from '~/common/composables/useFFmpeg'
import { VideoTrackItem } from '~/config/tracks'
import { useTrackState } from '~/stores/trackState'

const props = defineProps<{ trackItem: VideoTrackItem; loaded: boolean }>()
const trackState = useTrackState()

const ffmpeg = inject('ffmpeg') as FFmpegManager

const framesContainer = ref<HTMLDivElement>()
const frames = ref<HTMLCanvasElement>()
let canvasContext = {} as CanvasRenderingContext2D

const canvasAttr = reactive({
  width: 0,
  height: 0
})

const framesInfo = reactive({
  width: 0,
  height: 0,
  frameCount: 0,
  maxFrame: 1
})

function drawBitmap(imageBitmap: ImageBitmap, drawIndex = 0, margin = 0) {
  const { width: containerWidth } = canvasAttr
  const { width, height, maxFrame } = framesInfo
  const { width: imageW, height: imageH } = props.trackItem
  const left =
    drawIndex === maxFrame - 1
      ? containerWidth - width
      : drawIndex * (width + margin)
  canvasContext.drawImage(
    imageBitmap,
    0,
    0,
    imageW,
    imageH,
    left,
    0,
    width,
    height
  )
}

function drawFrames() {
  if (props.trackItem.frameCount > 0 && props.loaded && ffmpeg.isLoaded()) {
    const { width: containerWidth } = canvasAttr
    const { width, frameCount, maxFrame } = framesInfo
    const frameStep = Math.max(maxFrame - 1, 1) // 帧间距数，最小为1帧
    const renderSpace = Math.max(Math.floor(frameCount / frameStep), 1) // 间隔多少帧渲染一次
    let overFrame = Math.floor(frameCount - 1 - renderSpace * frameStep) // 不能整除时溢出帧数
    let offset = Math.max(containerWidth - Math.floor(maxFrame * width), 0) // 不够撑满canvas宽度的情况
    let marginSpace = Math.max(Math.round(offset / frameStep), 0) // 帧数不够填满容器时的间距
    let frameIndex = props.trackItem.offsetL + 1 // 开始下标
    for (let i = 0; i < maxFrame; i++) {
      const frameBlob = ffmpeg.getFrame(props.trackItem.name, frameIndex)
      ;((index, margin) => {
        createImageBitmap(frameBlob).then((imageBitmap) => {
          drawBitmap(imageBitmap, index, margin)
        })
      })(i, marginSpace)
      frameIndex = Math.min(frameIndex + renderSpace, frameCount)
      if (overFrame > 0) {
        frameIndex += 1
        overFrame--
      }
    }
  }
}

function setCanvasContext() {
  if (!frames.value) return
  canvasContext = frames.value.getContext('2d') as CanvasRenderingContext2D
}

function setCanvasRect() {
  if (!framesContainer.value) return
  const { width, height } = framesContainer.value.getBoundingClientRect()
  const { start, end, width: videoW, height: videoH } = props.trackItem
  const frameW = Math.ceil(videoW / (videoH / height))
  const frameCount = end - start
  const maxFrame = Math.min(Math.ceil(width / frameW), frameCount)
  Object.assign(canvasAttr, { width, height })
  Object.assign(framesInfo, { height, width: frameW, frameCount, maxFrame })
  drawFrames()
}

onMounted(() => {
  setCanvasContext()
})
watch(
  () => [props.trackItem, props.loaded, trackState.scale],
  () => {
    nextTick(setCanvasRect)
  },
  {
    immediate: true,
    flush: 'post'
  }
)
</script>

<style lang="scss" scoped>
.framesContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
