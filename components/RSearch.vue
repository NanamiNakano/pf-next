<script setup lang="ts">
import type { QueryParams } from "@nanaminakano/pfsdk"
import type { Filter } from "~/types/commons"

const props = defineProps<{
  filters: Filter[]
}>()
const emit = defineEmits(["search"])

const search = ref("")
const searchDropdownIndex = ref(0)
const precisely = ref(true)
const params = computed(() => {
  return {
    filter: props.filters[filterIndex.value].key,
    search: search.value,
    exact: precisely.value,
  } as QueryParams
})

const filterIndex = ref(0)
const dropdown = computed(() => {
  return props.filters.map((item, index) => ({
    key: item.key,
    label: item.label,
    click: () => {
      filterIndex.value = index
      search.value = ""
      if (props.filters[index].select) {
        precisely.value = true
      }
    },
  }))
})
const filterDropdown = computed(() => {
  return props.filters[filterIndex.value].select!.map((item, index) => ({
    key: item.key,
    label: item.label,
    click: () => {
      searchDropdownIndex.value = index
      search.value = item.key.toString()
    },
  }))
})
</script>

<template>
  <div class="flex space-x-2 items-center">
    <UDropdown :items="[dropdown]">
      <UButton
        color="white"
        :label="`${filters[filterIndex].label}`"
        trailing-icon="i-tabler-chevron-down"
      />
    </UDropdown>
    <TablerIcon name="equal" />
    <UDropdown
      v-if="filters[filterIndex].select"
      :items="[filterDropdown]"
    >
      <UButton
        color="white"
        :label="`${filterDropdown[searchDropdownIndex].label}`"
        trailing-icon="i-tabler-chevron-down"
      />
    </UDropdown>
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
      :disabled="!!filters[filterIndex].select"
      on-icon="i-tabler-check"
      off-icon="i-tabler-x"
    />
  </div>
</template>
