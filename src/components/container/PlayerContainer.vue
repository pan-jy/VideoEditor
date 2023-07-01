<template>
  <div class="player">
    <header class="player-header">
      <span>播放器</span>
    </header>
    <main class="player-main">
      <Player />
    </main>
    <footer class="player-footer">
      <PlayerControl />
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import '~/styles/mixins.scss';

.player {
  $video-min-width: 360px;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: $video-min-width;
  min-height: calc($video-min-width / 1.78 + 80px);
  overflow: hidden;

  &-header {
    @include header;
    flex-shrink: 0;

    overflow: hidden;
  }

  &-main {
    display: flex;
    flex: 1;
    align-items: center;
    width: 100%;
  }

  &-footer {
    flex-shrink: 0;
    height: 40px;
    border-top: solid 1px var(--ep-border-color);
  }
}
</style>
