import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { ItemAttr } from '~/types/attributes'

export const useAttrState = defineStore('attrState', () => {
  const attrMap: Map<number, ItemAttr> = reactive(new Map())
  return { attrMap }
})
