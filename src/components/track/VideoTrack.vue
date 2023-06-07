<template>
  <div class="video">{{ trackItem.id }}</div>
</template>

<script setup lang="ts">
import { VideoTrackItem } from '~/types/tracks'
defineProps<{ trackItem: VideoTrackItem }>()
</script>

<style lang="scss" scoped>
.video {
  background-color: lawngreen;
}
</style>
