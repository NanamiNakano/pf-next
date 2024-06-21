<script setup lang="ts">
import type { QueryParams } from "@nanaminakano/pfsdk"
import type { Filter } from "~/types/commons"

const props = defineProps<{
  filters: Record<string, Filter>
}>()
const emit = defineEmits(["search"])

const filterSelect = Object.entries(props.filters).map(([key, filter]) => ({ name: filter.label, value: key }))
const selectedFilter = ref(filterSelect[0].value)
const search = ref("")
const searchSelect = computed(() => {
  const select = props.filters[selectedFilter.value].select
  if (select) {
    return Object.entries(select).map(([key, label]) => ({ name: label, value: key }))
  }
  else {
    return []
  }
})
const precisely = ref(false)
watch(selectedFilter, () => {
  search.value = ""
  if (props.filters[selectedFilter.value].select) {
    precisely.value = true
  }
})
const params = computed(() => {
  return {
    filter: selectedFilter.value,
    search: search.value,
    exact: precisely.value,
  } as QueryParams
})
</script>

<template>
  <div class="flex space-x-2 items-center">
    <USelect
      v-model="selectedFilter"
      :options="filterSelect"
      option-attribute="name"
    />
    <TablerIcon name="equal" />
    <USelect
      v-if="!!props.filters[selectedFilter].select"
      v-model="search"
      :options="searchSelect"
      option-attribute="name"
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
      :disabled="!!props.filters[selectedFilter].select"
      on-icon="i-tabler-check"
      off-icon="i-tabler-x"
    />
  </div>
</template>
