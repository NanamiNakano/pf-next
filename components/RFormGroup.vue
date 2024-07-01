<script lang="ts" setup>
defineProps<{
  title?: string
}>()
</script>

<template>
  <UFormGroup>
    <template #label>
      <div class="text-gray-400 font-bold">
        {{ title }}
      </div>
    </template>
    <slot />
  </UFormGroup>
</template>
