<template>
  <div
    class="resources"
    :class="{ 'resources--closed': sideBarStore.isClosed }"
  >
    <header class="resources-header">
      <span class="resources-header-title">
        {{ title }}
      </span>
      <div class="resources-header-icon">
        <el-icon :class="{ 'is-loading': isLoading }" @click="$emit('refresh')">
          <Refresh />
        </el-icon>
        <el-icon @click="sideBarStore.setIsClosed()">
          <Fold />
        </el-icon>
      </div>
    </header>
    <main class="resources-main">
      <div v-for="subList in resourcesList" :key="subList.title">
        <ResourcesSubList :resourcesSubList="subList" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Fold, Refresh } from '@element-plus/icons-vue'
import type { ResourcesList } from '~/types/resources'
import { useSideBarStore } from '~/stores/sideBarStore'
const sideBarStore = useSideBarStore()

defineProps<{
  isLoading: boolean
  title: string
  resourcesList: ResourcesList
}>()

defineEmits(['refresh'])
</script>

<style lang="scss" scoped>
@import '~/styles/mixins.scss';

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
