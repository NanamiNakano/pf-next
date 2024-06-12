<script setup lang="ts">
const siteSetting = useSiteSettingStore()
const userData = useUserDataStore()
const toast = useToast()
const { t } = useI18n()
const emit = defineEmits(["toggleMenu"])

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
    click: () => logout(),
  }],
])

const showMenu = ref(false)
const computedMenuIcon = computed(() => {
  return showMenu.value ? "x" : "menu-2"
})

function toggleMenu() {
  showMenu.value = !showMenu.value
  emit("toggleMenu", showMenu.value)
}
</script>

<template>
  <div>
    <header class="w-full border-gray-300 dark:border-gray-600 border-b">
      <div class="flex mx-auto justify-between items-center px-8 h-14">
        <div class="flex shrink items-center space-x-2 min-w-11">
          <LazyUButton
            square
            variant="ghost"
            color="gray"
            class="md:hidden"
            @click="toggleMenu"
          >
            <TablerIcon
              :name="computedMenuIcon"
              class="w-6 h-6"
            />
          </LazyUButton>
          <p class="text-xl truncate">
            {{ siteSetting.siteSetting.site_name }}
          </p>
        </div>
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
                  {{ t("text.login.loggedIn") }}
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
  </div>
</template>

<style scoped>

</style>
