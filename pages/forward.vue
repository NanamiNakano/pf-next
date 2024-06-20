<script setup lang="ts">
import type { QueryParams, RuleData } from "@nanaminakano/pfsdk"
import type { Filter } from "~/types/commons"

const pfClient = usePfClient()
const toast = useToast()

const loading = ref(true)
const tableRowData = ref<RuleData[]>([])
const tableColumns = [{
  key: "id",
  label: "ID",
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

const mode: Record<number, string> = { // TODO: i18n
  0: "单转发",
  1: "负载均衡",
  2: "故障转移",
  3: "IP Hash",
}
const protocol: Record<string, string> = {
  tcpudp: "TCP/UDP",
  http: "HTTP",
  https: "HTTPS",
  secure: "Secure",
  securex: "SecureX",
}
const proxyProtocol: Record<number, string> = {
  0: "关闭",
  1: "v1",
  2: "v2",
  255: "RProxy",
}

const actions = (row: RuleData) => [
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
      toast.add({ title: "Unable to load data", description: rps.Msg, color: "red" }) // TODO: i18n
    }
  })
  loading.value = false
}

const filters = (tableColumns.filter(item => !!item.label) as { key: string, label: string }[]).map((item) => {
  if (item.key === "mode") {
    return { key: item.key, label: item.label, select: recordToArray(mode) }
  }
  else if (item.key === "protocol") {
    return { key: item.key, label: item.label, select: recordToArray(protocol) }
  }
  else if (item.key === "proxy_protocol") {
    return { key: "proxy", label: item.label, select: recordToArray(proxyProtocol) }
  }
  else {
    return { key: item.key, label: item.label }
  }
}) as Filter[]

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
      @search="(params) => { fetchAll(params); console.log(params) }"
    />
    <RTable
      v-model="selected"
      :row-data="tableRowData"
      :columns="tableColumns"
      :loading="loading"
    >
      <template #mode-data="{ row }">
        {{ mode[row.mode] }}
      </template>

      <template #protocol-data="{ row }">
        {{ protocol[row.protocol] }}
      </template>

      <template #proxy_protocol-data="{ row }">
        {{ proxyProtocol[row.proxy_protocol] }}
      </template>

      <template #status-data="{ row }">
        <RStatusBadge :status="row.status" />
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="actions(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-tabler-dots"
          />
        </UDropdown>
      </template>
    </RTable>
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
