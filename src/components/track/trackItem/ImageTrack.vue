<template>
  <div class="image" v-loading="loading">
    <el-image class="image-cover" :src="trackItem.source" />
    <span class="image-name">{{ trackItem.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { FFmpegManager } from '~/common/composables/useFFmpeg'
import { usePlayerState } from '~/stores/playerState'
import { useTrackState } from '~/stores/trackState'
import { ImageTrackItem } from '~/types/tracks'

const props = defineProps<{
  trackItem: ImageTrackItem
}>()

const playerState = usePlayerState()
const trackState = useTrackState()
const ffmpeg = inject('ffmpeg') as FFmpegManager
const loading = ref(true)
playerState.inLoadingCount++
async function initImage() {
  const { name, file, format, width, height } = props.trackItem
  if (name && file && ffmpeg.isLoaded()) {
    const imageName = `${name}.${format}`
    await ffmpeg.writeFile(ffmpeg.pathConfig.resourcePath, imageName, file)
    if (format === 'gif') {
      const { frameCount } = await ffmpeg.genFrame(name, format, {
        w: width,
        h: height
      })
      const trackItemIdx = trackState.getItemIdx(props.trackItem)
      if (trackItemIdx) {
        const trackItem = trackState.getTrackItem(
          trackItemIdx
        ) as ImageTrackItem
        trackItem.sourceFrame = frameCount
      }
    }
  }
  loading.value = false
  playerState.inLoadingCount--
}

watch([() => props.trackItem.name, ffmpeg.isLoaded()], initImage, {
  immediate: true
})
</script>

<style lang="scss" scoped>
.image {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1px 5px;
  font-size: 0.9rem;
  background-color: var(--ep-color-warning-light-3);

  &-cover {
    height: 1.1rem;
    margin-right: 10px;
  }

  &-name {
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
