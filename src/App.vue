<template>
  <el-config-provider namespace="ep">
    <HeaderContainer />
    <div class="content">
      <ResourcesContainer :width="width" />
      <main class="content-main">
        <div class="content-main-top">
          <PlayerContainer />
          <AttributesContainer />
        </div>
        <TracksContainer />
      </main>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()
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
</style>
