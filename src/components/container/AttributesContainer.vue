<template>
  <div class="attribute">
    <header class="attribute-header">
      <span>属性</span>
    </header>
    <article class="attribute-form">
      <AttrForm />
    </article>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import '~/styles/mixins.scss';

.attribute {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  width: 300px;
  height: 100%;

  &-header {
    @include header;
    width: 95%;
    padding: 0;
  }

  &-form {
    flex: 1;
    width: 95%;
    margin: 20px 0;
    overflow: hidden;
  }
}
</style>
