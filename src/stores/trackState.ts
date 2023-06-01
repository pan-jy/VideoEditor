import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTrackState = defineStore('trackState', () => {
  const scale = ref(1)

  return {
    scale
  }
})
