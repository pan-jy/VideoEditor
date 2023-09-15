import { trackLeftStart } from '~/config/tracks'

let pre = 0
// 获取鼠标相对于轨道（track-line）的偏移量
function getOffsetX(e: DragEvent, dragOffsetX: number) {
  const currentTarget = e.currentTarget as HTMLElement | null
  if (!currentTarget) return pre
  const offsetX =
    e.x -
    currentTarget.offsetLeft +
    currentTarget.scrollLeft -
    dragOffsetX -
    trackLeftStart
  pre = offsetX
  return Math.max(0, offsetX)
}

export { getOffsetX }
