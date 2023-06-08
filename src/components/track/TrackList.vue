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
    >
      <TimeLine
        :scale="trackState.scale"
        :start="scrollVal.scrollLeft - trackLeftStart"
        :focusPosition="trackState.focusPosition"
      />
      <div class="empty-info" v-if="trackList.length === 0">
        <el-icon size="20"><Files /></el-icon>
        <span>将资源拖拽到这里，开始编辑作品吧~</span>
      </div>
      <div class="tracks" v-else>
        <TrackLine
          v-for="(trackLine, index) in trackList"
          :key="index"
          :line-index="index"
          el-name="TrackLine"
          :trackLine="trackLine"
          :class="[
            lineIndex === index && isDragging
              ? showInfoLineBootom
                ? 'info-line-bottom'
                : 'info-line-top'
              : ''
          ]"
          @dragover.prevent="onDragOverTrackLine($event, index)"
        />
      </div>
      <div
        v-show="isDragging"
        class="info-line-left"
        :style="{ left: `${offsetX}px`, top: `${scrollVal.scrollTop}px` }"
      />
    </article>
  </div>
</template>

<script setup lang="ts">
import { Files } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { fetchFile } from '~/common/utils/fetchFile'
import { useTrackState } from '~/stores/trackState'
import { getElName, getOffsetX } from '~/common/utils/getTrackElInfo'
import { getResourcesType } from '~/common/utils/getResourcesInfo'
import { useThrottleFn } from '@vueuse/core'
import {
  ImageTrackItem,
  TextTrackItem,
  VideoTrackItem,
  AudioTrackItem,
  trackLeftStart
} from '~/config/tracks'

const trackState = useTrackState()
const trackList = trackState.trackList
// 处理缩放事件
function zoomScale(e: WheelEvent) {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    if (e.deltaY === 0) return
    e.deltaY > 0 ? trackState.scale-- : trackState.scale++
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
  offsetX.value = getOffsetX(e) + trackLeftStart
}, 100)

// 待插入的 trackLine 的 index
const lineIndex = ref<number | undefined>(undefined)
// 是否显示底部提示线
const showInfoLineBootom = ref(true)
const onDragOverTrackLine = useThrottleFn((e: DragEvent, index: number) => {
  const targets = document.elementsFromPoint(e.x - 30, e.y)
  // 避免 target 的是 info-line
  const target = (
    targets[0].classList.contains('info-line-left') ? targets[1] : targets[0]
  ) as HTMLElement | null
  // 是否和已有的 trackItem 发生重叠
  const overlapItem = getElName(target) === 'TrackItem'
  if (overlapItem) {
    showInfoLineBootom.value = false
    index++
  } else showInfoLineBootom.value = true
  lineIndex.value = index
}, 100)

/**
 * 获取拖拽的文件
 * @param e 拖拽事件回调
 */
async function getDraggedFiles(e: DragEvent) {
  const files = []
  // 获取拖动的文件
  const fileInfo = e.dataTransfer?.getData('fileInfo')
  if (fileInfo) {
    const fileInfoJSON = JSON.parse(fileInfo) as {
      source: string
      name: string
    }
    files.push(await fetchFile(fileInfoJSON.source, fileInfoJSON.name))
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
function getTrackItem(file: File, e: DragEvent) {
  const type = getResourcesType(file)
  if (type === 'image') return new ImageTrackItem(file, e, trackState.scale)
  if (type === 'text') return new TextTrackItem(file, e, trackState.scale)
  if (type === 'video') return new VideoTrackItem(file, e, trackState.scale)
  if (type === 'audio') return new AudioTrackItem(file, e, trackState.scale)
  return null
}

async function onDrop(e: DragEvent) {
  isDragging.value = false
  const files = await getDraggedFiles(e)
  files.forEach((file) => {
    const trackItem = getTrackItem(file, e)
    if (trackItem === null) return
    const type = trackItem.type
    if (trackState.initTrackList(type, trackItem)) return
    trackState.insertToTrackList(lineIndex.value, type, trackItem)
  })
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
  }
}
.tracks {
  display: flex;
  flex: 1;
  flex-direction: column;
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

.info-line-left {
  position: absolute;
  z-index: 10;
  width: 1px;
  height: 100%;
  background-color: var(--ep-color-warning);
}
</style>
