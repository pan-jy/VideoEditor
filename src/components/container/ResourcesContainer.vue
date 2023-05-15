<template>
  <el-menu :collapse="true" :default-active="0">
    <el-menu-item
      v-for="(menuItem, index) in menuList"
      :key="index"
      :index="index"
    >
      <div style="display: flex; flex-direction: column; line-height: normal">
        <el-icon>
          <component :is="menuItem.icon" />
        </el-icon>
        <span>{{ menuItem.title }}</span>
      </div>
      <!-- <template #title>{{ menuItem.title }}</template> -->
    </el-menu-item>
  </el-menu>
  <div class="resources">
    <header class="resources-header">
      <span class="resources-header-title">音频</span>
      <el-icon style="cursor: pointer"><Fold /></el-icon>
    </header>
    <main class="resources-main"></main>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { menuItem } from '~/datas/resources'
import { Fold } from '@element-plus/icons-vue'

const menuList = reactive(menuItem)
</script>

<style lang="scss" scoped>
@import url('~/styles/mixins');

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

  &-header {
    @include header;

    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
  }
}
</style>
