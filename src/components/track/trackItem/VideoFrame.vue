<template>
  <div ref="framesContainer" class="framesContainer">
    <canvas ref="frames" />
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { FFmpegManager } from '~/common/composables/useFFmpeg'
import { VideoTrackItem } from '~/config/tracks'
import { useDebounceFn } from '@vueuse/core'
import { useTrackStore } from '~/stores/trackStore'

const props = defineProps<{ trackItem: VideoTrackItem; loaded: boolean }>()

const trackStore = useTrackStore()

const ffmpeg = inject('ffmpeg') as FFmpegManager

const framesContainer = ref<HTMLDivElement>()
const frames = ref<HTMLCanvasElement>()
const worker = new Worker('src/common/workers/drawFrames')

onMounted(() => {
  if (!frames.value) return
  const canvas = frames.value.transferControlToOffscreen()
  worker.postMessage({ action: 'init', canvas }, [canvas])
})
onUnmounted(() => {
  worker.terminate()
})

watch(
  () => props.loaded,
  (loaded) => {
    if (loaded) {
      const buffers: Array<ArrayBuffer> = []
      const videoName = props.trackItem.name
      for (let i = 1; i <= props.trackItem.frameCount; i++) {
        buffers.push(ffmpeg.getFrame(videoName, i).buffer)
      }
      worker.postMessage({ action: 'setBuffers', buffers }, [...buffers])
    }
  },
  {
    immediate: true
  }
)

watch(
  () => [props.trackItem, props.loaded, trackStore.scale],
  useDebounceFn(
    () => {
      if (!framesContainer.value) return
      const { width, height } = framesContainer.value.getBoundingClientRect()
      const {
        start,
        end,
        width: videoW,
        height: videoH,
        offsetL
      } = props.trackItem
      worker.postMessage({
        action: 'setConfig',
        canvasAttr: { width, height },
        videoTrackInfo: {
          start,
          end,
          videoW,
          videoH,
          offsetL
        }
      })
    },
    300,
    { maxWait: 1000 }
  ),
  {
    deep: true
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
