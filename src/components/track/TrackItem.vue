<template>
  <component
    :is="componentMap.get(trackItem.type) as never"
    :style="{ height: trackHeight[trackItem.type] }"
    style="margin: 5px 0"
  />
</template>

<script setup lang="ts">
import AudioTrack from './AudioTrack.vue'
import ImageTrack from './ImageTrack.vue'
import TextTrack from './TextTrack.vue'
import VideoTrack from './VideoTrack.vue'
import { TrackItem } from '~/types/tracks'
import { trackHeight } from '~/config/tracks'

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
