import {
  VideoCamera,
  Headset,
  Picture,
  EditPen,
  ArrowLeftBold,
  ArrowRightBold,
  DeleteFilled
} from '@element-plus/icons-vue'
import type { MenuItem } from '../types/resources'

const sideBarMenu: MenuItem[] = [
  {
    icon: VideoCamera,
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

const trackHeaderMenu: Array<Omit<MenuItem, 'type'>> = [
  {
    icon: ArrowLeftBold,
    title: '后退'
  },
  {
    icon: ArrowRightBold,
    title: '前进'
  },
  {
    icon: DeleteFilled,
    title: '删除'
  }
]

export { sideBarMenu, trackHeaderMenu }
