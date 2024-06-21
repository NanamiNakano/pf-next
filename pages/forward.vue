<script setup lang="ts">
import type { ForwardNodeData, QueryParams, RuleData } from "@nanaminakano/pfsdk"
import { z } from "zod"
import type { Filter } from "~/types/commons"
import type { FormSubmitEvent } from "#ui/types"
import RSlideover from "~/components/RSlideover.vue"

const pfClient = usePfClient()
const toast = useToast()

const loading = ref(true)
const edit = ref(true)
const tableRowData = ref<RuleData[]>([])
const tableColumns = [{
  key: "id",
  label: "ID",
}, {
  key: "user_id",
  label: "User ID",
}, {
  key: "node_id",
  label: "Node",
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
    click: () => {
      edit.value = true
      slideIsOpen.value = true
      state.value = structuredClone(toRaw(row))
    },
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

const nodeData = ref<ForwardNodeData[]>()

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

const filters = computed(() => (tableColumns.filter(item => item.label !== undefined).reduce((record, {
  key,
  label,
}) => {
  if (key === "mode") {
    record[key] = { label: label, select: mode }
  }
  else if (key === "protocol") {
    record[key] = { label: label, select: protocol }
  }
  else if (key === "proxy_protocol") {
    record["proxy"] = { label: label, select: proxyProtocol }
  }
  else if (nodeData.value !== undefined && key === "node_id") {
    record[key] = { label: label, select: nodeData.value.reduce((record, { id, name }) => {
      record[id] = name
      return record
    }, {} as Record<number, string>) }
  }
  else {
    record[key] = { label: label }
  }
  return record
}, {} as Record<string, Filter>)))

const schema = z.object({
  node_id: z.number(),
  name: z.string(),
  mode: z.number(),
  protocol: z.string(),
  bind: z.number(),
  proxy_protocol: z.number(),
})

type Schema = z.output<typeof schema>

const state = ref({} as RuleData)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}

onMounted(async () => {
  await fetchAll()
  await pfClient.node.getForwardNodes().then((rps) => {
    if (rps.Ok) {
      nodeData.value = rps.Data
      console.log(nodeData.value)
    }
    else {
      toast.add({ title: "Unable to load node data", description: rps.Msg, color: "red" })
    }
  })
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <div class="flex space-x-2">
      <UButton
        label="New"
        @click="() => {
          edit = false
          slideIsOpen = true
          state = {} as RuleData
        }"
      />
    </div>
    <RSearch
      :filters="filters"
      @search="(params) => { fetchAll(params) }"
    />
    <RTable
      v-model="selected"
      :row-data="tableRowData"
      :columns="tableColumns"
      :loading="loading"
    >
      <template #node_id-data="{ row }">
        <div v-if="nodeData === undefined">
          {{ row.node_id }}
        </div>
        <div v-else>
          {{ nodeData!.findLast(item => (item.id === row.node_id))?.name }}
        </div>
      </template>

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
    <RSlideover v-model="slideIsOpen">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div v-if="edit">
          ID: {{ state.id }}
        </div>
        <UDivider v-if="edit" />
        <UFormGroup
          label="Protocol"
          name="protocol"
        >
          <USelect
            v-model="state.protocol"
            :options="Object.entries(protocol).map(([key, label]) => ({ name: label, value: key }))"
            option-attribute="name"
          />
        </UFormGroup>
      </UForm>
    </RSlideover>
  </div>
</template>
