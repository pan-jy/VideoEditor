<template>
  <div
    class="track-item"
    :style="{
      left: `${left}px`,
      width: `${width}px`,
      opacity: isDragging ? 0.3 : 1
    }"
    @click.stop="itemClick"
  >
    <div
      class="left-handler"
      @mousedown="mouseDowm('left')"
      v-if="showHandler"
    />
    <component
      class="track-item-content"
      :class="{ 'show-border': showHandler }"
      :is="componentMap[trackItem.type]"
      :trackItem="trackItem"
      draggable="true"
      @dragstart="dragItem"
      @dragend="dragEnd"
    />
    <div
      class="right-handler"
      v-if="showHandler"
      @mousedown="mouseDowm('right')"
    />
  </div>
</template>

<script setup lang="ts">
import AudioTrack from './trackItem/AudioTrack.vue'
import ImageTrack from './trackItem/ImageTrack.vue'
import TextTrack from './trackItem/TextTrack.vue'
import VideoTrack from './trackItem/VideoTrack.vue'
import { TrackItemIdx, TrackItem, TrackType } from '~/types/tracks'
import { useTrackState } from '~/stores/trackState'
import { computed, ref, watchEffect } from 'vue'
import {
  frameCountToPixel,
  pixelToFrameCount
} from '~/common/utils/drawTimeLine'

const props = defineProps<{
  trackItem: TrackItem
  trackItemIdx: TrackItemIdx
}>()

const trackState = useTrackState()

const left = ref()
const width = ref()
watchEffect(() => {
  left.value = frameCountToPixel(trackState.scale, props.trackItem.start)
  width.value = frameCountToPixel(trackState.scale, props.trackItem.frameCount)
})

const showHandler = computed(() => {
  return props.trackItem.id === trackState.focusedItem?.id
})

function mouseDowm(type: 'left' | 'right') {
  function resizeTrackItem(e: MouseEvent) {
    if (trackState.focusedItem && e.button === 0 && e.buttons === 1) {
      const scale = trackState.scale
      const targetList = trackState.trackList[props.trackItemIdx.lineIdx].list
      const targetItem = trackState.focusedItem
      const diff = pixelToFrameCount(scale, e.movementX)
      if (type === 'left') {
        const preItem = targetList[props.trackItemIdx.itemIdx - 1] as
          | TrackItem
          | undefined
        const newStart = targetItem.start + diff
        const newFrameCount = targetItem.frameCount - diff
        if (newStart > (preItem?.end ?? 0) && newFrameCount > 10) {
          targetItem.start = newStart
          targetItem.frameCount = newFrameCount
        }
      } else {
        const nextItem = targetList[props.trackItemIdx.itemIdx + 1] as
          | TrackItem
          | undefined
        const newFrameCount = targetItem.frameCount + diff
        const newEnd = targetItem.end + diff
        if (newFrameCount > 10 && (!nextItem || newEnd < nextItem.start)) {
          targetItem.frameCount = newFrameCount
          targetItem.end = newEnd
        }
      }
    }
  }
  document.addEventListener('mousemove', resizeTrackItem)
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', resizeTrackItem)
  })
}

function itemClick() {
  trackState.focusedItem = props.trackItem
}

const isDragging = ref(false)
function dragItem(e: DragEvent) {
  trackState.focusedItem = undefined
  isDragging.value = true
  const { lineIdx, itemIdx } = props.trackItemIdx
  e.dataTransfer?.setData(
    'trackItemIdx',
    JSON.stringify({
      lineIdx,
      itemIdx
    })
  )
}
function dragEnd() {
  isDragging.value = false
  trackState.focusedItem = props.trackItem
}

const componentMap: { [K in TrackType]: never } = {
  video: VideoTrack as never,
  audio: AudioTrack as never,
  text: TextTrack as never,
  image: ImageTrack as never
}
</script>

<style lang="scss" scoped>
.track-item {
  position: absolute;
  height: 100%;

  &-content {
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    cursor: grab;
    border-radius: 0.3rem;
  }

  .show-border {
    border-top: 1px solid var(--ep-text-color-primary);
    border-bottom: 1px solid var(--ep-text-color-primary);
    border-radius: 0;
  }
}

.left-handler,
.right-handler {
  position: absolute;
  top: 0;
  z-index: 99;
  width: 0.5rem;
  height: 100%;
  cursor: col-resize;
  background-color: var(--ep-text-color-primary);

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 30%;
    content: '';
    background: var(--ep-border-color-darker);
    border-radius: 10px;
    transform: translate(-50%, -50%);
  }
}

.left-handler {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  transform: translateX(-100%);
}

.right-handler {
  right: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  transform: translateX(100%);
}
</style>
