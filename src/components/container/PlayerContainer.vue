<template>
  <div class="player">
    <header class="player-header">
      <span>播放器</span>
    </header>
    <main class="player-main">
      <!-- <video src="/video/video_1.mp4" controls autoplay></video> -->
    </main>
    <footer class="player-footer">
      <span class="player-footer-time">00:00:00 / 00:00:00</span>
      <el-icon v-if="true"><VideoPlay /></el-icon>
      <el-icon v-else><VideoPause /></el-icon>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { VideoPause, VideoPlay } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
@import '~/styles/mixins.scss';

.player {
  $video-min-width: 540px;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: $video-min-width;
  min-height: calc($video-min-width / 1.78 + 80px);
  overflow: hidden;

  &-header {
    @include header;

    overflow: hidden;
  }

  &-main {
    display: flex;
    flex: 1;
    align-items: center;
    width: 100%;
    video {
      width: inherit;
    }
  }

  &-footer {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    border-top: solid 1px var(--ep-border-color);
    span {
      font-size: 13px;
    }
    i {
      position: absolute;
      left: 50%;
      font-size: 28px;
      cursor: pointer;
      opacity: 0.8;
      transform: translateX(-50%);
    }
  }
}
</style>
