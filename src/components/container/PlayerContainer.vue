<template>
  <div class="player">
    <header class="player-header">
      <span>播放器</span>
    </header>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import url('~/styles/mixins');

.player {
  flex: 1;
  border-right: solid 1px var(--ep-border-color);

  &-header {
    @include header;

    overflow: hidden;
  }
}
</style>
