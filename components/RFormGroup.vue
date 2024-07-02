<script lang="ts" setup>
defineProps<{
  title?: string
  name?: string
}>()
</script>

<template>
  <UFormGroup
    :name
  >
    <template #label>
      <div class="text-gray-400 font-bold">
        {{ title }}
      </div>
    </template>
    <slot />
  </UFormGroup>
</template>
