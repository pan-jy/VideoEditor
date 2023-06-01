<template>
  <div class="text-item" :style="style">
    {{ textItem.name }}
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { TextItem } from '~/types/resources'
const props = defineProps<{ textItem: TextItem }>()

const style = {
  fontFamily: `${props.textItem.name}, sans-serif`
}
onMounted(() => {
  const style = document.createElement('style')
  style.textContent = `
    @font-face {
      font-family: ${props.textItem.name};
      src: url(${props.textItem.source}) format(${props.textItem.format});
    }
  `
  document.head.appendChild(style)
})
</script>

<style lang="scss" scoped>
.text-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  overflow: hidden;
  font-size: 1.5rem;
  color: var(--ep-text-color-primary);
  background-color: var(--ep-fill-color);
  border: 1px solid transparent;
  border-radius: 5px;
  transition: border 0.3s ease;

  &:hover {
    border-color: var(--ep-color-primary-light-3);
  }
}
</style>
