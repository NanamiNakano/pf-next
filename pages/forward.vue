<script lang="ts" setup>
import type { ForwardNodeData, PendingRuleData, QueryParams, RuleData, RuleTarget } from "@nanaminakano/pfsdk"
import { z } from "zod"
import type { Filter } from "~/types/commons"
import type { FormSubmitEvent } from "#ui/types"

const pfClient = usePfClient()
const toast = useToast()

const loading = ref(true)
const edit = ref(true)
const tableRowData = ref<RuleData[]>([])
const selected = ref<RuleData[]>([])

const state = ref({ conf: {} } as PendingRuleData)
const editingId = ref(0)

async function fetchAll(query?: QueryParams) {
  loading.value = true
  await pfClient.forwardRule.getRuleList(query).then((rps) => {
    if (rps.Ok) {
      tableRowData.value = rps.Data!
    }
    else {
      tableRowData.value = []
      toast.add({ title: "Unable to load data", description: rps.Msg, color: "red" })
    }
  })
  loading.value = false
}

const tableColumns = [{
  key: "id",
  label: "ID",
}, {
  key: "name",
  label: "Name",
}, {
  key: "user_id",
  label: "User ID",
}, {
  key: "node_id",
  label: "Node",
}, {
  key: "mode",
  label: "Mode",
}, {
  key: "protocol",
  label: "Protocol",
}, {
  key: "bind",
  label: "Listen Port",
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
  tls: "TLS",
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
      modalIsOpen.value = true
      state.value = structuredClone(toRaw(row))
      editingId.value = row.id
      if (!state.value.conf) {
        state.value.conf = {}
      }
      if (!state.value.targets) {
        state.value.targets = []
      }
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
  }, {
    label: "Disable",
    icon: "i-tabler-circle-off",
    disabled: row.status === "Disabled",
    click: async () => {
      loading.value = true
      await pfClient.forwardRule.stop(row.id).then(async (rps) => {
        if (rps.Ok) {
          toast.add({ title: "Stop successfully" })
          await fetchAll()
        }
        else {
          toast.add({ title: "Stop unsuccessfully", description: rps.Msg, color: "red" })
        }
      })
      loading.value = false
    },
  }, {
    label: "Enable",
    icon: "i-tabler-player-play",
    disabled: row.status !== "Disabled",
    click: async () => {
      loading.value = true
      await pfClient.forwardRule.start(row.id).then(async (rps) => {
        if (rps.Ok) {
          toast.add({ title: "Start successfully" })
          await fetchAll()
        }
        else {
          toast.add({ title: "Start unsuccessfully", description: rps.Msg, color: "red" })
        }
      })
      loading.value = false
    },
  }]]

const nodeData = ref<ForwardNodeData[]>()

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
    record[key] = {
      label: label, select: nodeData.value.reduce((record, { id, name }) => {
        record[id] = name
        return record
      }, {} as Record<number, string>),
    }
  }
  else {
    record[key] = { label: label }
  }
  return record
}, {} as Record<string, Filter>)))

const modalIsOpen = ref(false)
const schema = z.object({
  name: z.string(),
  node_id: z.number(),
  mode: z.number(),
  protocol: z.string(),
  bind: z.string().default(""),
  targets: z.array(z.object({
    Host: z.string(),
    Port: z.number(),
  })).default([]),
  proxy_protocol: z.number(),
  conf: z.record(z.string(), z.string()),
  outbound: z.string().default(""),
  dest_device: z.number().optional(),
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  modalIsOpen.value = false
  if (edit.value) {
    await pfClient.forwardRule.modify(editingId.value, event.data).then((rps) => {
      if (rps.Ok) {
        toast.add({ title: "Modify successfully" })
      }
      else {
        toast.add({ title: "Modify unsuccessfully", description: rps.Msg, color: "red" })
      }
    })
  }
  else {
    await pfClient.forwardRule.add(event.data).then((rps) => {
      if (rps.Ok) {
        toast.add({ title: "Add successfully" })
      }
      else {
        toast.add({ title: "Add unsuccessfully", description: rps.Msg, color: "red" })
      }
    })
  }
  await fetchAll()
}

const node = computed(() => {
  return nodeData.value?.findLast((item) => {
    return item.id === state.value.node_id // TODO: nuxt/ui #1897
  })
})
const nodeHelp = computed(() => {
  if (!nodeData.value) {
    return ""
  }
  return node.value ? `#${node.value.id}: ${node.value.speed}x Speed ${node.value.traffic}x Traffic` : ""
})
const nodeProtocol = computed(() => {
  if (node.value) {
    return node.value.protocol.split("|").map(item => ({ name: protocol[item], value: item }))
  }
  return Object.entries(protocol).map(([key, label]) => ({ name: label, value: key }))
})

function onAddTarget() {
  if (state.value.targets) {
    const target = {} as RuleTarget
    state.value.targets.push(target)
  }
  else {
    state.value.targets = []
    onAddTarget()
  }
}

function onDeleteTarget(index: number) {
  state.value.targets.splice(index, 1)
}

const pendingConfKey = ref("")
const configs = computed(() => {
  return Object.entries(state.value.conf).map(([key, value]) => ({ key, value }))
})

onMounted(async () => {
  await fetchAll()
  await pfClient.node.getForwardNodes().then((rps) => {
    if (rps.Ok) {
      nodeData.value = rps.Data
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
          modalIsOpen = true
          state = { conf: {} } as PendingRuleData
        }"
      />
    </div>
    <RSearch
      :filters="filters"
      @search="(params) => { fetchAll(params) }"
    />
    <RTable
      v-model="selected"
      :columns="tableColumns"
      :loading="loading"
      :row-data="tableRowData"
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
            icon="i-tabler-dots"
            variant="ghost"
          />
        </UDropdown>
      </template>
    </RTable>
    <UModal v-model="modalIsOpen">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <div v-if="edit">
              ID: {{ editingId }}
            </div>
            <div v-else>
              New
            </div>
            <UButton
              icon="i-tabler-x"
              @click="modalIsOpen = false"
            />
          </div>
        </template>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup
            label="Name"
            name="name"
          >
            <UInput
              v-model="state.name"
            />
          </UFormGroup>
          <UFormGroup
            :help="nodeHelp"
            label="Node"
            name="node_id"
          >
            <USelect
              v-model.number="state.node_id"
              :options="nodeData?.map(item => ({ name: item.name, value: item.id }))"
              option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup
            label="Protocol"
            name="protocol"
          >
            <USelect
              v-model="state.protocol"
              :disabled="node === undefined"
              :options="nodeProtocol"
              option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup
            label="Listen Port"
            name="bind"
          >
            <UInput
              v-model="state.bind"
              placeholder="Leave empty to auto assign"
            />
          </UFormGroup>
          <UDivider />
          <UFormGroup
            label="Mode"
            name="mode"
          >
            <USelect
              v-model.number="state.mode"
              :options="Object.entries(mode).map(([key, label]) => ({ name: label, value: key }))"
              option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup
            label="Targets"
            name="targets"
          >
            <div class="flex flex-col space-y-2">
              <div v-for="(target, index) in state.targets"
                   :key="`${index}-${Math.random()}`"
                   class="flex-none"
              >
                <UButtonGroup
                  orientation="horizontal"
                >
                  <UInput
                    v-model="target.Host"
                    placeholder="Host"
                  />
                  <UInput
                    v-model="target.Port"
                    placeholder="Port"
                    type="number"
                  />
                  <UButton
                    icon="i-tabler-trash"
                    @click="onDeleteTarget(index)"
                  />
                </UButtonGroup>
              </div>
              <div>
                <UButton
                  icon="i-tabler-plus"
                  label="Add"
                  @click="onAddTarget"
                  class="flex-none"
                />
              </div>
            </div>
          </UFormGroup>
          <UDivider label="Advanced" />
          <UFormGroup
            label="Proxy Protocol"
            name="proxy_protocol"
          >
            <USelect
              v-model.number="state.proxy_protocol"
              :options="Object.entries(proxyProtocol).map(([key, label]) => ({ name: label, value: key }))"
              option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup
            label="Config"
            name="conf"
          >
            <div class="flex flex-col space-y-2">
              <div v-for="conf in configs"
                   :key="conf.key"
                   class="flex-none"
              >
                <UButtonGroup
                  orientation="horizontal"
                >
                  <UInput
                    v-model="conf.key"
                    disabled
                  />
                  <UInput
                    v-model="state.conf[conf.key]"
                    placeholder="Value"
                  />
                  <UButton
                    icon="i-tabler-trash"
                    @click="delete state.conf[conf.key]"
                  />
                </UButtonGroup>
              </div>
              <UFormGroup :error="(state.conf[pendingConfKey] !== undefined) && 'Config already exist'">
                <UButtonGroup>
                  <UInput
                    v-model="pendingConfKey"
                    placeholder="Key"
                  />
                  <UButton
                    :disabled="state.conf[pendingConfKey] !== undefined"
                    icon="i-tabler-plus"
                    label="Add"
                    @click="() => {
                  state.conf[pendingConfKey] = ''
                  pendingConfKey = ''
                }"
                  />
                </UButtonGroup>
              </UFormGroup>
            </div>
          </UFormGroup>
          <UDivider />
          <UButton
            label="Submit"
            type="submit"
          />
        </UForm>
      </Ucard>
    </UModal>
  </div>
</template>
