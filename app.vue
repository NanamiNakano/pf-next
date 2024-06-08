<script setup lang="ts">
const pfClient = usePfClient()

const route = useRoute()
const { t } = useI18n()
const globalTitle = useState("globalTitle", () => "PortForward")
const loggedIn = useState("loggedIn")
const sessionCookie = useCookie("session_id")
const pageTitle = computed(() => {
  return `${t(`title.${route.path}`)} | ${globalTitle.value}`
})

await callOnce(async () => {
  await pfClient.system.getSettings().then((settings) => {
    globalTitle.value = settings.Data ? settings.Data.site_name : "PortForward"
  })
  loggedIn.value = !!sessionCookie.value
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
