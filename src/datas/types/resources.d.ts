import { DefineComponent } from 'vue'

type MenuItem = {
  icon: DefineComponent
  type: string
  title: string
}

type ResourcesItem = {
  name: string
  cover: string
  format: string
  source: string
  width: number
  height: number
  fps: number
  frameCount: number
  templateId: number
  time: number
  sourceFrame: number
}

type VideoItem = Omit<ResourcesItem, 'templateId' | 'sourceFrame'>

type AudioItem = Pick<
  ResourcesItem,
  'cover' | 'time' | 'format' | 'name' | 'source'
>

type TextItem = Pick<ResourcesItem, 'name' | 'templateId' | 'cover'>

type ImageItem = Omit<
  ResourcesItem,
  'fps' | 'frameCount' | 'templateId' | 'time'
>

type ResourcesList = Array<
  | {
      title: string
      type: 'video'
      items: Array<VideoItem>
    }
  | {
      title: string
      type: 'audio'
      items: Array<AudioItem>
    }
  | {
      title: string
      type: 'text'
      items: Array<TextItem>
    }
  | {
      title: string
      type: 'image'
      items: Array<ImageItem>
    }
>

export type { MenuItem, ResourcesItem, ResourcesList, VideoItem, AudioItem }
