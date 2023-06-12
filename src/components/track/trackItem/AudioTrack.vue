<template>
  <div
    class="audio"
    v-loading="loading"
    element-loading-background="rgba(0,0,0,0.5)"
  >
    <div class="audio-title">
      <el-icon><Headset /></el-icon>
      <span>{{ trackItem.name }}.{{ trackItem.format }}</span>
    </div>
    <el-image class="audio-wave" :src="waveFileUrl" :style="waveStyle">
      <template #error>
        <div class="audio-wave-slot">Loading...</div>
      </template>
    </el-image>
  </div>
</template>

<script setup lang="ts">
import { Headset } from '@element-plus/icons-vue'
import type { FFmpegManager } from '~/common/composables/useFFmpeg'
import { computed, inject, ref, watch } from 'vue'
import { AudioTrackItem } from '~/types/tracks'
const props = defineProps<{ trackItem: AudioTrackItem }>()
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
async function initAudio() {
  const { name, file, format, frameCount, time } = props.trackItem
  if (time > 0 && ffmpeg.isLoaded()) {
    await ffmpeg.writeFile(ffmpeg.pathConfig.resourcePath, file.name, file)
    await ffmpeg.genWave(name, frameCount, format)
    waveFileUrl.value = ffmpeg.getWavePng(name)
    loading.value = false
  }
}

watch(() => [props.trackItem.time, ffmpeg.isLoaded()], initAudio, {
  immediate: true
})
</script>

<style lang="scss" scoped>
.audio {
  display: flex;
  flex-direction: column;
  background-color: var(--ep-color-primary);

  &-title {
    display: flex;
    align-items: center;
    height: 40%;
    font-size: 80%;
    line-height: 40%;
    white-space: nowrap;
    background-color: var(--ep-color-primary-light-3);

    .ep-icon {
      margin: 0 5px;
    }
  }

  &-wave {
    display: flex;
    flex: 1;
    align-items: center;
    width: 100%;

    &-slot {
      margin-left: 10px;
    }
  }
}
</style>
