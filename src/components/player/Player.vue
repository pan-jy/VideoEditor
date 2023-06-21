<template>
  <div
    class="player"
    ref="playerContainer"
    v-loading="renderPlayer.loading.value"
  >
    <canvas ref="playerCanvas" class="player-canvas" />
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { FFmpegManager } from '~/common/composables/useFFmpeg'
// import { usePlayerState } from '~/stores/playerState'
import { RenderPlayer } from './renderPlayer'
import { useElementSize } from '@vueuse/core'

const playerContainer = ref<HTMLDivElement>()
const containerSize = useElementSize(playerContainer)

const playerCanvas = ref<HTMLCanvasElement>()
// const playerState = usePlayerState()
const ffmpeg = inject('ffmpeg') as FFmpegManager
const renderPlayer = new RenderPlayer(playerCanvas, ffmpeg, containerSize)
</script>

<style lang="scss" scoped>
.player {
  // background-color: rgb(0, 204, 255);
  display: flex;
  align-items: center;
  justify-content: center;

  &-canvas {
    width: 96%;
    height: 96%;
  }
}
</style>
