<script setup lang="ts">
const model = defineModel<boolean>()
</script>

<template>
  <USlideover v-model="model">
    <div class="p-4 flex-1">
      <UButton
        color="gray"
        variant="ghost"
        size="sm"
        icon="i-tabler-x"
        class="flex sm:hidden absolute end-5 top-5 z-10"
        square
        padded
        @click="model = false"
      />
      <slot />
    </div>
  </USlideover>
</template>
