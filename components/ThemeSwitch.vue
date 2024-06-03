<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference === "light" ? colorMode.preference = "dark" : colorMode.preference = "light"
}

const computedIcon = computed(() => {
  return colorMode.preference === "light" ? "moon" : "sun"
})
</script>

<template>
  <UButton
    variant="ghost"
    color="gray"
    @click="toggleColorMode"
  >
    <TablerIcon
      :name="computedIcon"
      class="h-8 w-8"
    />
  </UButton>
</template>
