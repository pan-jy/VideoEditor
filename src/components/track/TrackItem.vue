<template>
  <component
    :is="componentMap[trackItem.type] as never"
    style="height: 100%"
    :trackItem="trackItem"
    draggable="true"
    :style="{
      left: `${trackItem.start}px`,
      width: `${trackItem.end - trackItem.start}px`
    }"
    @click="itemClick(trackItem)"
  />
</template>

<script setup lang="ts">
import AudioTrack from './trackItem/AudioTrack.vue'
import ImageTrack from './trackItem/ImageTrack.vue'
import TextTrack from './trackItem/TextTrack.vue'
import VideoTrack from './trackItem/VideoTrack.vue'
import { TrackItem } from '~/types/tracks'
import { useTrackState } from '~/stores/trackState'

defineProps<{
  trackItem: TrackItem
}>()

const trackState = useTrackState()

function itemClick(trackItem: TrackItem) {
  trackState.focusedItem = trackItem
}

const componentMap = {
  video: VideoTrack,
  audio: AudioTrack,
  text: TextTrack,
  image: ImageTrack
}
</script>
