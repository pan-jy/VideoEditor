import { formatTime } from '~/common/utils/timeFormat'
import type { UserConfig, CanvasConfig } from '~/types/canvas'

/**
 * 获取时间轴中每小格代表的宽度(单位: px)
 * @param scale 时间轴缩放比
 * @returns 时间轴中每小格代表的宽度(单位: px)
 */
const getGridSize = (scale: number): number => {
  const scaleNum = new Map([
    // 切换比例：一小格为 1 帧
    [10, 100],
    [9, 50],
    // 切换比例：一小格为 1/step 秒, 一大格为 1 秒
    [8, 20],
    [7, 10],
    // 切换比例：一小格为 1 秒, 一大格为 10 秒
    [6, 80],
    [5, 40],
    [4, 20],
    [3, 10],
    // 切换比例：一小格为 6 秒, 一大格为 1 分钟
    [2, 40],
    [1, 25],
    [0, 10]
  ])
  return scaleNum.get(scale) || 100
}
/**
 * 获取当前scale下的单元格像素
 * @param scale 时间轴缩放比
 * @param frameCount 帧数
 * @returns 当前scale下的单元格像素
 */
const frameCountToPixel = (scale: number, frameCount: number) => {
  const gridPixel = getGridSize(scale)
  let pixel = gridPixel * frameCount
  if (scale < 7) {
    // 1秒一格
    pixel /= 30
  }
  if (scale < 3) {
    // 6秒一格
    pixel /= 6
  }
  return pixel
}
/**
 * 获取选中点的帧坐标
 * @param scale 时间轴缩放比
 * @param offsetX 点击位置相对父元素的横坐标偏移量
 * @returns 选中点的帧坐标
 */
function pixelToFrameCount(scale: number, pixel: number) {
  const gridPixel = getGridSize(scale)
  let frameCount = pixel / gridPixel
  if (scale < 7) {
    frameCount *= 30
  }
  if (scale < 3) {
    frameCount *= 6
  }
  return Math.round(frameCount)
}
/**
 * 根据缩放比调整 step ( setp 个小单元格构成一个大单元格)
 * @param scale 时间轴缩放比
 * @param frameStep 步进，与视频 fps 同步
 * @returns 当前缩放比对应的 step (默认为 10， 缩放比大于 6 后为视频的 fps 值)
 */
const getStep = (scale: number, frameStep: number): number => {
  return scale > 6 ? frameStep : 10
}
/**
 * 获取每一大单元格的刻度值
 * @param largeUnitIndex 当前大单元格下标
 * @param scale 时间轴缩放比
 * @returns 每一大单元格的刻度值
 */
const getLongText = (largeUnitIndex: number, scale: number) => {
  // 一个大单元格为 1 秒
  let time = largeUnitIndex
  if (scale < 3) {
    // 一个大单元格为 1 分钟
    time *= 60
  } else if (scale < 7) {
    // 一个大单元格为 10 秒
    time *= 10
  }
  return formatTime(time * 1000).str
}
/**
 * 获取每一小单元格的刻度值（只有缩放比大于 9 才有小单元格刻度）
 * @param smallUnitIndex 当前小单元格下标
 * @param step 步进值
 * @param scale 时间轴缩放比
 * @returns 每一小单元格的刻度值
 */
const getShortText = (smallUnitIndex: number, step: number, scale: number) => {
  const index = smallUnitIndex % step
  return scale >= 9
    ? index === 0
      ? ''
      : `${index < 10 ? '0' : ''}${index}f`
    : ''
}

// /**
//  * 获取选中点的帧坐标
//  * @param scale 时间轴缩放比
//  * @param offsetX 点击位置相对父元素的横坐标偏移量
//  * @param frameStep 步进，与视频 fps 同步
//  * @returns 选中点的帧坐标
//  */
// const pixelToFrameCount = (scale: number, offsetX: number, frameStep = 30) => {
//   const size = getGridSize(scale)
//   if (scale < 7) {
//     // 一个单元格为 1 秒
//     offsetX *= frameStep
//   }
//   if (scale < 3) {
//     // 一个单元格为 6 秒
//     offsetX *= 6
//   }
//   return Math.floor(offsetX / size) + (scale < 7 ? 0 : 1)
// }
/**
 * 使用 canvas 绘制时间轴
 * @param context canvas 2D 渲染上下文
 * @param userConfigs 用户配置项
 * @param canvasConfigs canvas 配置项
 */
const drawTimeLine = (
  context: CanvasRenderingContext2D,
  userConfigs: UserConfig,
  canvasConfigs: CanvasConfig
) => {
  const { start, scale, step: frameStep, focusPosition } = userConfigs
  const {
    ratio,
    bgColor,
    width,
    height,
    textColor,
    subTextColor,
    textSize,
    textScale,
    focusColor,
    longColor,
    shortColor
  } = canvasConfigs
  const lineWidth = 0.5
  const step = getStep(scale, frameStep)

  // 初始化画布
  context.scale(ratio, ratio) // 指定画布缩放比
  context.clearRect(0, 0, width, height) // 清除画布底色，使画布完全透明

  // 1. 填充时间轴底色
  context.fillStyle = bgColor
  context.fillRect(0, 0, width, height)

  // 2. 计算网格
  const smallUnitSize = getGridSize(scale) // 获取当前缩放下每小格的宽度
  const largeUnitSize = smallUnitSize * step // 根据步进计算每大格的宽度

  const smallUnitStart = Math.floor(start / smallUnitSize) * smallUnitSize // 小格绘制起点的刻度(start 向下取 smallUnitSize 的整数倍)
  const largeUnitStart = Math.floor(start / largeUnitSize) * largeUnitSize // 大格绘制起点的刻度(start 向下取 largeUnitSize 的整数倍)

  const smallUnitOffsetX = smallUnitStart - start // 小格起点刻度距离原点(start)的px距离
  const largeUnitOffsetX = largeUnitStart - start // 大格起点刻度距离原点(start)的px距离
  const endValue = start + Math.ceil(width) // 终点刻度(略超出标尺宽度即可)

  // 3. 时间轴聚焦元素
  if (focusPosition.start >= 0) {
    const focusS = frameCountToPixel(scale, focusPosition.start) - start
    const focusW = frameCountToPixel(
      scale,
      focusPosition.end - focusPosition.start
    )
    // 小于一个小格的元素就不提示了
    // if (focusW >= smallUnitSize) {
    context.fillStyle = focusColor
    context.fillRect(focusS, 0, focusW, (height * 3) / 8)
    // }
  }

  /**
   * 4. 长间隔和文字
   * 长间隔和短间隔需分开两次绘制，才可以完成不同颜色的设置；
   * 分开放到两个for循环是为了节省性能，因为如果放到一个for循环的话，每次循环都会重新绘制操作dom
   * */
  context.beginPath() // 开启一条新的路径
  context.fillStyle = textColor
  context.strokeStyle = longColor
  for (
    let value = largeUnitStart, count = 0;
    value < endValue;
    value += largeUnitSize, count++
  ) {
    const x = largeUnitOffsetX + count * largeUnitSize + lineWidth // prevent canvas 1px line blurry
    context.moveTo(x, 0)
    context.save()
    context.translate(x, height * 0.4)
    context.scale(textScale / ratio, textScale / ratio)
    const text = getLongText(value / largeUnitSize, scale)
    const textPositionX = text.length * 5 * textScale * ratio // 文字长度的一半
    const textPositionY = ((textSize / ratio) * textScale) / ratio / 2 // 文字高度的一半
    context.fillText(text, textPositionX, textPositionY)
    context.restore()
    context.lineTo(x, (height * 10) / 16 / ratio)
  }
  context.stroke()
  context.closePath()

  // 5. 短间隔和文字 只在特殊放大倍数下显示文字
  context.beginPath()
  context.fillStyle = subTextColor
  context.strokeStyle = shortColor
  for (
    let value = smallUnitStart, count = 0;
    value < endValue;
    value += smallUnitSize, count++
  ) {
    const x = smallUnitOffsetX + count * smallUnitSize + lineWidth // prevent canvas 1px line blurry
    context.moveTo(x, 0)
    const text = getShortText(value / smallUnitSize, step, scale)
    if (text) {
      context.save()
      context.translate(x, height * 0.4)
      context.scale(textScale / ratio, textScale / ratio)
      const textPositionX = text.length * 5 * textScale * ratio // 文字长度的一半
      const textPositionY = ((textSize / ratio) * textScale) / ratio / 2 // 文字高度的一半
      context.fillText(text, textPositionX, textPositionY)
      context.restore()
    }
    if (value % largeUnitSize !== 0) {
      context.lineTo(x, height / 3 / ratio)
    }
  }
  context.stroke()
  context.closePath()

  // 恢复ctx matrix
  context.setTransform(1, 0, 0, 1, 0, 0)
}

export { frameCountToPixel, pixelToFrameCount, getLongText, drawTimeLine }
