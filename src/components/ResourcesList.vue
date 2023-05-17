<template>
  <div v-for="resources in resourcesList" :key="resources.title">
    <header>
      <span>{{ resources.title }}</span>
    </header>
    <div class="item" v-for="item in resources.items" :key="item.name">
      <div class="item-non-audio" v-if="resources.type !== 'audio'">
        <el-image class="item-non-audio-cover" :src="item.cover" lazy />
        <span class="item-non-audio-time" v-if="resources.type === 'video'">
          {{ convertTime((item as VideoItem).time) }}
        </span>
      </div>
      <AudioItem v-else :audioItem="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResourcesList, VideoItem } from '~/datas/types/resources'
import convertTime from '~/composables/convertTime'

defineProps<{ resourcesList: ResourcesList }>()
</script>

<style lang="scss" scoped>
@import '~/styles/mixins.scss';

header {
  @include header;

  box-sizing: content-box;
  margin: 0 10px;
  font-size: 15px;
}

.item {
  padding: 10px 20px;
  cursor: pointer;

  &-non-audio {
    position: relative;
    max-width: 66%;

    &-cover {
      border: 2px solid var(--ep-color-primary-light-9);

      &:hover {
        border-color: var(--ep-color-primary-light-3);
        transform: scale(1.02);
      }
    }

    &-time {
      position: absolute;
      right: 6px;
      bottom: 6px;
      font-size: 15px;
      color: var(--ep-text-color-regular);
    }
  }
}
</style>
