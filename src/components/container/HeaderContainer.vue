<script lang="ts" setup>
import { Sunny, Moon } from '@element-plus/icons-vue'
import { toggleDark, isDark } from '~/composables'
</script>

<template>
  <el-menu mode="horizontal" :ellipsis="false">
    <div class="flex-grow" />
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
.flex-grow {
  flex-grow: 1;
}

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
