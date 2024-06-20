<script setup lang="ts" generic="T extends { [key: string]: any}">
import type { DropdownItem } from "#ui/types"

const props = defineProps<{
  rowData: T[]
  columns: Array<{ key: string, label?: string }>
  actions: (row: T) => Array<DropdownItem[]>
  loading: boolean
}>()
const model = defineModel({ type: Array })

const tablePage = ref(1)
const tablePageCount = ref(10)
const tableRows = computed(() => (
  props.rowData.slice((tablePage.value - 1) * tablePageCount.value, (tablePage.value) * tablePageCount.value)
))

const pageDropdown = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => ({
  label: (item * 5).toString(),
  click: () => {
    tablePageCount.value = item * 5
    tablePage.value = 1
  },
}))]
</script>

<template>
  <div class="flex flex-col space-y-2">
    <UTable
      v-model="model"
      :rows="tableRows"
      :columns="columns"
      :loading="loading"
      class="border-gray-300 dark:border-gray-600 border rounded"
    >
      <template #actions-data="{ row }">
        <UDropdown :items="actions(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-tabler-dots"
          />
        </UDropdown>
      </template>
    </UTable>
    <div class="flex justify-between">
      <div>{{ $t("r.table.count", [tableRows.length, rowData.length]) }}</div>
      <div class="flex space-x-2">
        <UDropdown
          :items="pageDropdown"
          :ui="{
            width: 'w-24',
          }"
        >
          <UButton
            color="white"
            :label="`${$t('r.table.pageCount', [tablePageCount])}`"
            trailing-icon="i-tabler-chevron-down"
          />
        </UDropdown>
        <UPagination
          v-model="tablePage"
          :page-count="tablePageCount"
          :total="rowData.length"
        />
      </div>
    </div>
  </div>
</template>
