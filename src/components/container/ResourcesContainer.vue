<template>
  <MenuList
    :menuList="sideBarMenu"
    v-model:activeIndex="activeIndex"
    v-model:isClosed="isClosed"
  />
  <ResourcesList
    :resourcesList="allResources[activeIndex]"
    :title="sideBarMenu[activeIndex].title"
    :isLoading="isLoading"
    v-model:isClosed="isClosed"
    @refresh="refreshResources"
  />
</template>

<script lang="ts" setup>
import { sideBarMenu } from '~/datas/baseMenu'
import { watch, ref, reactive } from 'vue'
import { getResources } from '~/request/apis/resources'
import type { ResourcesList } from '~/types/resources'

const props = defineProps<{
  width: number
}>()

// 当视口宽度小于 1000 时自动收缩资源栏
const isClosed = ref(false)
watch(
  () => props.width,
  (val) => {
    isClosed.value = val <= 1000
  },
  { immediate: true }
)

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
