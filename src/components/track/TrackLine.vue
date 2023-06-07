<template>
  <div
    class="track-line"
    :style="{
      height: trackHeight[trackLine.type],
      backgroundColor: trackLine.isMian
        ? 'var(--ep-color-primary-light-8)'
        : '',
      margin: `5px 0 5px ${start}px`
    }"
  >
    <TrackItem
      class="track-item"
      v-for="trackItem in trackLine.list"
      :key="trackItem.id"
      el-name="TrackItem"
      :trackItem="trackItem"
      :style="{
        left: `${trackItem.start - start}px`,
        width: `${trackItem.end - trackItem.start}px`
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { TrackLine } from '~/types/tracks'
import { trackHeight, trackLeftStart as start } from '~/config/tracks'

defineProps<{
  trackLine: TrackLine
}>()
</script>

<style lang="scss" scoped>
.track-line {
  position: relative;
  display: flex;
  width: 100%;
}
.track-item {
  position: absolute;
  overflow: hidden;
  border-radius: 0.25rem;
}
</style>
