<template>
  <div class="image">{{ trackItem.id }}</div>
</template>

<script setup lang="ts">
import { ImageTrackItem } from '~/types/tracks'
defineProps<{ trackItem: ImageTrackItem }>()
</script>

<style lang="scss" scoped>
.image {
  background-color: pinK;
}
</style>
