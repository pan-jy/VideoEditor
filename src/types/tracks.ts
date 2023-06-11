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

type TrackLine = {
  type: TrackItem['type']
  isMian?: boolean
  list: Array<TrackItem>
}

type TrackList = Array<TrackLine>

type TrackItemIdx = {
  lineIdx: number
  itemIdx: number
}

export type {
  TrackType,
  TrackItem,
  TrackLine,
  TrackList,
  VideoTrackItem,
  AudioTrackItem,
  TextTrackItem,
  ImageTrackItem,
  TrackItemIdx
}
