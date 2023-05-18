<template>
  <div class="track">
    <header class="track-header">
      <div class="track-header-left">
        <!-- <el-icon><ArrowLeftBold /></el-icon>
        <el-icon><ArrowRightBold /></el-icon>
        <el-icon><DeleteFilled /></el-icon> -->
        <el-tooltip
          v-for="item in headerBtns"
          :key="item.text"
          :content="item.text"
        >
          <el-button :icon="item.icon" circle />
        </el-tooltip>
      </div>
      <div class="track-header-right">
        <el-slider
          :max="10"
          :min="1"
          v-model="multiple"
          show-input
          size="small"
          :format-tooltip="(v: number) => `帧数 X ${v}`"
        />
      </div>
    </header>
    <main class="track-main">
      <aside class="track-main-aside"></aside>
      <article class="track-main-content">
        <div class="info">
          <el-icon size="20"><Files /></el-icon>
          <span>将资源拖拽到这里，开始编辑作品吧~</span>
        </div>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftBold,
  ArrowRightBold,
  DeleteFilled,
  Files
} from '@element-plus/icons-vue'
import { DefineComponent, ref } from 'vue'

const headerBtns: Array<{
  icon: DefineComponent
  text: string
}> = [
  {
    icon: ArrowLeftBold,
    text: '后退'
  },
  {
    icon: ArrowRightBold,
    text: '前进'
  },
  {
    icon: DeleteFilled,
    text: '删除'
  }
]
const multiple = ref(1)
</script>

<style lang="scss" scoped>
.track {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  height: 400px;
  min-height: 300px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid var(--ep-border-color);

    .ep-button {
      background-color: transparent;
      border: none;
    }

    &-right {
      width: 30%;
    }
  }

  &-main {
    display: flex;
    height: 100%;
    overflow-y: scroll;

    &-aside {
      width: 50px;
      height: 100%;
      border-right: 1px solid var(--ep-border-color);
    }

    &-content {
      position: relative;
      flex: 1;
      overflow-x: scroll;
    }
  }
}

.info {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
  height: 100px;
  margin: auto;
  font-size: 16px;
  background-color: var(--ep-fill-color);
  border: 2px solid var(--ep-border-color);
  border-radius: 10px;

  i {
    margin-right: 20px;
    transform: translateY(2px);
  }

  &:hover {
    border: 2px dashed var(--ep-color-primary);
  }
}
</style>
