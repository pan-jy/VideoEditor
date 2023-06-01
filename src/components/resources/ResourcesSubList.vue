<template>
  <header>
    <span>{{ resourcesSubList.title }}</span>
  </header>
  <div
    class="item"
    v-for="item in resourcesSubList.items"
    :key="item.name"
    draggable="true"
    @dragstart="dragResources($event, item)"
  >
    <AudioItem v-if="resourcesSubList.type === 'audio'" :audioItem="item" />
    <TextItem v-else-if="resourcesSubList.type === 'text'" :textItem="item" />
    <div class="item-non-audio" v-else>
      <el-image
        class="item-non-audio-cover"
        :src="(item as VideoItem | ImageItem).cover"
      />
      <span
        class="item-non-audio-time"
        v-if="resourcesSubList.type === 'video'"
      >
        {{ formatTime((item as VideoItem).time).str }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  ResourcesSubList,
  VideoItem,
  AudioItem,
  ImageItem,
  TextItem
} from '~/types/resources'
import { formatTime } from '~/common/utils/timeFormat'

defineProps<{ resourcesSubList: ResourcesSubList }>()

async function dragResources(
  e: DragEvent,
  item: VideoItem | AudioItem | ImageItem | TextItem
) {
  e.dataTransfer?.setData(
    'fileInfo',
    JSON.stringify({
      source: item.source,
      name: item.name
    })
  )
}
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
