<script setup lang="ts">

</script>

<template>
  <div class="h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
    <AppHeader />
    <div class="flex flex-1">
      <AppMenu />
      <div class="p-2">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
