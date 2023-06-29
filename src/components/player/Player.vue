<template>
  <div class="player" ref="playerContainer" v-loading="showLoading">
    <canvas ref="playerCanvas" class="player-canvas" />
    <el-icon
      class="player__empty"
      v-show="playerState.frameCount === 0 || !playerState.existVideo"
    >
      <VideoCameraFilled />
    </el-icon>
    <audio ref="playerAudio" src="" />
  </div>
</template>

<script setup lang="ts">
import { VideoCameraFilled } from '@element-plus/icons-vue'
import { computed, inject, reactive, ref, watch, watchPostEffect } from 'vue'
import { FFmpegManager } from '~/common/composables/useFFmpeg'
import { usePlayerState } from '~/stores/playerState'
import { RenderPlayer } from './renderPlayer'
import { useElementSize, useDebounceFn } from '@vueuse/core'

const playerContainer = ref<HTMLDivElement>()
const containerSize = useElementSize(playerContainer)

const playerCanvas = ref<HTMLCanvasElement>()
const playerState = usePlayerState()
const ffmpeg = inject('ffmpeg') as FFmpegManager
const renderPlayer = new RenderPlayer(playerCanvas, ffmpeg, containerSize)

const playerAudio = ref<HTMLAudioElement>()

const audioInfo = reactive({
  start: -1,
  end: -1
})
const audioLoading = ref(false)
function setTime(playingFrame: number) {
  if (!playerAudio.value) return
  const audioTime = Math.max((playingFrame - audioInfo.start) / 30, 0)
  playerAudio.value.currentTime = audioTime
}

const getAudio = useDebounceFn(async () => {
  if (!playerAudio.value) return
  audioLoading.value = true

  const { start, end, audioUrl } = await ffmpeg.getAudio(
    playerState.audioPlayData
  )

  audioInfo.start = start
  audioInfo.end = end
  playerAudio.value.src = audioUrl
  setTime(playerState.playingFrame)
  audioLoading.value = false
}, 500)

function initAudio() {
  if (
    playerAudio.value &&
    ffmpeg.isLoaded() &&
    playerState.inLoadingCount === 0 &&
    !renderPlayer.loading.value
  ) {
    if (playerState.audioPlayData.length > 0) {
      getAudio()
    } else {
      playerAudio.value.src = ''
    }
  }
}

watchPostEffect(initAudio)

watch(
  () => playerState.isPause,
  (isPause) => {
    if (isPause) {
      playerAudio.value?.pause()
    } else {
      playerAudio.value?.play()
    }
  }
)

watch(
  () => playerState.playingFrame,
  (playingFrame, oldFrame) => {
    if (playingFrame - oldFrame == 1) return
    setTime(playingFrame)
  }
)

const showLoading = computed(() => {
  return renderPlayer.loading.value || audioLoading.value
})
</script>

<style lang="scss" scoped>
.player {
  position: relative;
  // background-color: rgb(0, 204, 255);
  display: flex;
  align-items: center;
  justify-content: center;

  &__empty {
    position: absolute;
    font-size: 10rem;
  }
}
</style>
