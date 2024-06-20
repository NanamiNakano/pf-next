<script setup lang="ts">
import type { QueryParams, RuleData } from "@nanaminakano/pfsdk"

const pfClient = usePfClient()
const toast = useToast()

const loading = ref(true)
const tableRowData = ref<RuleData[]>([])
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
    click: () => { slideIsOpen.value = true },
  }, {
    label: "Delete",
    icon: "i-tabler-trash",
    click: async () => {
      loading.value = true
      await pfClient.forwardRule.delete(row.id).then(async (rps) => {
        if (rps.Ok) {
          toast.add({ title: "Delete successfully" })
          await fetchAll()
        }
        else {
          toast.add({ title: "Delete unsuccessfully", description: rps.Msg, color: "red" })
        }
      })
      loading.value = false
    },
  }]]
const selected = ref<RuleData[]>([])

const slideIsOpen = ref(false)

async function fetchAll(query?: QueryParams) {
  loading.value = true
  await pfClient.forwardRule.getRuleList(query).then((rps) => {
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

const filters = tableColumns.filter(item => !!item.label) as { key: string, label: string }[]

onMounted(async () => {
  await fetchAll()
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <div class="flex space-x-2">
      <UButton label="New" />
    </div>
    <RSearch
      :filters="filters"
      @search="(params) => { fetchAll(params) }"
    />
    <RTable
      v-model="selected"
      :row-data="tableRowData"
      :columns="tableColumns"
      :actions="actionItems"
      :loading="loading"
    />
    <USlideover v-model="slideIsOpen">
      <div class="p-4 flex-1">
        <UButton
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-tabler-x"
          class="flex sm:hidden absolute end-5 top-5 z-10"
          square
          padded
          @click="slideIsOpen = false"
        />
        <USkeleton class="h-full" />
      </div>
    </USlideover>
  </div>
</template>
