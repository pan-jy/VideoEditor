<template>
  <div class="video" v-loading="loading">
    <div class="video-title">
      <el-icon><VideoCamera /></el-icon>
      <span>{{ trackItem.name }}.{{ trackItem.format }}</span>
    </div>
    <div class="video-frames">
      <VideoFrame :trackItem="trackItem" :loaded="!loading" />
    </div>
    <el-image class="video-wave" :src="waveFileUrl" :style="waveStyle" />
  </div>
</template>

<script setup lang="ts">
import { VideoCamera } from '@element-plus/icons-vue'
import type { FFmpegManager } from '~/common/composables/useFFmpeg'
import { computed, inject, ref, watch } from 'vue'
import { VideoTrackItem } from '~/types/tracks'
const props = defineProps<{ trackItem: VideoTrackItem }>()

const ffmpeg = inject('ffmpeg') as FFmpegManager

const waveStyle = computed(() => {
  const { start, end, offsetL, offsetR, frameCount } = props.trackItem
  const showFrameCount = end - start
  return {
    transform: `scaleX(${(frameCount / showFrameCount).toFixed(2)})`,
    transformOrigin: 'left top',
    left: `-${(offsetL / showFrameCount) * 100}%`,
    right: `-${(offsetR / showFrameCount) * 100}%`
  }
})

const waveFileUrl = ref('')
const loading = ref(true)
async function initVideo() {
  const { name, file, format, frameCount, time, width, height } =
    props.trackItem
  if (time > 0 && ffmpeg.isLoaded()) {
    await ffmpeg.writeFile(ffmpeg.pathConfig.resourcePath, file.name, file)
    await ffmpeg.splitAudio(name, format)
    await ffmpeg.genFrame(name, format, {
      w: width,
      h: height
    })
    await ffmpeg.genWave(name, frameCount)
    waveFileUrl.value = ffmpeg.getWavePng(name)
    loading.value = false
  }
}

watch(() => [props.trackItem.time, ffmpeg.isLoaded()], initVideo, {
  immediate: true
})
</script>

<style lang="scss" scoped>
.video {
  display: flex;
  flex-direction: column;
  background-color: var(--ep-fill-color);

  &-title {
    display: flex;
    align-items: center;
    height: 25%;
    font-size: 80%;
    line-height: 25%;
    white-space: nowrap;
    background-color: var(--ep-color-primary);

    .ep-icon {
      margin: 0 5px;
    }
  }

  &-frames {
    position: relative;
    flex: 1;
  }

  &-wave {
    width: 100%;
    height: 25%;
    background-color: var(--ep-color-primary);
  }
}
</style>
