<template>
  <div class="line" ref="line">
    <div class="text" ref="text" :class="{ isScroll: diff < 0 }" :style="style">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
defineProps<{ content: string; style: Record<string, string> }>()

const line = ref<HTMLDivElement>()
const text = ref<HTMLSpanElement>()
const width = ref('')
const diff = ref(0)
onMounted(() => {
  if (!line.value || !text.value) return
  const lineW = line.value.offsetWidth
  width.value = `${lineW}px`
  const textW = text.value.offsetWidth
  diff.value = lineW - textW
})
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  overflow: hidden;
}

.text {
  width: fit-content;
  white-space: nowrap;
}

.isScroll {
  animation: scroll 5s linear infinite;
}

@keyframes scroll {
  0%,
  25% {
    transform: translateX(0);
  }

  75%,
  100% {
    transform: translateX(calc(v-bind(width) - 110%));
  }
}
</style>
