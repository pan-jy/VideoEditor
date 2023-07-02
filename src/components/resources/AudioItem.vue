<template>
  <div class="audio-item">
    <el-image class="audio-item-cover" :src="audioItem.cover" lazy />
    <el-icon size="40" class="play-icon">
      <VideoPause @click="pauseAudio" v-if="isPlay" />
      <VideoPlay @click="playAudio" v-else />
    </el-icon>
    <main class="audio-item-info">
      <TextLine :content="audioItem.name" />
      <TextLine class="info-singer" :content="audioItem.singer" />
      <span class="info-time">{{ formatTime(duration * 1000).str }}</span>
    </main>
  </div>
  <div v-show="isPlay" class="control">
    <audio ref="audio" :src="audioItem.source" />
    <el-slider
      class="progress"
      v-model="currentTime"
      :max="duration"
      :show-tooltip="false"
      @change="slideTime"
    />
    <div class="time">
      <span class="time__cur">{{ formatTime(currentTime * 1000).str }}</span>
      <span class="time-slash">/</span>
      <span class="time__all">{{ formatTime(duration * 1000).str }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AudioItem } from '~/types/resources'
import { VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { formatTime } from '~/common/utils/timeFormat'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{ audioItem: AudioItem; isPlay: boolean }>()
const emits = defineEmits(['playAudio'])
const audio = ref<HTMLAudioElement>()
const duration = ref(0)
const currentTime = ref(0)
onMounted(() => {
  audio.value?.addEventListener('loadeddata', () => {
    duration.value = Math.floor(audio.value?.duration ?? 0)
    audio.value?.addEventListener('timeupdate', (e) => {
      currentTime.value = Math.floor((e.target as HTMLAudioElement).currentTime)
    })
  })
})

function slideTime(val: number) {
  if (!audio.value) return
  audio.value.currentTime = val
}

const playAudio = () => {
  emits('playAudio', props.audioItem.source)
}

const pauseAudio = () => {
  emits('playAudio', '')
}

watch(
  () => props.isPlay,
  (isPlay) => {
    isPlay ? audio.value?.play() : audio.value?.pause()
  }
)
</script>

<style lang="scss" scoped>
.audio-item {
  $item-height: 80px;

  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: $item-height;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 5px;
  transition: border 0.3s ease;

  &-cover {
    width: $item-height;
    border-radius: 5px;
  }

  &-info {
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;
    padding: 3px 0;
    margin: 0px 15px;
    overflow: hidden;
    font-size: 15px;
  }
  .play-icon {
    position: absolute;
    left: calc($item-height / 2);
    display: none;
    opacity: 0.7;
    transform: translateX(-50%);
  }

  &:hover {
    border-color: var(--ep-color-primary-light-7);
  }
  &:hover &-cover {
    opacity: 0.5;
  }
  &:hover .play-icon {
    display: block;
  }
}

.info-singer {
  font-size: 14px;
  color: var(--ep-text-color-placeholder);
}

.info-time {
  font-size: 13px;
}

.control {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .time {
    padding-left: 10px;
    font-size: 14px;

    &-slash {
      margin: 0 5px;
    }

    &__cur {
      color: var(--ep-color-primary);
    }
  }
}
</style>
