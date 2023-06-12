<template>
  <div class="image">
    <el-image class="image-cover" :src="trackItem.source" />
    <span class="image-name">{{ trackItem.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { ImageTrackItem } from '~/types/tracks'
defineProps<{ trackItem: ImageTrackItem }>()
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
