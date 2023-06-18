import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type {
  TrackItem,
  TrackLine,
  TrackList,
  TrackType,
  TrackItemIdx
} from '~/types/tracks'
import { trackOrder } from '~/config/tracks'

export const useTrackState = defineStore('trackState', () => {
  const scale = ref(5)
  const trackList = ref<TrackList>([])
  const focusedItem = ref<TrackItem | undefined>()

  const focusedItemIdx = computed((): TrackItemIdx | undefined => {
    if (focusedItem.value === undefined) return
    for (const lineIdx in trackList.value) {
      const itemList = trackList.value[lineIdx].list
      for (const itemIdx in itemList) {
        if (itemList[itemIdx] === focusedItem.value)
          return { lineIdx: parseInt(lineIdx), itemIdx: parseInt(itemIdx) }
      }
    }
    return undefined
  })

  // 监听列表变化，对列表进行排序
  watch(trackList.value, (trackList) => {
    trackList.sort((a, b) => trackOrder[a.type] - trackOrder[b.type])
    trackList.forEach((trackLine) => {
      trackLine.list.sort((a, b) => a.start - b.start)
    })
  })

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
   * 初始化 trackList 的 main 轨道
   * @param type 待插入资源类型
   * @param trackItem 待插入资源对象
   */
  function initTrackList(type: TrackType, trackItem: TrackItem) {
    // 初始化
    if (trackList.value.length === 0) {
      trackList.value.push({
        type: 'video',
        isMian: true,
        list: []
      })
      if (type === 'video') {
        insertToTrackList(0, 'video', trackItem)
        return true
      }
    }
    return false
  }
  /**
   * 插入 trackItem 到对应的 trackLine
   * @param type 待插入资源类型
   * @param trackItem 待插入资源对象
   */
  function insertToTrackList(
    lineIndex: number | undefined,
    type: TrackType,
    trackItem: TrackItem
  ) {
    focusedItem.value = trackItem
    if (lineIndex === undefined || lineIndex >= trackList.value.length) {
      trackList.value.push({
        type,
        list: [trackItem]
      })
      return
    }
    const trackLine = trackList.value[lineIndex]
    // 类型相同且该位置可插入
    if (trackLine.type === type && getInsertable(trackLine, trackItem)) {
      trackLine.list.push(trackItem)
      return
    }
    trackList.value.splice(lineIndex, 0, {
      type,
      list: [trackItem]
    })
  }

  /**
   * 移除对应位置的 trackItem
   * @param lineIndex 行下标
   * @param itemIndex item 下标
   * @param deleteF 永久删除
   */
  function removeTrackItem(
    lineIndex: number,
    itemIndex: number,
    deleteF?: boolean
  ) {
    const trackLine = trackList.value[lineIndex]
    const trackItem = trackLine.list[itemIndex]
    if (deleteF) {
      URL.revokeObjectURL(trackItem.source)
    }
    trackLine.list.splice(itemIndex, 1)
    if (trackLine.list.length === 0 && !trackLine.isMian)
      trackList.value.splice(lineIndex, 1)
  }

  return {
    scale,
    focusedItem,
    focusedItemIdx,
    trackList,
    initTrackList,
    insertToTrackList,
    removeTrackItem
  }
})
