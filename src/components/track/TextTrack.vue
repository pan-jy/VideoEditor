<template>
  <div class="text">{{ trackItem.id }}</div>
</template>

<script setup lang="ts">
import { TextTrackItem } from '~/types/tracks'
defineProps<{ trackItem: TextTrackItem }>()
</script>

<style lang="scss" scoped>
.text {
  background-color: sandybrown;
}
</style>
