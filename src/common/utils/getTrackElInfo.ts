function isContains(target: HTMLElement | null, classes: string | string[]) {
  if (!target) return false
  if (typeof classes === 'string') classes = [classes]
  for (const c of classes) {
    if (target.classList.contains(c)) return true
  }
  return false
}

function getOffsetX(e: DragEvent) {
  let target = e.target as HTMLElement
  let offsetX = e.offsetX
  if (!isContains(target, ['tracks', 'track-line'])) {
    if (isContains(target, 'track-list-content')) {
      offsetX += target.scrollLeft
    } else {
      while (!isContains(target, ['track-item', 'track-list-content'])) {
        offsetX += target.offsetLeft
        target = target.parentElement as HTMLElement
      }
    }
    if (isContains(target, 'track-item')) {
      offsetX += target.offsetLeft
    }
  }
  return Math.max(0, offsetX - 30)
}
/**
 * 用于返回外层元素（例如：track-item 内的任何元素的外层元素都是 track-item）
 * @param target 默认为最底层的元素
 * @returns 该元素的外层元素
 */
function getOuterTarget(target: HTMLElement) {
  if (!isContains(target, ['tracks', 'track-line', 'track-list-content'])) {
    while (!isContains(target, ['track-item', 'track-list-content'])) {
      target = target.parentElement as HTMLElement
    }
  }
  return target
}

export { isContains, getOffsetX, getOuterTarget }
