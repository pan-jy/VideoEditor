<template>
  <component
    :is="componentMap[trackItem.type] as never"
    style="height: 100%"
    :trackItem="trackItem"
    draggable="true"
    :style="{
      left: `${frameCountToPixel(trackState.scale, trackItem.start)}px`,
      width: `${frameCountToPixel(trackState.scale, trackItem.frameCount)}px`,
      opacity: isDragging ? 0.3 : 1
    }"
    @click="itemClick(trackItem)"
    @dragstart="dragItem($event)"
    @dragend="isDragging = false"
  />
</template>

<script setup lang="ts">
import AudioTrack from './trackItem/AudioTrack.vue'
import ImageTrack from './trackItem/ImageTrack.vue'
import TextTrack from './trackItem/TextTrack.vue'
import VideoTrack from './trackItem/VideoTrack.vue'
import { DraggedIdx, TrackItem } from '~/types/tracks'
import { useTrackState } from '~/stores/trackState'
import { ref } from 'vue'
import { frameCountToPixel } from '~/common/utils/drawTimeLine'

const props = defineProps<{
  trackItem: TrackItem
  draggedIdx: DraggedIdx
}>()

const trackState = useTrackState()

function itemClick(trackItem: TrackItem) {
  trackState.focusedItem = trackItem
}

const isDragging = ref(false)
function dragItem(e: DragEvent) {
  isDragging.value = true
  const { draggedLineIndex, draggedItemIndex } = props.draggedIdx
  e.dataTransfer?.setData(
    'draggedIdx',
    JSON.stringify({
      draggedLineIndex,
      draggedItemIndex
    })
  )
}

const componentMap = {
  video: VideoTrack,
  audio: AudioTrack,
  text: TextTrack,
  image: ImageTrack
}
</script>
