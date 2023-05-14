<template>
  <Header />
  <main>
    <Side />
  </main>
</template>

<script setup lang="ts"></script>
<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  main {
    display: flex;
    flex: 1;
  }
}
</style>
