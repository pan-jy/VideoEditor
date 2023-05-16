<template>
  <div>
    <header>
      <span>{{ resources.title }}</span>
    </header>
    <div class="item" v-for="item in resources.items" :key="item.name">
      <!-- {{ item }} -->
      <el-image :src="item.cover" lazy />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResourcesList } from '~/datas/types/resources'
defineProps<{
  resources: ResourcesList extends Array<infer U> ? U : never
}>()
</script>

<style lang="scss" scoped>
@import url('~/styles/mixins');

header {
  @include header;

  box-sizing: content-box;
  margin: 0 10px;
  font-size: 15px;
}

.item {
  width: 66%;
  padding: 10px 20px;
}
</style>
