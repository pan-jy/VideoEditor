import { VideoItem, AudioItem, TextItem, ImageItem } from '~/types/resources'

type TrackType = 'video' | 'audio' | 'text' | 'image'

type BaseTrackItem = {
  id: string
  type: TrackType
  start: number
  end: number
  frameCount: number
  offsetL: number
  offsetR: number
}

type VideoTrackItem = BaseTrackItem & VideoItem
type AudioTrackItem = BaseTrackItem & AudioItem
type TextTrackItem = BaseTrackItem & TextItem
type ImageTrackItem = BaseTrackItem & ImageItem

type TrackItem = {
  type: string
  file: File
}

type TrackList = Array<TrackItem>

export { TrackItem, TrackList }
