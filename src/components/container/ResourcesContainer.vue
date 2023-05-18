<template>
  <el-menu class="menu" :collapse="true" :default-active="0">
    <el-menu-item
      v-for="(menuItem, index) in menuList"
      :key="index"
      :index="index"
      @click="itemClick"
    >
      <div class="menu-item">
        <el-icon>
          <component :is="menuItem.icon" />
        </el-icon>
        <span>{{ menuItem.title }}</span>
      </div>
      <!-- <template #title>{{ menuItem.title }}</template> -->
    </el-menu-item>
    <div style="flex-grow: 1"></div>
    <!-- 列表收起时底部显示 -->
    <el-menu-item v-show="isClosed" @click="toggle()">
      <div class="menu-item">
        <el-icon style="cursor: pointer"><Expand /></el-icon>
      </div>
    </el-menu-item>
  </el-menu>
  <div class="resources" :class="{ 'resources--closed': isClosed }">
    <header class="resources-header">
      <span class="resources-header-title">
        {{ menuList[activeIndex].title }}
      </span>
      <div class="resources-header-icon">
        <el-icon
          :class="{ 'is-loading': refreshing }"
          @click="refreshResources(activeIndex)"
        >
          <Refresh />
        </el-icon>
        <el-icon @click="toggle()"><Fold /></el-icon>
      </div>
    </header>
    <main class="resources-main">
      <ResourcesList :resourcesList="allResources[activeIndex]" />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { menuList } from '~/datas/resources'
import { Fold, Expand, Refresh } from '@element-plus/icons-vue'
import { useToggle } from '@vueuse/core'
import { watch, ref, reactive, onMounted } from 'vue'
import { getResources } from '~/request/apis/resources'
import type { ResourcesList } from '~/datas/types/resources'

const [isClosed, toggle] = useToggle()

const props = defineProps<{
  width: number
}>()

// 当视口宽度小于 1000 时自动收缩资源栏
watch(
  () => props.width,
  (val) => {
    isClosed.value = val <= 1000
  },
  { immediate: true }
)

const activeIndex = ref(0)
const allResources = reactive<ResourcesList[]>([])
// 刷新列表资源
const refreshing = ref(false)
async function refreshResources(index: number) {
  refreshing.value = true
  allResources[index] = await getResources(menuList[index].type)
  // 模拟
  setTimeout(() => {
    refreshing.value = false
  }, 500)
}
async function itemClick(e: typeof import('element-plus/es')['ElMenuItem']) {
  activeIndex.value = e.index
  isClosed.value = false
  if (allResources[activeIndex.value] === undefined)
    refreshResources(activeIndex.value)
}

onMounted(async () => {
  if (!isClosed.value) refreshResources(0)
})
</script>

<style lang="scss" scoped>
@import '~/styles/mixins.scss';

.menu {
  display: flex;
  flex-direction: column;

  &-item {
    display: flex;
    flex-direction: column;
    line-height: normal;
  }
}

.ep-menu-item.is-active {
  position: relative;
  background-color: var(--ep-menu-hover-bg-color);

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    content: '';
    background-color: var(--ep-menu-active-color);
  }
}

.resources {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 300px;
  height: 100%;
  overflow: hidden;
  border-right: solid 1px var(--ep-border-color);
  transition: all 0.5s ease;

  &--closed {
    width: 0;
    color: transparent;
    border-width: 0;
  }

  &-header {
    @include header;

    justify-content: space-between;
    font-size: 18px;

    .ep-icon {
      cursor: pointer;

      &:not(:first-of-type) {
        margin-left: 10px;
      }
    }
  }

  &-main {
    flex: 1;
    overflow: auto;
  }
}
</style>
