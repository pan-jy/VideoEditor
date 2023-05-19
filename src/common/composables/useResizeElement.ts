function useResize(mouseOn: HTMLElement, target: HTMLElement) {
  let oldY: number
  function mouseMove(e: MouseEvent) {
    const oldTop = target.offsetTop
    const oldHeight = target.offsetHeight
    target.style.height = target.offsetHeight + oldY - e.y + 'px'
    if (oldTop === target.offsetTop && oldHeight !== target.offsetHeight) {
      target.style.height = oldHeight + 'px'
    }
    oldY = e.y
  }
  mouseOn.addEventListener('mousedown', () => {
    oldY = target.offsetTop
    document.addEventListener('mousemove', mouseMove)
  })
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', mouseMove)
  })
}
export { useResize }
