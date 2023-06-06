<template>
  <div
    class="track-list"
    ref="trackContainer"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <IconList :showList="showList" :scrollTop="scrollTop" />
    <article class="track-list-content" @wheel="zoomScale" @scroll="onScroll">
      <TimeLine :scale="trackState.scale" />
      <div class="empty-info" v-if="trackList.length === 0">
        <el-icon size="20"><Files /></el-icon>
        <span>将资源拖拽到这里，开始编辑作品吧~</span>
      </div>
      <div class="tracks" v-else>
        <TrackItem
          v-for="trackItem in showList"
          :key="trackItem.id"
          :trackItem="trackItem"
        />
        <!-- <div class="tracks-item tracks-imgAndText">
          <div
            class="track-item"
            v-for="trackItem in trackList[idxMap.image]?.list"
            :key="trackItem.id"
          >
            <ImageTrack v-if="trackItem.type === 'image'" />
            <TextTrack v-else-if="trackItem.type === 'text'" />
          </div>
        </div>
        <div class="tracks-item track-item tracks-video">video</div>
        <div class="tracks-item tracks-audio">
          <AudioTrack
            class="track-item"
            v-for="trackItem in trackList[idxMap.audio]?.list"
            :key="trackItem.id"
          />
        </div> -->
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { Files } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { fetchFile } from '~/common/utils/fetchFile'
import { useTrackState } from '~/stores/trackState'
import type { TrackItem, TrackList, TrackType } from '~/types/tracks'
import {
  ImageTrackItem,
  TextTrackItem,
  VideoTrackItem,
  AudioTrackItem,
  idxMap
} from '~/config/tracks'
import { getResourcesType } from '~/common/utils/getResourcesInfo'

const trackState = useTrackState()

const trackContainer = ref<HTMLDivElement>()
const trackList = ref<TrackList>([])
const showList = computed(() => {
  const list: Array<TrackItem> = []
  trackList.value?.forEach((item) => {
    list.push(...item.list)
  })
  return list
})

function getTrackItem(type: TrackType, file: File, e: DragEvent): TrackItem {
  if (type === 'image') return new ImageTrackItem(file, e)
  if (type === 'text') return new TextTrackItem(file, e)
  if (type === 'video') return new VideoTrackItem(file, e)
  return new AudioTrackItem(file, e)
}

async function onDrop(e: DragEvent) {
  const files = []
  // 获取拖动的文件
  const fileInfo = e.dataTransfer?.getData('fileInfo')
  if (fileInfo) {
    const fileInfoJSON = JSON.parse(fileInfo) as {
      source: string
      name: string
      type: string
    }
    files.push(await fetchFile(fileInfoJSON.source, fileInfoJSON.name))
  } else {
    // 上传的本地文件
    files.push(...(e.dataTransfer?.files ?? []))
  }
  files.forEach((file) => {
    const type = getResourcesType(file)
    if (type) {
      const idx = idxMap[type]
      const trackItem = getTrackItem(type, file, e)
      if (trackList.value[idx] === undefined) {
        trackList.value[idx] = {
          type,
          list: []
        }
      }
      trackList.value[idx].list.push(trackItem)
    }
  })
  console.log(trackList.value)
}

function zoomScale(e: WheelEvent) {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    if (e.deltaY === 0) return
    e.deltaY > 0 ? trackState.scale-- : trackState.scale++
  }
}
const scrollTop = ref(0)
function onScroll(e: UIEvent) {
  scrollTop.value = (e.target as HTMLDivElement).scrollTop
}
</script>

<style lang="scss" scoped>
.track-list {
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: hidden;

  &-content {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: auto;
  }
}
.tracks {
  display: flex;
  flex: 1;
  flex-direction: column;
  /* display: grid;
  grid-template-rows: 1fr 3rem 1fr;

  &-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
  }
  .track-item {
    margin: 5px 0;
  }
  &-imgAndText {
    display: flex;
    flex-direction: column;
    grid-row: 1/2;
    justify-content: flex-end;
  }
  &-video {
    width: 100%;
    height: 3rem;
    background-color: var(--ep-color-primary-light-8);
    grid-row: 2/3;
  }
  &-audio {
    grid-row: 3/4;
  } */
}
.empty-info {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
  height: 40%;
  margin: auto;
  font-size: 1rem;
  background-color: var(--ep-fill-color);
  border: 2px solid var(--ep-border-color);
  border-radius: 10px;

  i {
    margin-right: 20px;
    transform: translateY(2px);
  }

  &:hover {
    border: 2px dashed var(--ep-color-primary);
  }
}
</style>
