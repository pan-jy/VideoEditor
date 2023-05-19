<template>
  <el-config-provider namespace="ep">
    <HeaderContainer />
    <main class="content">
      <ResourcesContainer :width="width" />
      <article class="content-main">
        <div class="content-main-top">
          <PlayerContainer />
          <el-divider direction="vertical" />
          <AttributesContainer />
        </div>
        <el-divider ref="dividerHorizontal">
          <el-icon><MoreFilled /></el-icon>
        </el-divider>
        <TracksContainer ref="trackContainer" />
      </article>
    </main>
  </el-config-provider>
</template>

<script setup lang="ts">
import { MoreFilled } from '@element-plus/icons-vue'
import { useWindowSize } from '@vueuse/core'
import { DefineComponent, onMounted, ref } from 'vue'
import { useResize } from '~/common/composables/useResizeElement'

const { width } = useWindowSize()
const dividerHorizontal = ref<DefineComponent | null>(null)
const trackContainer = ref<DefineComponent | null>(null)
onMounted(() => {
  if (dividerHorizontal.value === null || trackContainer.value === null) return
  useResize(dividerHorizontal.value.$el, trackContainer.value.$el)
})
</script>
<style lang="scss">
#app {
  display: flex;
  flex-direction: column;

  .content {
    display: flex;
    flex: 1;
    overflow: hidden;

    &-main {
      display: flex;
      flex: 1;
      flex-direction: column;

      &-top {
        display: flex;
        flex: 1;
      }
    }
  }
}

.ep-divider {
  margin: 0;
  &--horizontal {
    height: 0;
    cursor: row-resize;
  }
  &--vertical {
    position: relative;
    width: 0;
    height: 100%;
    // cursor: col-resize;

    // &::after {
    //   content: '···';
    //   writing-mode: vertical-lr;
    //   font-weight: bold;
    //   width: 17px;
    //   height: 54px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   background-color: var(--ep-bg-color);
    //   position: absolute;
    //   top: 50%;
    //   transform: translate(-50%, -50%);
    // }
  }

  &-disabled {
    cursor: not-allowed;
  }
}
</style>
