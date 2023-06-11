<template>
  <div class="video">
    <span>{{ trackItem.id }}</span>
    <div style="position: relative; left: 30px">
      <span>111</span>
      <span>222</span>
    </div>
    <div>333</div>
  </div>
</template>

<script setup lang="ts">
import { VideoTrackItem } from '~/types/tracks'
defineProps<{ trackItem: VideoTrackItem }>()
</script>

<style lang="scss" scoped>
.video {
  background-color: rgb(98, 99, 98);
}
</style>
