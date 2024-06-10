<script setup lang="ts">
const siteSetting = useSiteSettingStore()
const userData = useUserDataStore()
</script>

<template>
  <header class="outline outline-1 outline-offset-0 outline-gray-400">
    <div class="flex mx-auto justify-between items-center px-8 h-14">
      <p>{{ siteSetting.siteSetting.site_name }}</p>
      <div class="flex items-center space-x-2">
        <ThemeSwitch />
        <LanguageSwitch />
        <UAvatar
          :alt="userData.userData.name"
          size="md"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>
