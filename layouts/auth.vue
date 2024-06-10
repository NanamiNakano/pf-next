<script setup lang="ts">
const siteSetting = useSiteSettingStore()
</script>

<template>
  <div>
    <div class="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <p class="pb-4 text-xl">
        {{ siteSetting.siteSetting.site_name }}
      </p>
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
