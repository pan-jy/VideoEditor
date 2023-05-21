<template>
  <el-menu class="menu" :collapse="true" :default-active="0">
    <el-menu-item
      v-for="(menuItem, index) in menuList"
      :key="index"
      :index="index"
      @click="test(index)"
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
      v-show="isClosed"
      @click="$emit('update:isClosed', !isClosed)"
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
const props = defineProps<{
  activeIndex: number
  menuList: MenuItem[]
  isClosed: boolean
}>()
const emit = defineEmits(['update:activeIndex', 'update:isClosed'])
let oldIdx = toRaw(props.activeIndex)
function test(index: number) {
  emit('update:activeIndex', index)
  emit('update:isClosed', oldIdx === index ? !props.isClosed : false)
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
