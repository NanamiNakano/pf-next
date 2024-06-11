<script setup lang="ts">
const isCollapsed = ref(false)

function toggleCollapsed() {
  isCollapsed.value = !isCollapsed.value
}

const links = [{
  label: "Home",
  icon: "i-heroicons-home",
  to: "/",
}]
</script>

<template>
  <div
    class="h-full flex flex-col justify-between overflow-x-hidden border-gray-300 dark:border-gray-600 border-r p-2"
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
    <UButton @click="toggleCollapsed">
      <TablerIcon
        :name="`layout-sidebar-${isCollapsed ? 'right' : 'left'}-collapse`"
        class="container w-7 h-7 flex-shrink-0"
      />
      <p class="ml-1">
        Toggle
      </p>
    </UButton>
  </div>
</template>
