import { onBeforeUnmount, watchEffect } from 'vue'
import { usePlayerStore } from '~/stores/playerStore'
import { TrackItem } from '~/types/tracks'

export function trackCheckPlaying(trackItem: TrackItem) {
  const playerStore = usePlayerStore()
  watchEffect(() => {
    if (
      playerStore.playingFrame >= trackItem.start &&
      playerStore.playingFrame <= trackItem.end
    ) {
      !playerStore.playTargetTrackMap.has(trackItem.id) &&
        playerStore.playTargetTrackMap.set(trackItem.id, trackItem)
    } else {
      delItem(trackItem.id)
    }
  })
  onBeforeUnmount(() => {
    delItem(trackItem.id)
  })

  function delItem(id: number) {
    playerStore.playTargetTrackMap.has(id) &&
      playerStore.playTargetTrackMap.delete(id)
  }
}
