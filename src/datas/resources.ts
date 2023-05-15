import { VideoPlay, Headset, Picture, EditPen } from '@element-plus/icons-vue'
import type { MenuItem } from './types/resources'

const menuItem: MenuItem[] = [
  {
    icon: VideoPlay,
    title: '媒体'
  },
  {
    icon: Headset,
    title: '音频'
  },
  {
    icon: EditPen,
    title: '文字'
  },
  {
    icon: Picture,
    title: '贴图'
  }
]

export { menuItem }
