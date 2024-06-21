<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const color = computed(() => {
  if (props.status === "Exhaust" || props.status === "Error" || props.status === "Disabled") {
    return "red"
  }
  else if (props.status === "Suspend" || props.status === "Sync") {
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
