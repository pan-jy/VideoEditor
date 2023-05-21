function formatTime(time: number) {
  let second = Math.ceil(time / 1000)
  const s = second % 60
  second = Math.floor(second / 60)
  const m = second % 60
  second = Math.floor(second / 60)
  const h = second % 60
  return {
    s,
    m,
    h,
    str: `${h === 0 ? '' : `${h < 10 ? '0' : ''}${h}:`}${
      m < 10 ? '0' : ''
    }${m}:${s < 10 ? '0' : ''}${s}`
  }
}

export { formatTime }
