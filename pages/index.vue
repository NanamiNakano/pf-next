<script setup lang="ts">
const { setLocale } = useI18n()
</script>

<template>
  <div>
    <UButton @click="setLocale('en')">
      EN
    </UButton>
    <UButton @click="setLocale('cn')">
      CN
    </UButton>
    <ThemeSwitch />
  </div>
</template>

<style scoped>

</style>
