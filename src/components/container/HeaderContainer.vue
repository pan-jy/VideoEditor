<script lang="ts" setup>
import { Sunny, Moon } from '@element-plus/icons-vue'
import { toggleDark, isDark } from '~/common/composables/useDark'
</script>

<template>
  <el-menu mode="horizontal" :ellipsis="false">
    <div style="flex: 1" />
    <el-menu-item class="item" @click="toggleDark()">
      <el-button
        class="item__btn item__btn--none"
        :icon="isDark ? Moon : Sunny"
        circle
      />
    </el-menu-item>
    <el-menu-item class="item">
      <el-button class="item__btn" type="primary" disabled>导出</el-button>
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss" scoped>
.item {
  height: 40px;

  &__btn {
    cursor: pointer;
  }

  &__btn--none {
    background-color: transparent;
    border-style: none;
  }
}
</style>
