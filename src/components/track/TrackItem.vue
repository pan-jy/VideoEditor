<script setup lang="ts">
import AudioTrack from './AudioTrack.vue'
import ImageTrack from './ImageTrack.vue'
import TextTrack from './TextTrack.vue'
import VideoTrack from './VideoTrack.vue'
import { TrackItem } from '~/types/tracks'

defineProps<{
  trackItem: TrackItem
}>()

const componentMap = new Map([
  ['video', VideoTrack],
  ['audio', AudioTrack],
  ['text', TextTrack],
  ['image', ImageTrack]
])
</script>

<template>
  <component
    :is="componentMap.get(trackItem.type) as never"
    style="width: 3000px; margin: 10px 0"
  />
</template>
