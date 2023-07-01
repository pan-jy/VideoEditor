import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { ItemAttr } from '~/types/attributes'

export const useAttrStore = defineStore('attrStore', () => {
  const attrMap: Map<number, ItemAttr> = reactive(new Map())
  return { attrMap }
})
