import { VideoPlay, Headset, Picture, EditPen } from '@element-plus/icons-vue'
import type { MenuItem } from './types/resources'

const menuList: MenuItem[] = [
  {
    icon: VideoPlay,
    type: 'video',
    title: '媒体'
  },
  {
    icon: Headset,
    type: 'audio',
    title: '音频'
  },
  {
    icon: EditPen,
    type: 'text',
    title: '文字'
  },
  {
    icon: Picture,
    type: 'image',
    title: '贴图'
  }
]

export { menuList }
