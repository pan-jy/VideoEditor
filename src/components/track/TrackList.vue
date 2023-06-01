<template>
  <div
    class="track-list"
    ref="trackContainer"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <aside class="track-list-aside"></aside>
    <article class="track-list-content" @wheel="zoomScale">
      <TimeLine :scale="trackState.scale" />
      <div class="empty-info" v-if="trackList.length === 0">
        <el-icon size="20"><Files /></el-icon>
        <span>将资源拖拽到这里，开始编辑作品吧~</span>
      </div>
      <div class="files" v-else>
        <TrackItem
          v-for="trackItem in trackList"
          :key="trackItem.file.name"
          :trackItem="trackItem"
        />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { Files } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { fetchFile } from '~/common/utils/fetchFile'
import { useTrackState } from '~/stores/trackState'
import { TrackList } from '~/types/tracks'
import getResourcesType from '~/common/utils/getResourcesType'

const trackState = useTrackState()

const trackContainer = ref<HTMLDivElement>()
const trackList = ref<TrackList>([])
async function onDrop(e: DragEvent) {
  // 获取拖动的文件
  const fileInfo = e.dataTransfer?.getData('fileInfo')
  if (fileInfo) {
    const fileInfoJSON = JSON.parse(fileInfo) as {
      source: string
      name: string
      type: string
    }
    const file = await fetchFile(fileInfoJSON.source, fileInfoJSON.name)
    const type = getResourcesType(file)
    trackList.value.push({ type, file })
  } else {
    const files = Array.from(e.dataTransfer?.files ?? [])
    files.forEach((file: File) => {
      const type = getResourcesType(file)
      trackList.value.push({ type, file })
    })
  }
  console.log(trackList)
}

function zoomScale(e: WheelEvent) {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    if (e.deltaY === 0) return
    e.deltaY > 0 ? trackState.scale-- : trackState.scale++
  }
}
</script>

<style lang="scss" scoped>
.track-list {
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: hidden;

  &-aside {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50px;
    height: 100%;
    overflow-y: hidden;
    border-right: 1px solid var(--ep-border-color);
  }

  &-content {
    position: relative;
    flex: 1;
    overflow: auto;
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
  height: 100px;
  margin: auto;
  font-size: 16px;
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
