import {
  VideoTrackItem,
  AudioTrackItem,
  TextTrackItem,
  ImageTrackItem
} from '~/config/tracks'

type TrackType = 'video' | 'audio' | 'text' | 'image'

type TrackItem =
  | VideoTrackItem
  | AudioTrackItem
  | TextTrackItem
  | ImageTrackItem

type TracksItem = {
  type: TrackItem['type']
  list: Array<TrackItem>
}

type TrackList = Array<TracksItem>

export type { TrackType, TrackItem, TrackList }
