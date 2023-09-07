<template>
  <header class="track-header">
    <div class="track-header-left">
      <el-tooltip
        v-for="item in trackHeaderMenu"
        :key="item.title"
        :content="item.title"
      >
        <el-button
          :disabled="
            (item.type === 'undo' && historyStore.historyIdx === 0) ||
            (historyStore.historyIdx === historyStore.history.length - 1 &&
              item.type === 'redo')
          "
          :icon="item.icon"
          @click="operation(item.type)"
          circle
        />
      </el-tooltip>
    </div>
    <div class="track-header-right">
      <el-slider
        :max="10"
        :min="1"
        show-input
        v-model="trackStore.scale"
        size="small"
        :format-tooltip="(v: number) => `帧数 X ${v}`"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { trackHeaderMenu } from '~/config/baseMenu'
import { useHistoryStore } from '~/stores/historyStore'
import { useTrackStore } from '~/stores/trackStore'

const trackStore = useTrackStore()
const historyStore = useHistoryStore()

function operation(type: string) {
  if (type === 'redo') {
    historyStore.redo()
  } else if (type === 'undo') {
    historyStore.undo()
  } else if (type === 'delete') {
    const focusedItemIdx = trackStore.focusedItemIdx
    if (focusedItemIdx === undefined) return
    trackStore.focusedItem = undefined
    trackStore.removeTrackItem(
      focusedItemIdx.lineIdx,
      focusedItemIdx.itemIdx,
      true
    )
  }
}
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
