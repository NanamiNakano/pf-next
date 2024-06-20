<script setup lang="ts">
import type { QueryParams } from "@nanaminakano/pfsdk"

const props = defineProps<{
  filters: {
    key: string
    label: string
    select?: { key: number, label: string }[]
  }[]
}>()
const emit = defineEmits(["search"])

const search = ref("")
const precisely = ref(true)
const params = computed(() => {
  return {
    filter: props.filters[filterKey.value].key,
    search: search.value,
    exact: precisely.value,
  } as QueryParams
})

const filterKey = ref(0)
const dropdown = computed(() => {
  return props.filters.map((item, index) => ({
    key: item.key,
    label: item.label,
    click: () => {
      filterKey.value = index
      if (props.filters[index].select) {
        precisely.value = true
      }
    },
  }))
})
</script>

<template>
  <div class="flex space-x-2 items-center">
    <UDropdown :items="[dropdown]">
      <UButton
        color="white"
        :label="`${filters[filterKey].label}`"
        trailing-icon="i-tabler-chevron-down"
      />
    </UDropdown>
    <TablerIcon name="equal" />
    <UDropdown
      v-if="filters[filterKey].select"
      :items="[filters[filterKey].select!]"
    />
    <UInput
      v-else
      v-model="search"
    />
    <UButton
      :label="$t('r.search.search')"
      @click="emit('search', params)"
    />
    <div>{{ $t("r.search.precisely") }}</div>
    <UToggle
      v-model="precisely"
      :disabled="!!filters[filterKey].select"
      on-icon="i-tabler-check"
      off-icon="i-tabler-x"
    />
  </div>
</template>
