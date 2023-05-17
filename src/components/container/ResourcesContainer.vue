<template>
  <el-menu class="menu" :collapse="true" :default-active="0">
    <el-menu-item
      v-for="(menuItem, index) in menuList"
      :key="index"
      :index="index"
      @click="menu.itemClick"
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
    <el-menu-item v-show="isClosed" @click="toggle()">
      <div class="menu-item">
        <el-icon style="cursor: pointer"><Expand /></el-icon>
      </div>
    </el-menu-item>
  </el-menu>
  <div class="resources" :class="{ 'resources--closed': isClosed }">
    <header class="resources-header">
      <span class="resources-header-title">
        {{ menuList[menu.activeIndex.value].title }}
      </span>
      <el-icon @click="toggle()" style="cursor: pointer"><Fold /></el-icon>
    </header>
    <main class="resources-main">
      <ResourcesList
        :resourcesList="menu.allResources[menu.activeIndex.value]"
      />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { menuList } from '~/datas/resources'
import { Fold, Expand } from '@element-plus/icons-vue'
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

const menu = {
  activeIndex: ref(0),
  allResources: reactive<ResourcesList[]>([]),
  async itemClick(e: typeof import('element-plus/es')['ElMenuItem']) {
    menu.activeIndex.value = e.index
    isClosed.value = false
    menu.allResources[menu.activeIndex.value] = await getResources(
      menuList[menu.activeIndex.value].type
    )
  }
}

onMounted(async () => {
  if (!isClosed) menu.allResources[0] = await getResources(menuList[0].type)
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
  }

  &-main {
    flex: 1;
    overflow: auto;
  }
}
</style>
