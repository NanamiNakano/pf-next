<script setup lang="ts">
const pfClient = usePfClient()

const route = useRoute()
const getRouteBaseName = useRouteBaseName()
const { t } = useI18n()
const globalTitle = useState("globalTitle", () => "PortForward")
const pageTitle = computed(() => {
  return `${t(`title.${getRouteBaseName(route)}`)} | ${globalTitle.value}`
})

await callOnce(async () => {
  await pfClient.system.getSettings().then((settings) => {
    globalTitle.value = settings.Data ? settings.Data.site_name : "PortForward"
  })
})

useHead({
  title: () => pageTitle.value,
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>
