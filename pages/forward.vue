<script setup lang="ts">
import type { RuleData } from "@nanaminakano/pfsdk"

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
    click: () => console.log("Edit", row.id),
  }]]

async function fetchAll() {
  loading.value = true
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

onMounted(async () => {
  await fetchAll()
})
</script>

<template>
  <div>
    <RTable
      :row-data="tableRowData"
      :columns="tableColumns"
      :actions="actionItems"
      :loading="loading"
    />
  </div>
</template>
