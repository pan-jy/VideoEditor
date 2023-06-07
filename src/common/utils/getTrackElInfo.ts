/**
 * 获取 target 元素的 el-name 属性
 * @param target 拖动终止时鼠标停留的元素
 */
function getElName(target: HTMLElement | null) {
  if (target === null) return
  return target.attributes.getNamedItem('el-name')?.value as
    | 'TrackLine'
    | 'TrackItem'
    | undefined
}

function getOffsetX(e: DragEvent) {
  const target = e.target as HTMLElement
  const elName = getElName(target)
  let offsetX = e.offsetX
  if (elName === 'TrackItem') {
    offsetX = e.offsetX + target.offsetLeft
  }
  return Math.max(10, offsetX - 20)
}

export { getElName, getOffsetX }
