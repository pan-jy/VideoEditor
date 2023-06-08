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
          :class="
            lineIndex === index && isDragging
              ? showInfoLineBootom
                ? 'info-line-bottom'
                : 'info-line-top'
              : ''
          "
          @dragover.prevent="onDragOverTrackLine"
        />
      </div>
      <div
        v-show="trackList.length > 0 && isDragging"
        class="info-line-left"
        :style="{ left: `${offsetX}px`, top: `${scrollVal.scrollTop}px` }"
      />
    </article>
  </div>
</template>

<script setup lang="ts">
import { Files } from '@element-plus/icons-vue'
import { reactive, ref, watch } from 'vue'
import { fetchFile } from '~/common/utils/fetchFile'
import { useTrackState } from '~/stores/trackState'
import type { TrackItem, TrackLine, TrackList } from '~/types/tracks'
import { getElName, getOffsetX } from '~/common/utils/getTrackElInfo'
import { getResourcesType } from '~/common/utils/getResourcesInfo'
import { useThrottleFn } from '@vueuse/core'
import {
  ImageTrackItem,
  TextTrackItem,
  VideoTrackItem,
  AudioTrackItem,
  trackOrder,
  trackLeftStart
} from '~/config/tracks'

const trackState = useTrackState()
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

const trackList = ref<TrackList>([])
// 监听列表变化，对列表进行排序
watch(trackList.value, (trackList) => {
  trackList.sort((a, b) => trackOrder[a.type] - trackOrder[b.type])
  trackList.forEach((trackLine) => {
    trackLine.list.sort((a, b) => a.start - b.start)
  })
})
/**
 * 将文件转为对应的对象
 * @param type 文件类型
 * @param file 文件
 * @param e 拖拽时间回调
 */
function getTrackItem(file: File, e: DragEvent) {
  const type = getResourcesType(file)
  if (type === 'image') return new ImageTrackItem(file, e)
  if (type === 'text') return new TextTrackItem(file, e)
  if (type === 'video') return new VideoTrackItem(file, e)
  if (type === 'audio') return new AudioTrackItem(file, e)
  return null
}
/**
 * 判断该轨道当前位置能否插入
 * @param trackLine 待插入的行
 * @param trackItem 待插入的trackItem
 */
function getInsertable(trackLine: TrackLine, trackItem: TrackItem) {
  for (let i = trackLine.list.length - 1; i >= 0; i--) {
    if (trackLine.list[i].end < trackItem.start) break
    if (trackLine.list[i].start < trackItem.end) return false
  }
  return true
}
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

const isDragging = ref(false)
const offsetX = ref(0)
const lineIndex = ref<number | undefined>(undefined)
const showInfoLineBootom = ref(true)
const onDragOverTrackList = useThrottleFn((e: DragEvent) => {
  isDragging.value = true
  offsetX.value = getOffsetX(e)
}, 100)

const onDragOverTrackLine = useThrottleFn((e: DragEvent) => {
  lineIndex.value = getLineIndex(e)
}, 100)

/**
 * 获取 target 的 line-index 属性，表示当前轨道位于第几行
 * @param target 拖动终止时鼠标停留的元素
 */
function getLineIndex(e: DragEvent) {
  const targets = document.elementsFromPoint(e.x - 30, e.y)
  // 避免 target 的是 info-line
  let target = (
    targets[0].classList.contains('info-line-left') ? targets[1] : targets[0]
  ) as HTMLElement | null
  if (target === null) return
  const isTrackItem = getElName(target) === 'TrackItem'
  if (isTrackItem) {
    target = target.parentElement
    showInfoLineBootom.value = false
  } else showInfoLineBootom.value = true
  if (target === null) return
  const lineIndexStr = target.attributes.getNamedItem('line-index')?.value
  if (lineIndexStr === undefined) return
  let lineIndex = parseInt(lineIndexStr)
  if (isTrackItem) lineIndex++
  return lineIndex
}

async function onDrop(e: DragEvent) {
  isDragging.value = false
  const files = await getDraggedFiles(e)
  files.forEach((file) => {
    const trackItem = getTrackItem(file, e)
    if (trackItem === null) return
    const type = trackItem.type
    // 初始化
    if (trackList.value.length === 0) {
      trackList.value.push({
        type: 'video',
        isMian: true,
        list: []
      })
      if (type === 'video') {
        trackList.value[0].list.push(trackItem)
        return
      }
    }
    // 如果拖动到已有轨道内
    if (lineIndex.value !== undefined) {
      const trackLine = trackList.value[lineIndex.value]
      // 如果类型匹配且该轨道当前位置可插入
      if (trackLine.type === type && getInsertable(trackLine, trackItem)) {
        trackLine.list.push(trackItem)
      } else {
        if (getElName(e.target as HTMLElement) === 'TrackItem')
          lineIndex.value--
        trackList.value.splice(lineIndex.value + 1, 0, {
          type,
          list: [trackItem]
        })
      }
    } else {
      trackList.value.push({
        type,
        list: [trackItem]
      })
    }
  })
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

.info-line-top::before,
.info-line-bottom::after {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 1px;
  content: '';
  background-color: var(--ep-color-warning);
}

.info-line-top::before {
  top: 0;
}
.info-line-bottom::after {
  bottom: 0;
}
</style>
