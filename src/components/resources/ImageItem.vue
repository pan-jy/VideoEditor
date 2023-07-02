<template>
  <el-image class="image" :src="imageItem.cover" />
</template>

<script setup lang="ts">
import { ImageItem } from '~/types/resources'

defineProps<{ imageItem: ImageItem }>()
</script>

<style lang="scss" scoped>
.image {
  width: 100%;
  border: 2px solid var(--ep-color-primary-light-9);

  &:hover {
    border-color: var(--ep-color-primary-light-3);
    transform: scale(1.02);
  }
}
</style>
