<template>
  <header class="track-header">
    <div class="track-header-left">
      <el-tooltip
        v-for="item in trackHeaderMenu"
        :key="item.title"
        :content="item.title"
      >
        <el-button :icon="item.icon" circle />
      </el-tooltip>
    </div>
    <div class="track-header-right">
      <el-slider
        :max="10"
        :min="0"
        show-input
        v-model="trackState.scale"
        size="small"
        :format-tooltip="(v: number) => `帧数 X ${v}`"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { trackHeaderMenu } from '~/config/baseMenu'
import { useTrackState } from '~/stores/trackState'

const trackState = useTrackState()
</script>

<style lang="scss" scoped>
.track-header {
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
</style>
