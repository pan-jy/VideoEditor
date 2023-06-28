<template>
  <div class="control">
    <span class="control-time">
      <span class="control-time__play">{{ playTime }}</span>
      / {{ allTime }}
    </span>
    <el-button
      @click="playControl(playerState.isPause)"
      class="control-btn"
      :icon="playerState.isPause ? VideoPlay : VideoPause"
    />
  </div>
</template>

<script setup lang="ts">
import { VideoPause, VideoPlay } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { formatPlayerTime } from '~/common/utils/timeFormat'
import { usePlayerState } from '~/stores/playerState'

const playerState = usePlayerState()
const playTime = computed(() => {
  return formatPlayerTime(playerState.playingFrame)
})

const allTime = computed(() => {
  return formatPlayerTime(
    playerState.frameCount < 0 ? 0 : playerState.frameCount
  )
})

let playTimer: unknown
const timerStep = 1000 / 30

const pauseVideo = () => {
  playerState.isPause = true
  clearInterval(playTimer as number)
}

const startVideo = () => {
  if (playerState.playingFrame >= playerState.frameCount)
    playerState.playingFrame = 0
  playerState.isPause = false
  playTimer = setInterval(() => {
    playerState.playingFrame++
    if (playerState.playingFrame === playerState.frameCount) {
      pauseVideo()
    }
  }, timerStep)
}

function playControl(isPause: boolean) {
  if (playerState.frameCount <= 0) return
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
