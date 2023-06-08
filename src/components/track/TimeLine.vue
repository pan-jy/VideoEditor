<template>
  <div class="canvasContainer" ref="canvasContainer">
    <canvas
      class="timeLine"
      ref="timeLine"
      :style="canvasStyle"
      v-bind="canvasAttr"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { drawTimeLine } from '~/common/utils/drawTimeLine'
import type {
  UserConfig,
  CanvasConfig,
  CanvasTextAlign,
  CanvasTextBaseline
} from '~/types/canvas'
import { isDark } from '~/common/composables/useDark'
import { useSideBarState } from '~/stores/sideBarState'

const props = withDefaults(
  defineProps<{
    start: number
    step: number
    scale: number
    focusPosition: { start: number; end: number }
  }>(),
  {
    start: 0,
    step: 30,
    scale: 1,
    focusPosition: () => ({
      start: 0,
      end: 0
    })
  }
)
const canvasContainer = ref<HTMLDivElement>()
const timeLine = ref<HTMLCanvasElement>()
let canvasContext = {} as CanvasRenderingContext2D

const canvasConfigs = computed(() => ({
  bgColor: isDark.value ? '#374151' : '#E5E7EB', // 背景颜色
  ratio: window.devicePixelRatio || 1, // 设备像素比
  textSize: 12, // 字号
  textScale: 0.83, // 支持更小号字： 10 / 12
  lineWidth: 1, // 线宽
  textBaseline: 'middle' as CanvasTextBaseline, // 文字对齐基线
  textAlign: 'center' as CanvasTextAlign, // 文字对齐方式
  longColor: isDark.value ? '#E5E7EB' : '#374151', // 长线段颜色
  shortColor: isDark.value ? '#9CA3AF' : '#6B7280', // 短线段颜色
  textColor: isDark.value ? '#E5E7EB' : '#374151', // 文字颜色
  subTextColor: isDark.value ? '#9CA3AF' : '#6B7280', // 小文字颜色
  focusColor: isDark.value ? '#6D28D9' : '#C4B5FD' // 选中元素区间
}))
const canvasAttr = reactive({
  width: 0,
  height: 0
})
const canvasStyle = computed(() => {
  return {
    width: `${canvasAttr.width / canvasConfigs.value.ratio}px`,
    height: `${canvasAttr.height / canvasConfigs.value.ratio}px`
  }
})
function updateTimeLine() {
  drawTimeLine(
    canvasContext,
    { ...props } as UserConfig,
    { ...canvasAttr, ...canvasConfigs.value } as CanvasConfig
  )
}
function setCanvasContext() {
  if (timeLine.value === undefined) return
  canvasContext = timeLine.value.getContext('2d') as CanvasRenderingContext2D
  canvasContext.font = `${
    canvasConfigs.value.textSize * canvasConfigs.value.ratio
  }px -apply-system, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif`
  canvasContext.lineWidth = canvasConfigs.value.lineWidth
  canvasContext.textBaseline = canvasConfigs.value.textBaseline
  canvasContext.textAlign = canvasConfigs.value.textAlign
}

function setCanvasRect() {
  if (canvasContainer.value === undefined) return
  const { width, height } = canvasContainer.value.getBoundingClientRect()
  canvasAttr.width = width * canvasConfigs.value.ratio
  canvasAttr.height = height * canvasConfigs.value.ratio
  nextTick(() => {
    setCanvasContext()
    updateTimeLine()
  })
}

onMounted(() => {
  setCanvasRect()
})
watch(props, updateTimeLine)
watch(canvasConfigs, updateTimeLine)
const sideBarState = useSideBarState()
watch(
  () => sideBarState.isClosed,
  () => {
    setTimeout(() => {
      setCanvasRect()
    }, 500)
  }
)
window.addEventListener('resize', setCanvasRect, false)
</script>

<style lang="scss" scoped>
.canvasContainer {
  position: sticky;
  top: 0;
  right: 0;
  left: 0;
  z-index: 9;
  height: 1.25rem;
}
</style>
