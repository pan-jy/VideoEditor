<template>
  <div
    class="track-line"
    ref="trackLineEl"
    :class="{ 'is-main': trackLine.isMian, 'is-active': isActive }"
    :style="{
      height: trackHeight[trackLine.type],
      margin: `5px 0 5px ${start}px`
    }"
  >
    <TrackItem
      class="track-item"
      v-for="(trackItem, index) in trackLine.list"
      :key="trackItem.id"
      :draggedIdx="{
        draggedLineIndex: lineIndex,
        draggedItemIndex: index
      }"
      :trackItem="trackItem"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { TrackLine } from '~/types/tracks'
import { trackHeight, trackLeftStart as start } from '~/config/tracks'
import { useTrackState } from '~/stores/trackState'
import { frameCountToPixel } from '~/common/utils/drawTimeLine'

const props = defineProps<{
  trackLine: TrackLine
  isActive: boolean
  lineIndex: number
}>()

const trackState = useTrackState()
const trackLineEl = ref<HTMLDivElement>()
watch(
  () => [props.trackLine.list.slice(-1)[0]?.end, trackState.scale],
  ([end, scale]) => {
    nextTick(() => {
      if (!trackLineEl.value) return
      trackLineEl.value.style.width = `${frameCountToPixel(scale, end)}px`
    })
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.track-line {
  position: relative;
  display: flex;
  min-width: 100%;
}
.track-item {
  position: absolute;
  overflow: hidden;
  border-radius: 0.25rem;
}

.is-main {
  background-color: var(--ep-color-primary-light-8);
}

.is-active {
  background-color: var(--ep-fill-color-dark);
}

.info-line-top::before,
.info-line-bottom::after {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 1px;
  content: '';
  background-color: var(--ep-color-warning);
}

.info-line-top::before {
  top: 0;
}
.info-line-bottom::after {
  bottom: 0;
}
</style>
