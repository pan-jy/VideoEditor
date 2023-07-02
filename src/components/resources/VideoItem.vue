<template>
  <div class="video-item">
    <el-image class="video-item-cover" :src="videoItem.cover" />
    <span class="video-item-time">
      {{ formatTime(videoItem.time).str }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { VideoItem } from '~/types/resources'
import { formatTime } from '~/common/utils/timeFormat'

defineProps<{ videoItem: VideoItem }>()
</script>

<style lang="scss" scoped>
.video-item {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--ep-color-primary-light-9);

  &-cover {
    height: 100%;
  }

  &-time {
    position: absolute;
    right: 6px;
    bottom: 6px;
    font-size: 15px;
    color: var(--ep-text-color-regular);
  }
}
</style>
