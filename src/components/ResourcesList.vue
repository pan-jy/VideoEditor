<template>
  <div v-for="item in resourcesList" :key="item.title">
    <ResourcesItem :resources="item" />
  </div>
</template>

<script setup lang="ts">
import type { ResourcesList } from '~/datas/types/resources'
defineProps<{ resourcesList: ResourcesList }>()
</script>
