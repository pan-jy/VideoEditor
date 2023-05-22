<template>
  <MenuList :menuList="sideBarMenu" v-model:activeIndex="activeIndex" />
  <ResourcesList
    :resourcesList="allResources[activeIndex]"
    :title="sideBarMenu[activeIndex].title"
    :isLoading="isLoading"
    @refresh="refreshResources"
  />
</template>

<script lang="ts" setup>
import { sideBarMenu } from '~/datas/baseMenu'
import { watch, ref, reactive } from 'vue'
import { getResources } from '~/request/apis/resources'
import type { ResourcesList } from '~/types/resources'

const activeIndex = ref(0)
const allResources = reactive<ResourcesList[]>([])
const isLoading = ref(false)
// 刷新资源
async function refreshResources(index: number = activeIndex.value) {
  isLoading.value = true
  allResources[index] = await getResources(sideBarMenu[index].type)
  // 模拟
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}
watch(
  activeIndex,
  (val) => {
    if (allResources[val] === undefined) refreshResources(val)
  },
  { immediate: true }
)
</script>
