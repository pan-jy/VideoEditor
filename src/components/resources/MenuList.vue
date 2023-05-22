<template>
  <el-menu class="menu" :collapse="true" :default-active="0">
    <el-menu-item
      v-for="(menuItem, index) in menuList"
      :key="index"
      :index="index"
      @click="itemClick(index)"
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
    <el-menu-item
      v-show="sideBarState.isClosed"
      @click="sideBarState.setIsClosed()"
    >
      <div class="menu-item">
        <el-icon style="cursor: pointer"><Expand /></el-icon>
      </div>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { Expand } from '@element-plus/icons-vue'
import { toRaw } from 'vue'
import type { MenuItem } from '~/types/resources'
import { useSideBarState } from '~/stores/sideBarState'
const sideBarState = useSideBarState()

const props = defineProps<{
  activeIndex: number
  menuList: MenuItem[]
}>()
const emit = defineEmits(['update:activeIndex'])
let oldIdx = toRaw(props.activeIndex)
function itemClick(index: number) {
  emit('update:activeIndex', index)
  sideBarState.setIsClosed(oldIdx === index ? !sideBarState.isClosed : false)
  oldIdx = index
}
</script>

<style lang="scss" scoped>
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
</style>
