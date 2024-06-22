<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const color = computed(() => {
  if (props.status === "Exhaust" || props.status === "Error" || props.status === "Suspend" || props.status === "Banned") {
    return "red"
  }
  else if (props.status === "Disabled" || props.status === "Sync") {
    return "amber"
  }
  else {
    return "primary"
  }
})
</script>

<template>
  <UBadge
    :color="color"
  >
    {{ $t(`r.badge.${status}`) }}
  </UBadge>
</template>
