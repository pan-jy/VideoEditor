<template>
  <aside class="icon-list" ref="iconList">
    <div
      v-for="item in showList"
      :key="item.id"
      class="icon"
      :style="{ height: trackHeight[item.type] }"
    >
      <el-icon>
        <component :is="iconMap.get(item.type)" />
      </el-icon>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { sideBarMenu } from '~/config/baseMenu'
import { trackHeight } from '~/config/tracks'
import { TrackItem } from '~/types/tracks'

const props = defineProps<{
  showList: Array<TrackItem>
  scrollTop: number
}>()

const iconList = ref<HTMLDivElement>()

watch(
  () => props.scrollTop,
  (val) => {
    if (!iconList.value) return
    iconList.value.scrollTop = val
  }
)

const iconMap = new Map()
sideBarMenu.forEach((item) => {
  iconMap.set(item.type, item.icon)
})
</script>

<style lang="scss" scoped>
.icon-list {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  height: 100%;
  overflow-y: hidden;
  border-top: 1.25rem solid var(--ep-bg-color);
  border-right: 1px solid var(--ep-border-color);

  .icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 5px 0;
    font-size: 1rem;
  }
}
</style>
