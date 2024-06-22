<script lang="ts" setup>
const model = defineModel<boolean>()
</script>

<template>
  <USlideover v-model="model">
    <div class="p-4 flex-1 overflow-y-scroll">
      <div class="flex justify-end">
        <UButton
          color="gray"
          icon="i-tabler-x"
          padded
          size="sm"
          square
          variant="ghost"
          @click="model = false"
        />
      </div>
      <slot />
    </div>
  </USlideover>
</template>
