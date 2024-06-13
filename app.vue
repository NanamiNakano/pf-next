<script setup lang="ts">
import { useSiteSettingStore } from "~/stores/siteSetting"

const pfClient = usePfClient()

const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const siteSetting = useSiteSettingStore()
const userData = useUserDataStore()
const pageTitle = computed(() => {
  return `${t(`title.${route.path}`)} | ${siteSetting.siteSetting.site_name ? siteSetting.siteSetting.site_name : "PortForward"}`
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

onMounted(async () => {
  if (!siteSetting.siteSetting.site_name) {
    await siteSetting.fetch()
  }
  if (localStorage.getItem("Authorization")) {
    await userData.fetch()
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
