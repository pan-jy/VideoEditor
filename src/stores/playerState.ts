import { defineStore } from 'pinia'
import { reactive, ref, toRefs, watch } from 'vue'
import { VideoTrackItem } from '~/config/tracks'
import { TrackItem } from '~/types/tracks'
import { useTrackState } from './trackState'
import { useDebounceFn } from '@vueuse/core'
import { useAttrState } from './attrState'
import { AudioAttr, VideoAttr } from '~/types/attributes'

export const usePlayerState = defineStore('playerState', () => {
  const tracKState = useTrackState()
  const attrState = useAttrState()
  // 当前播放帧
  const playingFrame = ref(0)
  // 当前播放帧位于 start 和 end 之间的 (id, trackItem)
  const playTargetTrackMap = ref(new Map())
  // ffmpeg 处理中的数目
  const inLoadingCount = ref(0)
  // 是否暂停
  const isPause = ref(true)
  // 基础配置: frameCount: 最后一帧, playerWidth: 播放器宽, playerHeight:播放器高
  const playerConfig = reactive({
    frameCount: 0,
    playerWidth: 0,
    playerHeight: 0
  })
  // 是否存在视频
  const existVideo = ref(false)
  // 带合并音频的 trackItem，因为有多个音频所以需要收集后合并
  const audioPlayData = ref<Array<TrackItem>>([])
  function mergeMedia() {
    let existV = false
    const endList: Array<number> = []
    const mediaList: Array<TrackItem> = []
    let playerWidth = 0
    let playerHeight = 0
    let audioStart = -1
    let audioEnd = -1
    for (const trackLine of tracKState.trackList) {
      const { type } = trackLine
      if (type !== 'video' && type !== 'audio') continue
      let lineEnd = 0
      trackLine.list.forEach((trackItem) => {
        const { silence } = attrState.attrMap.get(trackItem.id) as
          | VideoAttr
          | AudioAttr
        if (type === 'video') {
          // 以第一个视频的宽高作为播放器的宽高
          if (playerWidth === 0 && playerHeight === 0) {
            playerWidth = Math.max(
              playerWidth,
              (trackItem as VideoTrackItem).width
            )
            playerHeight = Math.max(
              playerHeight,
              (trackItem as VideoTrackItem).height
            )
          }
          existV = true
        }
        if (!silence) {
          mediaList.push(trackItem)
          audioStart = Math.min(audioStart, trackItem.start)
          audioEnd = Math.min(audioEnd, trackItem.end)
          lineEnd = Math.max(lineEnd, trackItem.end)
        }
      })
      endList.push(lineEnd)
    }

    audioPlayData.value = mediaList
    playerConfig.frameCount = Math.max(...endList)
    playerConfig.playerWidth = playerWidth
    playerConfig.playerHeight = playerHeight
    existVideo.value = existV
  }

  watch(
    [() => tracKState.trackList, attrState.attrMap],
    useDebounceFn(mergeMedia, 30),
    {
      immediate: true,
      deep: true
    }
  )

  return {
    isPause,
    playingFrame,
    playTargetTrackMap,
    inLoadingCount,
    audioPlayData,
    existVideo,
    ...toRefs(playerConfig)
  }
})
