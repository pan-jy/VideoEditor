export default function (time: number) {
  const seconds = Math.floor(time / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${('0' + minutes).slice(-2)}:${('0' + remainingSeconds).slice(-2)}`
}
