<template>
  <div class="audio">{{ trackItem.id }}</div>
</template>

<script setup lang="ts">
import { AudioTrackItem } from '~/types/tracks'
defineProps<{ trackItem: AudioTrackItem }>()
</script>

<style lang="scss" scoped>
.audio {
  background-color: skyblue;
}
</style>
