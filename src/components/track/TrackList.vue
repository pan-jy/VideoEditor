<template>
  <div class="track-list">
    <IconList :trackList="trackList" :scrollTop="scrollVal.scrollTop" />
    <article
      class="track-list-content"
      @dragover.prevent="onDragOverTrackList"
      @drop.prevent="onDrop"
      @wheel="zoomScale"
      @scroll="onScroll"
      @dragleave="isDragging = false"
      @click="trackStore.focusedItem = undefined"
    >
      <TimeLine
        :scale="trackStore.scale"
        :start="scrollVal.scrollLeft - trackLeftStart"
        :focusPosition="{
          start: trackStore.focusedItem?.start,
          end: trackStore.focusedItem?.end
        }"
      />
      <div
        v-show="trackList.length > 0"
        class="timing-line"
        :style="{
          left: `${
            frameCountToPixel(trackStore.scale, playerStore.playingFrame) +
            trackLeftStart
          }px`,
          top: `${scrollVal.scrollTop}px`
        }"
      />
      <div class="empty-info" v-if="trackList.length === 0">
        <el-icon size="20"><Files /></el-icon>
        <span>将资源拖拽到这里，开始编辑作品吧~</span>
      </div>
      <div class="tracks" v-else>
        <TrackLine
          v-for="(trackLine, index) in trackList"
          :key="index"
          :lineIndex="index"
          :trackLine="trackLine"
          @dragover.prevent="onDragOverTrackLine($event, index)"
          :class="{
            'info-line-top':
              isDragging &&
              infoLineIndex !== undefined &&
              Math.floor(infoLineIndex / 3) === index &&
              infoLineIndex % 3 === 0,
            'info-line-bottom':
              isDragging &&
              infoLineIndex !== undefined &&
              Math.floor(infoLineIndex / 3) === index &&
              infoLineIndex % 3 === 2,
            'is-target-line':
              isDragging &&
              infoLineIndex !== undefined &&
              Math.floor(infoLineIndex / 3) === index &&
              infoLineIndex % 3 === 1
          }"
        />
        <div
          v-show="isDragging"
          class="info-line-left"
          :style="{
            left: `${offsetX + trackLeftStart}px`,
            top: `${scrollVal.scrollTop}px`
          }"
        />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { Files } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { getFile } from '~/common/utils/fetchFile'
import { useTrackStore } from '~/stores/trackStore'
import { getOffsetX } from '~/common/utils/getTrackElInfo'
import { getResourcesType } from '~/common/utils/getResourcesInfo'
import { useThrottleFn } from '@vueuse/core'
import {
  ImageTrackItem,
  TextTrackItem,
  VideoTrackItem,
  AudioTrackItem,
  trackLeftStart
} from '~/config/tracks'
import { TrackItem, TrackItemIdx } from '~/types/tracks'
import { frameCountToPixel } from '~/common/utils/drawTimeLine'
import { usePlayerStore } from '~/stores/playerStore'
import { useAttrStore } from '~/stores/attrStore'
import { AudioAttr, ImageAttr, TextAttr, VideoAttr } from '~/types/attributes'

const trackStore = useTrackStore()
const playerStore = usePlayerStore()
const attrStore = useAttrStore()
const trackList = trackStore.trackList
// 处理缩放事件
function zoomScale(e: WheelEvent) {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    if (e.deltaY === 0) return
    e.deltaY > 0 ? trackStore.scale-- : trackStore.scale++
  }
}
// 处理滚动事件
const scrollVal = reactive({
  scrollTop: 0,
  scrollLeft: 0
})
function onScroll(e: UIEvent) {
  const target = e.target as HTMLDivElement
  scrollVal.scrollTop = target.scrollTop
  scrollVal.scrollLeft = target.scrollLeft
}

// 是否在拖拽中
const isDragging = ref(false)
// 鼠标横向偏移量
const offsetX = ref(0)
const onDragOverTrackList = useThrottleFn((e: DragEvent) => {
  isDragging.value = true
  offsetX.value = getOffsetX(e, trackStore.dragOffsetX)
}, 30)

// 待插入的 trackLine 的 index
const infoLineIndex = ref<number | undefined>(undefined)
enum InfoLine {
  top,
  target,
  bottom
}
const lineIndex = ref<number | undefined>(undefined)
const onDragOverTrackLine = useThrottleFn((e: DragEvent, index: number) => {
  console.log(trackStore.draggingItem)
  const target = e.target as HTMLElement
  const lineHeight = target.offsetHeight
  const top = e.offsetY
  const interval = lineHeight / 3
  if (top >= 0 && top < interval) {
    infoLineIndex.value = index * 3 + InfoLine.top
  } else if (top >= interval && top <= lineHeight - interval) {
    infoLineIndex.value = index * 3 + InfoLine.target
  } else {
    infoLineIndex.value = index * 3 + InfoLine.bottom
  }
  lineIndex.value = index
}, 30)

/**
 * 获取拖拽的文件
 * @param e 拖拽事件回调
 */
async function getDraggedFiles(e: DragEvent) {
  const files: File[] = []
  // 获取拖动的文件
  const fileInfo = e.dataTransfer?.getData('fileInfo')
  if (fileInfo) {
    const fileInfoJSON = JSON.parse(fileInfo) as {
      source: string
      name: string
    }
    files.push(await getFile(fileInfoJSON.source, fileInfoJSON.name))
  } else {
    // 上传的本地文件
    files.push(...(e.dataTransfer?.files ?? []))
  }
  return files
}
/**
 * 将文件转为对应的对象
 * @param type 文件类型
 * @param file 文件
 * @param e 拖拽时间回调
 */
async function getTrackItem(file: File, e: DragEvent) {
  const type = getResourcesType(file)
  let trackItem: TrackItem
  if (type === 'image') {
    trackItem = new ImageTrackItem(file, e, trackStore.scale)
    const imageAttr = new ImageAttr()
    attrStore.attrMap.set(trackItem.id, imageAttr)
  } else if (type === 'text') {
    trackItem = new TextTrackItem(file, e, trackStore.scale)
    const textAttr = new TextAttr()
    attrStore.attrMap.set(trackItem.id, textAttr)
  } else if (type === 'video') {
    trackItem = new VideoTrackItem(file, e, trackStore.scale)
    const videoAttr = new VideoAttr()
    attrStore.attrMap.set(trackItem.id, videoAttr)
  } else if (type === 'audio') {
    trackItem = new AudioTrackItem(file, e, trackStore.scale)
    const audioAttr = new AudioAttr()
    attrStore.attrMap.set(trackItem.id, audioAttr)
  } else return null
  if (trackItem) {
    await trackItem.init()
  }
  return trackItem
}

async function onDrop(e: DragEvent) {
  isDragging.value = false
  const trackItemIdx = e.dataTransfer?.getData('trackItemIdx')
  // 如果移动的是已有 trackItem
  if (trackItemIdx) {
    const { lineIdx, itemIdx } = JSON.parse(trackItemIdx) as TrackItemIdx
    const trackItem = trackList[lineIdx].list[itemIdx]
    trackItem.setStart(e, trackStore.scale, trackStore.dragOffsetX)
    trackStore.removeTrackItem(lineIdx, itemIdx)
    trackStore.insertToTrackList(lineIndex.value, trackItem.type, trackItem)
    e.dataTransfer?.clearData()
  } else {
    const files = await getDraggedFiles(e)
    files.forEach(async (file) => {
      const trackItem = await getTrackItem(file, e)
      if (trackItem === null) return
      const type = trackItem.type
      if (trackStore.initTrackList(type, trackItem)) return
      trackStore.insertToTrackList(lineIndex.value, type, trackItem)
    })
  }
  lineIndex.value = undefined
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

    .tracks {
      display: flex;
      flex: 1;
      flex-direction: column;
      width: max-content;
      min-width: 100%;
    }
  }
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

.info-line-left,
.timing-line {
  position: absolute;
  z-index: 10;
  width: 1px;
  height: 100%;
  background-color: var(--ep-color-warning);
}

.timing-line {
  background-color: #fff;

  &::after {
    position: absolute;
    top: 0;
    width: 10px;
    height: 20px;
    clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
    content: '';
    background-color: #fff;
    transform: translateX(-50%);
  }
}
</style>
