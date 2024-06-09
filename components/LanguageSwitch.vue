<script setup lang="ts">
const { setLocale, getLocaleCookie } = useI18n()
const currentLocale = computed(() => (getLocaleCookie()))
const items = computed(() => ([
  [{
    label: "中文",
    labelClass: "zh-CN",
    disabled: currentLocale.value === "zh-CN",
    click: () => {
      setLocale("zh-CN")
    },
  }],
  [{
    label: "English",
    labelClass: "en-GB",
    disabled: currentLocale.value === "en-GB",
    click: () => {
      setLocale("en-GB")
    },
  }],
]))
</script>

<template>
  <UDropdown
    :items="items"
    :ui="{ item: { disabled: 'cursor-not-allowed' } }"
    :popper="{ placement: 'auto' }"
  >
    <UButton
      variant="ghost"
      color="gray"
    >
      <TablerIcon
        name="language-hiragana"
        class="h-6 w-6"
      />
    </UButton>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <TablerIcon
        v-if="item.labelClass === currentLocale"
        name="check"
        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
      />
    </template>
  </UDropdown>
</template>
