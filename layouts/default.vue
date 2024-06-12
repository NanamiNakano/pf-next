<script setup lang="ts">

</script>

<template>
  <div class="h-screen bg-gray-100 dark:bg-gray-950">
    <AppHeader class="fixed w-full top-0 z-10 bg-gray-100 dark:bg-gray-950" />
    <div class="flex h-full pt-14">
      <AppMenu class="z-10 h-full flex-none" />
      <div class="relative overflow-y-scroll flex flex-col w-full min-h-full justify-between">
        <div class="p-2">
          <slot />
        </div>
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
