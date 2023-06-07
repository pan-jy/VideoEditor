<template>
  <component
    :is="componentMap[trackItem.type] as never"
    style="height: 100%"
    :trackItem="trackItem"
    draggable="true"
  />
</template>

<script setup lang="ts">
import AudioTrack from './AudioTrack.vue'
import ImageTrack from './ImageTrack.vue'
import TextTrack from './TextTrack.vue'
import VideoTrack from './VideoTrack.vue'
import { TrackItem } from '~/types/tracks'

defineProps<{
  trackItem: TrackItem
}>()

const componentMap = {
  video: VideoTrack,
  audio: AudioTrack,
  text: TextTrack,
  image: ImageTrack
}
</script>
