import { DefineComponent } from 'vue'

type MenuItem = {
  icon: DefineComponent
  type: string
  title: string
}

interface BaseResourcesItem {
  name: string
  format: string
  source: string
}

interface VideoItem extends BaseResourcesItem {
  cover: string
  width: number
  height: number
  fps: number
  frameCount: number
  time: number
}

interface AudioItem extends BaseResourcesItem {
  cover: string
  time: number
}

interface TextItem extends BaseResourcesItem {
  templateId: number
}

interface ImageItem extends BaseResourcesItem {
  cover: string
  width: number
  height: number
  sourceFrame: number
}

type ResourcesType = 'video' | 'audio' | 'image' | 'text'
type ResourcesItem = VideoItem | AudioItem | ImageItem | TextItem
type ResourcesSubList = {
  title: string
  type: ResourcesType
  items: ResourcesItem[]
}

type ResourcesList = Array<ResourcesSubList>

export type {
  MenuItem,
  ResourcesList,
  ResourcesSubList,
  VideoItem,
  AudioItem,
  ImageItem,
  TextItem
}
