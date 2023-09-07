import { defineStore } from 'pinia'
import { reactive, ref, toRaw, watch } from 'vue'
import { AttrMap, useAttrStore } from './attrStore'
import { useTrackStore } from './trackStore'
import { TrackList } from '~/types/tracks'
import { useDebounceFn } from '@vueuse/core'

const MAX_HISTORY_LENGTH = 10

type HistoryItem = {
  trackList: TrackList
  attrMap: AttrMap
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepClone(target: any) {
  if (typeof target !== 'object' || target === null || target instanceof File)
    return target

  if (target instanceof Map) {
    const res = new Map()
    target.forEach((value, key) => {
      res.set(key, deepClone(value))
    })
    return res
  } else {
    const isArray = Array.isArray(target)
    const res = isArray ? [] : {}
    if (!isArray) Object.setPrototypeOf(res, Object.getPrototypeOf(target))
    for (const key in target) {
      if (!Object.hasOwn(target, key)) continue
      res[key] = deepClone(target[key])
    }
    return res
  }
}

export const useHistoryStore = defineStore('historyStore', () => {
  const trackStore = useTrackStore()
  const attrStore = useAttrStore()
  const history = reactive<HistoryItem[]>([
    {
      trackList: deepClone(toRaw(trackStore.trackList)),
      attrMap: deepClone(toRaw(attrStore.attrMap))
    }
  ])

  // let historyIdx = 0
  const historyIdx = ref(0)
  let isRedoOrUndo = false

  watch(
    () => [trackStore.trackList, attrStore.attrMap],
    useDebounceFn(
      (newVal) => {
        if (isRedoOrUndo) {
          isRedoOrUndo = false
          return
        }
        const historyItem = {
          trackList: deepClone(toRaw(newVal[0])),
          attrMap: deepClone(toRaw(newVal[1]))
        } as HistoryItem
        if (historyIdx.value < history.length - 1) {
          history.splice(historyIdx.value)
          history.push(historyItem)
        } else {
          history.push(historyItem)
        }
        if (history.length > MAX_HISTORY_LENGTH) history.shift()
        historyIdx.value = history.length - 1
      },
      100,
      {
        maxWait: 1000
      }
    ),
    {
      deep: true
    }
  )

  function travelTo(idx: number) {
    if (idx < 0 || idx >= history.length) return
    isRedoOrUndo = true
    const { attrMap, trackList } = history[idx]
    attrStore.patchAttrMap(attrMap)
    trackStore.trackList.splice(0, trackStore.trackList.length, ...trackList)
    trackStore.focusedItem = undefined
    historyIdx.value = idx
  }

  function redo() {
    travelTo(historyIdx.value + 1)
  }

  function undo() {
    travelTo(historyIdx.value - 1)
  }

  return {
    history,
    historyIdx,
    redo,
    undo
  }
})
