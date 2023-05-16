import { DefineComponent } from 'vue'

type MenuItem = {
  icon: DefineComponent
  type: string
  title: string
}

type ResourcesItem = {
  name: string
  cover: string
  format?: string
  source?: string
  width?: number
  height?: number
  fps?: number
  frameCount?: number
  templateId?: number
  time?: number
  sourceFrame?: number
}

type ResourcesList = Array<{
  title: string
  type: string
  items: Array<ResourcesItem>
}>

export type { MenuItem, ResourcesItem, ResourcesList }
