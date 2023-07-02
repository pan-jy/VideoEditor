<template>
  <header>
    <span>{{ resourcesSubList.title }}</span>
  </header>
  <div class="item-list">
    <div
      class="item"
      :class="`${type}-item__outer`"
      v-for="item in resourcesSubList.items"
      :key="item.name"
      draggable="true"
      @dragstart="dragResources($event, item)"
    >
      <AudioItem
        v-if="type === 'audio'"
        :audioItem="item"
        @playAudio="(source:string)=>playSource = source"
        :isPlay="playSource === item.source"
      />
      <TextItem v-else-if="type === 'text'" :textItem="item" />
      <VideoItem v-else-if="type === 'video'" :videoItem="item" />
      <ImageItem v-else-if="type === 'image'" :imageItem="item" />
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
import { ref, toRaw } from 'vue'
const props = defineProps<{ resourcesSubList: ResourcesSubList }>()

const type = toRaw(props.resourcesSubList.type)

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
const playSource = ref('')
</script>

<style lang="scss" scoped>
@import '~/styles/mixins.scss';

header {
  @include header;

  box-sizing: content-box;
  margin: 0 10px;
  font-size: 15px;
}

.item-list {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
}

.item {
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
}

.video-item__outer {
  box-sizing: border-box;
  width: 48%;
  height: 72px;

  border: 2px solid var(--ep-color-primary-light-9);

  &:hover {
    border-color: var(--ep-color-primary-light-3);
    transform: scale(1.02);
  }
}

.image-item__outer {
  width: 30%;
}
</style>
