<template>
  <el-config-provider namespace="ep">
    <HeaderContainer />
    <div class="content">
      <ResourcesContainer />
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

<script setup lang="ts"></script>
<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .content {
    display: flex;
    flex: 1;

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
