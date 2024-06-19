<script setup lang="ts">
const isCollapsed = ref(false)
const { t } = useI18n()

function toggleCollapsed() {
  isCollapsed.value = !isCollapsed.value
}

const links = computed(() => [
  [{
    label: t("title./"),
    icon: "i-tabler-home",
    to: "/",
  }], [{
    label: t("title./forward"),
    icon: "i-tabler-polygon",
    to: "/forward",
  }],
])
</script>

<template>
  <aside
    class="h-full flex flex-col justify-between overflow-x-hidden border-gray-300 dark:border-gray-600 border-r p-2 transition-[width] ease-in-out"
    :class="`${isCollapsed ? 'w-16' : 'w-56'}`"
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
        :name="`layout-sidebar-left-${(isCollapsed?'expand':'collapse')}`"
        class="container w-7 h-7 flex-shrink-0 transition"
      />
      <div class="truncate">
        {{ $t("text.menu.collapse") }}
      </div>
    </LazyUButton>
  </aside>
</template>
