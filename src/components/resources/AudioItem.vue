<template>
  <div class="audio-item">
    <el-image class="audio-item-cover" :src="audioItem.cover" lazy />
    <el-icon size="40" class="play-icon"><VideoPlay /></el-icon>
    <main class="audio-item-info">
      <span class="info-name">{{ audioItem.name }}</span>
      <span class="info-singer">{{ audioItem.singer }}</span>
      <span class="info-time">{{ formatTime(audioItem.time).str }}</span>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { AudioItem } from '~/types/resources'
import { VideoPlay } from '@element-plus/icons-vue'
import { formatTime } from '~/common/utils/timeFormat'

defineProps<{ audioItem: AudioItem }>()
</script>

<style lang="scss" scoped>
.audio-item {
  $item-height: 80px;

  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: $item-height;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 5px;
  transition: border 0.3s ease;

  &-cover {
    width: $item-height;
    border-radius: 5px;
  }

  &-info {
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;
    padding: 3px 0;
    margin: 0px 15px;
    overflow: hidden;
    font-size: 15px;
  }
  .play-icon {
    position: absolute;
    left: calc($item-height / 2);
    display: none;
    opacity: 0.7;
    transform: translateX(-50%);
  }

  &:hover {
    border-color: var(--ep-color-primary-light-7);
  }
  &:hover &-cover {
    opacity: 0.5;
  }
  &:hover .play-icon {
    display: block;
  }
}

.info {
  &-name,
  &-singer {
    white-space: nowrap;
  }

  &-singer {
    font-size: 14px;
    color: var(--ep-text-color-placeholder);
  }

  &-time {
    font-size: 13px;
  }
}
</style>
