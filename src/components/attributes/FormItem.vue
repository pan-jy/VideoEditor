<template>
  <div class="form-item">
    <span class="form-item_title">{{ title }}</span>
    <slot />
    <span class="form-item_units">{{ units }}</span>
    <slot class="form-item_value" name="value" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  units?: string
}>()
</script>

<style lang="scss" scoped>
.form-item {
  display: flex;
  align-items: center;
  margin: 10px 0;

  &_title {
    width: 40px;
    font-size: 0.5rem;
  }

  &_units,
  &_value {
    margin-left: 10px;
    font-size: 0.5rem;
  }
}
</style>
