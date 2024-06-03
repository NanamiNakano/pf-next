<script setup lang="ts">
defineProps({
  name: String,
})
</script>

<template>
  <UIcon
    :name="`tabler:${name}`"
    dynamic
  />
</template>
