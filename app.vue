<script setup lang="ts">
const pfClient = usePfClient()

const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const globalTitle = ref("PortForward")
const pageTitle = computed(() => {
  return `${t(`title.${route.path}`)} | ${globalTitle.value}`
})

await callOnce(async () => {
  await pfClient.system.getSettings().then((settings) => {
    globalTitle.value = settings.Data ? settings.Data.site_name : "PortForward"
  })
})

useHead({
  title: pageTitle,
})

onMounted(async () => {
  if (route.path !== "/login" && route.path !== "/signup") {
    if (!localStorage.getItem("Authorization")) {
      toast.add({ title: t("text.index.toast.notLogged.title"), color: "red" })
      await navigateTo("/login")
    }
    else {
      await pfClient.user.getData().then(async (rps) => {
        if (!rps.Ok) {
          localStorage.removeItem("Authorization")
          toast.add({
            title: t("text.index.toast.sessionExpired.title"),
            description: t("text.index.toast.sessionExpired.description"),
            color: "red",
          })
          await navigateTo("/login")
        }
      })
    }
  }
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
