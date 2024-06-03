<script setup lang="ts">
import type { PfClient } from "@nanaminakano/pfsdk"

const { $pfClient } = useNuxtApp() as unknown as { $pfClient: PfClient }

const globalTitle = useState("globalTitle", () => "PortForward")
await callOnce(async () => {
  await $pfClient.system.getSettings().then((settings) => {
    globalTitle.value = settings.Data ? settings.Data.site_name : "PortForward"
  })
})

useSeoMeta({
  titleTemplate: `%s | ${globalTitle.value}`,
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
