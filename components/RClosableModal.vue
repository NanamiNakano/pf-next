<script setup lang="ts">
const model = defineModel<boolean>()
defineProps<{
  title?: string
}>()
</script>

<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            {{ title }}
          </div>
          <UButton
            icon="i-tabler-x"
            @click="model = false"
          />
        </div>
      </template>
      <slot />
      <template
        v-if="!!$slots.footer"
        #footer
      >
        <slot name="footer" />
      </template>
    </UCard>
  </UModal>
</template>
