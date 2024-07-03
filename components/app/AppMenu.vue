<script lang="ts" setup>
const isCollapsed = ref(false)
const { t } = useI18n()
const userData = useUserDataStore()

function toggleCollapsed() {
  isCollapsed.value = !isCollapsed.value
}

const links = computed(() => {
  if (userData.userData.permission && userData.userData.permission === 2) {
    return [[{
      label: t("title./"),
      icon: "i-tabler-home",
      to: "/",
    }], [{
      label: t("title./forward"),
      icon: "i-tabler-polygon",
      to: "/forward",
    }, {
      label: t("title./nat"),
      icon: "i-tabler-route-square",
      to: "/nat",
    }], [{
      label: "Preference",
      icon: "i-tabler-mood-cog",
      to: "/preference",
    }, {
      label: t("title./settings"),
      icon: "i-tabler-settings",
      to: "/settings",
    }]]
  }

  return [[{
    label: t("title./"),
    icon: "i-tabler-home",
    to: "/",
  }], [{
    label: t("title./forward"),
    icon: "i-tabler-polygon",
    to: "/forward",
  }, {
    label: t("title./nat"),
    icon: "i-tabler-route-2",
    to: "/nat",
  }], [{
    label: t("title./preference"),
    icon: "i-tabler-mood-cog",
    to: "/preference",
  }]]
})
</script>

<template>
  <aside
    :class="`${isCollapsed ? 'w-16' : 'w-56'}`"
    class="h-full flex flex-col justify-between overflow-x-hidden border-gray-300 dark:border-gray-600 border-r p-2 transition-[width] ease-in-out"
  >
    <UVerticalNavigation
      :links="links"
      :ui="{
        icon: {
          base: 'flex-shrink-0 w-7 h-7 relative',
        },
      }"
    />
    <LazyUButton
      class="hidden md:flex"
      @click="toggleCollapsed"
    >
      <TablerIcon
        :name="`layout-sidebar-left-${(isCollapsed?'expand':'collapse')}-filled`"
        class="container w-7 h-7 flex-shrink-0 transition"
      />
      <div class="truncate">
        {{ $t("text.menu.collapse") }}
      </div>
    </LazyUButton>
  </aside>
</template>
