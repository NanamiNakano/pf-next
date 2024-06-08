<script setup lang="ts">

</script>

<template>
  <div>
    <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <slot />
    </div>
    <div class="flex fixed bottom-4 right-4">
      <LanguageSwitch />
      <ThemeSwitch />
    </div>
  </div>
</template>

<style scoped>

</style>
