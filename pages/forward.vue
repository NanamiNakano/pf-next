<script setup lang="ts">
import type { RuleData } from "@nanaminakano/pfsdk"

const pfClient = usePfClient()
const toast = useToast()

const tabItems = [{
  key: "forward",
  label: "Forward",
}, {
  key: "nat",
  label: "Nat",
}]
const selectedTab = ref("forward")

const loading = ref(true)
const tableRowData = ref<RuleData[]>([])
const tablePage = ref(1)
const tablePageCount = ref(10)
const tableRows = computed(() => {
  return tableRowData.value.slice((tablePage.value - 1) * tablePageCount.value, (tablePage.value) * tablePageCount.value)
})
const tableColumns = [{
  key: "id",
  label: "#",
}, {
  key: "user_id",
  label: "User ID",
}, {
  key: "node_id",
  label: "Node ID",
}, {
  key: "name",
  label: "Name",
}, {
  key: "mode",
  label: "Mode",
}, {
  key: "protocol",
  label: "Protocol",
}, {
  key: "bind",
  label: "Bound Port",
}, {
  key: "targets",
  label: "Targets",
}, {
  key: "proxy_protocol",
  label: "Proxy Protocol",
}, {
  key: "status",
  label: "Status",
}, {
  key: "actions",
}]
const actionItems = (row: RuleData) => [
  [{
    label: "Edit",
    icon: "i-tabler-pencil",
    click: () => console.log("Edit", row.id),
  }]]

const pageDropdown = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => ({
  label: (item * 5).toString(),
  click: () => {
    tablePageCount.value = item * 5
  },
}))]

function onChange(index: number) {
  selectedTab.value = tabItems[index].key
  fetchAll()
}

async function fetchAll() {
  loading.value = true
  if (selectedTab.value === "forward") {
    await pfClient.forwardRule.getRuleList().then((rps) => {
      if (rps.Ok) {
        tableRowData.value = rps.Data!
      }
      else {
        tableRowData.value = []
        toast.add({ title: "Unable to load data", color: "red" })
      }
    })
    loading.value = false
  }
  else {
    await pfClient.natRule.getRuleList().then((rps) => {
      if (rps.Ok) {
        tableRowData.value = rps.Data!
      }
      else {
        tableRowData.value = []
        toast.add({ title: "Unable to load data", color: "red" })
      }
    })
    loading.value = false
  }
}

onMounted(async () => {
  await fetchAll()
})
</script>

<template>
  <div>
    <UTabs
      :items="tabItems"
      class="w-full"
      @change="onChange"
    >
      <template #item>
        <div class="flex flex-col space-y-2">
          <UTable
            :rows="tableRows"
            :columns="tableColumns"
            :loading="loading"
            class="border-gray-300 dark:border-gray-600 border rounded"
          >
            <template #actions-data="{ row }">
              <UDropdown :items="actionItems(row)">
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-tabler-dots"
                />
              </UDropdown>
            </template>
          </UTable>
          <div class="flex space-x-2 justify-end">
            <UDropdown
              :items="pageDropdown"
              :ui="{
                width: 'w-24',
              }"
            >
              <UButton
                color="white"
                :label="`每页 ${tablePageCount}`"
                trailing-icon="i-tabler-chevron-down"
              />
            </UDropdown>
            <UPagination
              v-model="tablePage"
              :page-count="tablePageCount"
              :total="tableRowData.length"
            />
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>
