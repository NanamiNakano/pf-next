<script setup lang="ts">
const siteSetting = useSiteSettingStore()
const userData = useUserDataStore()
const toast = useToast()
const { t } = useI18n()

async function logout() {
  try {
    localStorage.removeItem("Authorization")
    toast.add({ title: t("text.login.toast.logout.ok.title") })
    await navigateTo("/login")
  }
  catch (_) {
    toast.add({ title: t("text.login.toast.logout.error.title"), color: "red" })
  }
}

const avatarDropdown = computed(() => [
  [{
    label: userData.userData.username,
    slot: "account",
    disabled: true,
  }], [{
    label: t("text.header.info"),
    icon: "i-tabler-info-square",
  }, {
    label: t("text.header.logout"),
    icon: "i-tabler-logout",
    click: () => logout()
  }],
])
</script>

<template>
  <header class="border-gray-300 dark:border-gray-600 border-b">
    <div class="flex mx-auto justify-between items-center px-8 h-14">
      <p class="text-xl"> {{ siteSetting.siteSetting.site_name }}</p>
      <div class="flex items-center space-x-2">
        <ThemeSwitch />
        <LanguageSwitch />
        <UDropdown
          :items="avatarDropdown"
          :ui="{ item: { disabled: 'cursor-text select-text' } }"
          :popper="{ placement: 'auto' }"
        >
          <UAvatar
            :alt="userData.userData.name"
            size="md"
          />

          <template #account="{ item }">
            <div class="text-left">
              <p>
                {{ t("text.login.loggedIn")}}
              </p>
              <p class="truncate font-medium text-gray-900 dark:text-white">
                {{ item.label }}
              </p>
            </div>
          </template>


        </UDropdown>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>
