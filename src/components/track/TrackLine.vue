<template>
  <div
    class="track-line"
    ref="trackLineEl"
    :class="{ 'is-main': trackLine.isMian, 'is-active': isActive }"
    :style="{
      height: trackHeight[trackLine.type],
      margin: `5px 0 5px ${start}px`,
      minWidth: `calc(100% - ${start}px)`
    }"
  >
    <TrackItem
      v-for="(trackItem, index) in trackLine.list"
      :key="trackItem.id"
      :trackItemIdx="{
        lineIdx: lineIndex,
        itemIdx: index
      }"
      :trackItem="trackItem"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, watchEffect } from 'vue'
import { TrackLine } from '~/types/tracks'
import { trackHeight, trackLeftStart as start } from '~/config/tracks'
import { useTrackStore } from '~/stores/trackStore'
import { frameCountToPixel } from '~/common/utils/drawTimeLine'

const props = defineProps<{
  trackLine: TrackLine
  lineIndex: number
}>()

const trackStore = useTrackStore()
const isActive = ref(false)
watchEffect(() => {
  isActive.value = props.lineIndex === trackStore.focusedItemIdx?.lineIdx
})

const trackLineEl = ref<HTMLDivElement>()
watch(
  () => [props.trackLine.list.slice(-1)[0]?.end, trackStore.scale],
  ([end, scale]) => {
    nextTick(() => {
      if (!trackLineEl.value) return
      trackLineEl.value.style.width = `${frameCountToPixel(scale, end) + 100}px`
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
}
.is-main {
  background-color: var(--ep-color-primary-light-8);
}

.is-target-line,
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
