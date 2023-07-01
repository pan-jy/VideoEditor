<template>
  <div class="control">
    <span class="control-time">
      <span class="control-time__play">{{ playTime }}</span>
      / {{ allTime }}
    </span>
    <el-button
      @click="playControl(playerStore.isPause)"
      class="control-btn"
      :icon="playerStore.isPause ? VideoPlay : VideoPause"
    />
  </div>
</template>

<script setup lang="ts">
import { VideoPause, VideoPlay } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { formatPlayerTime } from '~/common/utils/timeFormat'
import { usePlayerStore } from '~/stores/playerStore'

const playerStore = usePlayerStore()
const playTime = computed(() => {
  return formatPlayerTime(playerStore.playingFrame)
})

const allTime = computed(() => {
  return formatPlayerTime(
    playerStore.frameCount < 0 ? 0 : playerStore.frameCount
  )
})

let playTimer: unknown
const timerStep = 1000 / 30

const pauseVideo = () => {
  playerStore.isPause = true
  clearInterval(playTimer as number)
}

const startVideo = () => {
  if (playerStore.playingFrame >= playerStore.frameCount)
    playerStore.playingFrame = 0
  playerStore.isPause = false
  playTimer = setInterval(() => {
    playerStore.playingFrame++
    if (playerStore.playingFrame === playerStore.frameCount) {
      pauseVideo()
    }
  }, timerStep)
}

function playControl(isPause: boolean) {
  if (playerStore.frameCount <= 0) return
  if (isPause) {
    startVideo()
  } else {
    pauseVideo()
  }
}
</script>

<style lang="scss" scoped>
.control {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;

  &-time {
    font-size: 13px;
    &__play {
      color: var(--ep-color-primary);
    }
  }

  &-btn {
    position: absolute;
    left: 50%;
    font-size: 28px;
    background-color: transparent;
    border: none;
    transform: translateX(-50%);
  }
}
</style>
