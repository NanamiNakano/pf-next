<script lang="ts" setup>
import type {
  ForwardNodeData, NatDeviceData,
  PendingRuleData,
  QueryParams,
  RuleData,
  RuleDebugResponse,
} from "@nanaminakano/pfsdk"
import { z } from "zod"
import type { Filter } from "~/types/commons"
import type { FormSubmitEvent } from "#ui/types"

const pfClient = usePfClient()
const toast = useToast()
const { t } = useI18n()

const loading = ref(true)
const edit = ref(true)
const tableRowData = ref<RuleData[]>([])
const selected = ref<RuleData[]>([])

const state = ref({ conf: {}, targets: [{}] } as PendingRuleData)
const editingId = ref(0)

async function fetchAll(query?: QueryParams) {
  loading.value = true
  await pfClient.natRule.getRuleList(query).then((rps) => {
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

const tableColumns = computed(() => [{
  key: "id",
  label: "ID",
}, {
  key: "name",
  label: t("text.rule.name"),
}, {
  key: "user_id",
  label: t("text.rule.userId"),
}, {
  key: "node_id",
  label: t("text.rule.node"),
}, {
  key: "mode",
  label: t("text.rule.node"),
}, {
  key: "protocol",
  label: t("text.rule.protocol"),
}, {
  key: "bind",
  label: t("text.rule.listeningPort"),
}, {
  key: "proxy_protocol",
  label: t("text.rule.proxyProtocol"),
}, {
  key: "status",
  label: t("text.rule.status"),
}, {
  key: "actions",
}])

const mode: Record<number, string> = { // TODO: i18n
  0: "单转发",
  1: "负载均衡",
  2: "故障转移",
  3: "IP Hash",
}
const natProtocol: Record<string, string> = {
  tcpudp: "TCP/UDP",
  http: "HTTP",
  https: "HTTPS",
}
const proxyProtocol: Record<number, string> = {
  0: "关闭",
  1: "v1",
  2: "v2",
  255: "RProxy",
}

const diagnoseModalIsOpen = ref(false)
const diagnosing = ref(false)
const diagnoseData = ref({} as RuleDebugResponse)

const actions = (row: RuleData) => computed(() => [
  [{
    label: t("verb.edit"),
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
  }], [{
    label: t("verb.delete"),
    icon: "i-tabler-trash",
    click: async () => {
      loading.value = true
      await pfClient.natRule.delete(row.id).then(async (rps) => {
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
    label: t("verb.delete"),
    icon: "i-tabler-circle-off",
    disabled: row.status === "Disabled",
    click: async () => {
      loading.value = true
      await pfClient.natRule.stop(row.id).then(async (rps) => {
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
    label: t("verb.enable"),
    icon: "i-tabler-player-play",
    disabled: row.status !== "Disabled",
    click: async () => {
      loading.value = true
      await pfClient.natRule.start(row.id).then(async (rps) => {
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
  }, {
    label: t("verb.restart"),
    icon: "i-tabler-reload",
    click: async () => {
      loading.value = true
      await pfClient.natRule.restart(row.id).then(async (rps) => {
        if (rps.Ok) {
          toast.add({ title: "Restart successfully" })
          await fetchAll()
        }
        else {
          toast.add({ title: "Restart unsuccessfully", description: rps.Msg, color: "red" })
        }
      })
      loading.value = false
    },
  }], [{
    label: t("verb.diagnose"),
    icon: "i-tabler-bug",
    click: async () => {
      diagnosing.value = true
      diagnoseModalIsOpen.value = true
      await pfClient.natRule.debug(row.id).then((rps) => {
        if (!rps.Ok) {
          toast.add({ title: "Diagnose unsuccessfully", description: rps.Msg, color: "red" })
          diagnoseModalIsOpen.value = false
        }
        else {
          diagnoseData.value = rps
        }
      })
      diagnosing.value = false
    },
  }]])

const nodeData = ref<ForwardNodeData[]>()
const deviceData = ref<NatDeviceData[]>()

const filters = computed(() => (tableColumns.value.filter(item => item.label !== undefined).reduce((record, {
  key,
  label,
}) => {
  if (key === "mode") {
    record[key] = { label: label, select: mode }
  }
  else if (key === "nat_protocol") {
    record[key] = { label: label, select: natProtocol }
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
  protocol: z.string(),
  bind: z.string().default(""),
  targets: z.array(z.object({
    Host: z.string(),
    Port: z.number(),
  })).max(1),
  proxy_protocol: z.number(),
  conf: z.record(z.string(), z.string()),
  outbound: z.string().default(""),
  dest_device: z.number(),
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
  modalIsOpen.value = false
  if (edit.value) {
    await pfClient.natRule.modify(editingId.value, event.data).then((rps) => {
      if (rps.Ok) {
        toast.add({ title: "Modify successfully" })
      }
      else {
        toast.add({ title: "Modify unsuccessfully", description: rps.Msg, color: "red" })
      }
    })
  }
  else {
    await pfClient.natRule.add(event.data).then((rps) => {
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
    return node.value.nat_protocol.split("|").map(item => ({ name: natProtocol[item], value: item }))
  }
  return Object.entries(natProtocol).map(([key, label]) => ({ name: label, value: key }))
})

const pendingConfKey = ref("")
const configs = computed(() => {
  return Object.entries(state.value.conf).map(([key, value]) => ({ key, value }))
})

async function handleDelete() {
  loading.value = true
  for (const item of selected.value) {
    await pfClient.natRule.delete(item.id).then(async (rps) => {
      if (rps.Ok) {
        toast.add({ title: `Delete successfully: ${item.name} (ID: ${item.id})` })
        await fetchAll()
      }
      else {
        toast.add({ title: `Delete unsuccessfully: ${item.name} (ID: ${item.id})`, description: rps.Msg, color: "red" })
      }
    })
  }
  loading.value = false
}

async function handleDisable() {
  loading.value = true
  for (const item of selected.value) {
    await pfClient.natRule.stop(item.id).then(async (rps) => {
      if (rps.Ok) {
        toast.add({ title: `Disable successfully: ${item.name} (ID: ${item.id})` })
        await fetchAll()
      }
      else {
        toast.add({
          title: `Disable unsuccessfully: ${item.name} (ID: ${item.id})`,
          description: rps.Msg,
          color: "red",
        })
      }
    })
  }
  loading.value = false
}

async function handleEnable() {
  loading.value = true
  for (const item of selected.value) {
    await pfClient.natRule.start(item.id).then(async (rps) => {
      if (rps.Ok) {
        toast.add({ title: `Enable successfully: ${item.name} (ID: ${item.id})` })
        await fetchAll()
      }
      else {
        toast.add({ title: `Enable unsuccessfully: ${item.name} (ID: ${item.id})`, description: rps.Msg, color: "red" })
      }
    })
  }
  loading.value = false
}

async function handleRestart() {
  loading.value = true
  for (const item of selected.value) {
    await pfClient.natRule.restart(item.id).then(async (rps) => {
      if (rps.Ok) {
        toast.add({ title: `Restart successfully: ${item.name} (ID: ${item.id})` })
        await fetchAll()
      }
      else {
        toast.add({
          title: `Restart unsuccessfully: ${item.name} (ID: ${item.id})`,
          description: rps.Msg,
          color: "red",
        })
      }
    })
  }
  loading.value = false
}

onMounted(async () => {
  await fetchAll()
  await pfClient.node.getNatNodes().then((rps) => {
    if (rps.Ok) {
      nodeData.value = rps.Data
    }
    else {
      toast.add({ title: "Unable to load node data", description: rps.Msg, color: "red" })
    }
  })
  await pfClient.device.getNatDevices().then((rps) => {
    if (rps.Ok) {
      deviceData.value = rps.Data
    }
    else {
      toast.add({ title: "Unable to load device data", description: rps.Msg, color: "red" })
    }
  })
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <div class="flex space-x-2">
      <UButton
        :label="t('verb.new')"
        @click="() => {
          edit = false
          modalIsOpen = true
          state = { conf: {}, targets: [{}] } as PendingRuleData
        }"
      />
      <UButtonGroup>
        <UButton
          :disabled="selected.length <= 0"
          :label="t('verb.delete')"
          color="red"
          variant="outline"
          @click="handleDelete"
        />
        <UButton
          :disabled="selected.length <= 0"
          :label="t('verb.disable')"
          variant="outline"
          @click="handleDisable"
        />
        <UButton
          :disabled="selected.length <= 0"
          :label="t('verb.enable')"
          variant="outline"
          @click="handleEnable"
        />
        <UButton
          :disabled="selected.length <= 0"
          :label="t('verb.restart')"
          variant="outline"
          @click="handleRestart"
        />
      </UButtonGroup>
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
        {{ natProtocol[row.protocol] }}
      </template>

      <template #proxy_protocol-data="{ row }">
        {{ proxyProtocol[row.proxy_protocol] }}
      </template>

      <template #status-data="{ row }">
        <RStatusBadge :status="row.status" />
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="actions(row).value">
          <UButton
            color="gray"
            icon="i-tabler-dots"
            variant="ghost"
          />
        </UDropdown>
      </template>
    </RTable>
    <RClosableModal
      v-model="modalIsOpen"
      :title="edit ? `ID: ${editingId}` : t('verb.new')"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup
          :label="t('text.rule.name')"
          name="name"
        >
          <UInput
            v-model="state.name"
          />
        </UFormGroup>
        <UFormGroup
          :help="nodeHelp"
          :label="t('text.rule.node')"
          name="node_id"
        >
          <USelect
            v-model.number="state.node_id"
            :options="nodeData?.map(item => ({ name: item.name, value: item.id }))"
            option-attribute="name"
          />
        </UFormGroup>
        <UFormGroup
          :label="t('text.rule.protocol')"
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
          :label="t('text.rule.listeningPort')"
          name="bind"
        >
          <UInput
            v-model="state.bind"
            :placeholder="t('text.rule.placeholder.empty')"
          />
        </UFormGroup>
        <UDivider />
        <UFormGroup
          :label="t('text.rule.targets')"
          name="targets"
        >
          <div
            v-for="(target, index) in state.targets"
            :key="`${index}-${Math.random()}`"
          >
            <UButtonGroup
              orientation="horizontal"
            >
              <UInput
                v-model="target.Host"
                :placeholder="t('text.rule.placeholder.host')"
              />
              <UInput
                v-model="target.Port"
                :placeholder="t('text.rule.placeholder.port')"
                type="number"
              />
            </UButtonGroup>
          </div>
        </UFormGroup>
        <UFormGroup
          :label="t('text.rule.device')"
          name="dest_device"
        >
          <USelect
            v-model.number="state.dest_device"
            :options="deviceData?.map(item => ({ name: item.name, value: item.id }))"
            option-attribute="name"
          />
        </UFormGroup>
        <UDivider :label="t('text.rule.advanced')" />
        <UFormGroup
          :label="t('text.rule.proxyProtocol')"
          name="proxy_protocol"
        >
          <USelect
            v-model.number="state.proxy_protocol"
            :options="Object.entries(proxyProtocol).map(([key, label]) => ({ name: label, value: key }))"
            option-attribute="name"
          />
        </UFormGroup>
        <UFormGroup
          :label="t('text.rule.config')"
          name="conf"
        >
          <div class="flex flex-col space-y-2">
            <div
              v-for="conf in configs"
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
                  :placeholder="t('text.rule.placeholder.value')"
                />
                <UButton
                  icon="i-tabler-trash"
                  @click="delete state.conf[conf.key]"
                />
              </UButtonGroup>
            </div>
            <UFormGroup :error="(state.conf[pendingConfKey] !== undefined) && t('text.rule.placeholder.configExist')">
              <UButtonGroup>
                <UInput
                  :key="t('text.rule.placeholder.key')"
                  v-model="pendingConfKey"
                />
                <UButton
                  :disabled="state.conf[pendingConfKey] !== undefined"
                  icon="i-tabler-plus"
                  :label="t('verb.add')"
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
          :label="t('verb.submit')"
          type="submit"
        />
      </UForm>
    </RClosableModal>
    <RClosableModal
      v-model="diagnoseModalIsOpen"
      :title="t('verb.diagnose')"
    >
      <div
        v-if="diagnosing"
        class="flex flex-col space-y-2"
      >
        <UProgress animation="carousel" />
        <div>Diagnosing...</div>
      </div>
      <div v-else>
        Work in Progress
      </div>
    </RClosableModal>
  </div>
</template>
`
