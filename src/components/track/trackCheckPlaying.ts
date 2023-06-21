import { onBeforeUnmount, watchEffect } from 'vue'
import { usePlayerState } from '~/stores/playerState'
import { TrackItem } from '~/types/tracks'

export function trackCheckPlaying(trackItem: TrackItem) {
  const playerState = usePlayerState()
  watchEffect(() => {
    if (
      playerState.playingFrame >= trackItem.start &&
      playerState.playingFrame <= trackItem.end
    ) {
      !playerState.playTargetTrackMap.has(trackItem.id) &&
        playerState.playTargetTrackMap.set(trackItem.id, trackItem)
    } else {
      delItem(trackItem.id)
    }
  })
  onBeforeUnmount(() => {
    delItem(trackItem.id)
  })

  function delItem(id: number) {
    playerState.playTargetTrackMap.has(id) &&
      playerState.playTargetTrackMap.delete(id)
  }
}
