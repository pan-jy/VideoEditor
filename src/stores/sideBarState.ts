import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'

export const useSideBarState = defineStore('sideBarState', () => {
  const isClosed = ref(false)
  const { width } = useWindowSize()

  watch(
    width,
    (val) => {
      isClosed.value = val <= 1000
    },
    { immediate: true }
  )

  function setIsClosed(val = !isClosed.value) {
    isClosed.value = val
  }

  return {
    isClosed,
    setIsClosed
  }
})
