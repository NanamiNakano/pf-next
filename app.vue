<script setup lang="ts">
import type { PfClient } from "@nanaminakano/pfsdk"

const { $pfClient } = useNuxtApp() as unknown as { $pfClient: PfClient }

const siteSettings = await $pfClient.system.getSettings()

useSeoMeta({
  titleTemplate: `%s | ${siteSettings.Data?.site_name}`,
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
