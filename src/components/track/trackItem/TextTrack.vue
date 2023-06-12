<template>
  <div class="text">
    <el-icon><EditPen /></el-icon>
    <span class="content">{{ trackItem.content }}</span>
  </div>
</template>

<script setup lang="ts">
import { EditPen } from '@element-plus/icons-vue'
import { TextTrackItem } from '~/types/tracks'
defineProps<{ trackItem: TextTrackItem }>()
</script>

<style lang="scss" scoped>
.text {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1px 5px;
  font-size: 0.9rem;
  background-color: var(--ep-color-error-light-5);

  .ep-icon {
    margin-right: 10px;
  }

  .content {
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
