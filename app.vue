<script setup lang="ts">
const pfClient = usePfClient()

const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const siteSetting = useSiteSettingStore()
const userData = useUserDataStore()
const pageTitle = computed(() => {
  return `${t(`title.${route.path}`)} | ${siteSetting.siteSetting.site_name}`
})

useHead({
  title: pageTitle,
})

onBeforeMount(async () => {
  if (route.path !== "/login" && route.path !== "/signup") {
    if (!localStorage.getItem("Authorization")) {
      toast.add({ title: t("text.index.toast.notLogged.title"), color: "red" })
      await navigateTo("/login")
    }
  }
})

onMounted(async () => {
  pfClient.user.getData().then(async (rps) => {
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

  if (!siteSetting.siteSetting.version) {
    siteSetting.fetch()
  }

  if (localStorage.getItem("Authorization")) {
    userData.fetch()
  }
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>
