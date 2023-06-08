<template>
  <div
    class="track-line"
    :class="{ 'is-main': trackLine.isMian, 'is-active': isActive }"
    :style="{
      height: trackHeight[trackLine.type],
      margin: `5px 0 5px ${start}px`
    }"
  >
    <TrackItem
      class="track-item"
      v-for="trackItem in trackLine.list"
      :key="trackItem.id"
      el-name="TrackItem"
      :trackItem="trackItem"
    />
  </div>
</template>

<script setup lang="ts">
import { TrackLine } from '~/types/tracks'
import { trackHeight, trackLeftStart as start } from '~/config/tracks'

defineProps<{
  trackLine: TrackLine
  isActive: boolean
}>()
</script>

<style lang="scss" scoped>
.track-line {
  position: relative;
  display: flex;
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
  width: 10000%;
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
