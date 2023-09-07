import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { ItemAttr } from '~/types/attributes'

export type AttrMap = Map<number, ItemAttr>

export const useAttrStore = defineStore('attrStore', () => {
  const attrMap: Map<number, ItemAttr> = reactive(new Map())

  function patchAttrMap(newAttrMap: Map<number, ItemAttr>) {
    newAttrMap.forEach((attr, id) => {
      attrMap.set(id, attr)
    })
  }

  return { attrMap, patchAttrMap }
})
