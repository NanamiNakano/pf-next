<script lang="ts" setup>
import type { PendingAdminSystemSettings } from "@nanaminakano/pfsdk"
import { z } from "zod"
import RFormGroup from "~/components/RFormGroup.vue"
import type { FormSubmitEvent } from "#ui/types"
import { tag, abbreviatedSha } from "~build/git"

const pfClient = usePfClient()
const toast = useToast()
const siteSetting = useSiteSettingStore()

const items = computed(() => [{
  slot: "general",
  label: "General",
}])

const generalSchema = z.object({
  site_name: z.string(),
  script_mirror: z.string(),
  pkg_mirror: z.string(),
  register: z.string(),
  register_invite: z.string(),
  register_recaptcha: z.string(),
  recaptcha_public: z.string(),
  recaptcha_private: z.string(),
  invite_reward: z.string(),
  invite_reward_percentage: z.string(),
  invite_reward_for_new_user: z.string(),
  system_url: z.string(),
  license: z.string(),
  secure_key: z.string(),
  suspend_days: z.string(),
})

async function fetchGeneral() {
  await pfClient.admin.system.getSettings().then((rps) => {
    if (rps.Ok) {
      generalState.value = rps.Data! as PendingAdminSystemSettings
    }
    else {
      toast.add({
        title: "Unable to load system settings",
        description: rps.Msg,
        color: "red",
        actions: [{ label: "Reload", click: fetchGeneral }],
      })
    }
  })
}

type GeneralSchema = z.output<typeof generalSchema>

const generalState = ref({} as PendingAdminSystemSettings)

const submittingGeneral = ref(false)

async function onSubmitGeneral(event: FormSubmitEvent<GeneralSchema>) {
  submittingGeneral.value = true
  await pfClient.admin.system.modifySettings(event.data).then(async (rps) => {
    if (rps.Ok) {
      toast.add({ title: "Settings saved!" })
      await fetchGeneral()
      siteSetting.fetch()
    }
    else {
      toast.add({ title: "Unable to save settings", description: rps.Msg, color: "red" })
    }
  })
  submittingGeneral.value = false
}

const register = computed({
  get() {
    return generalState.value.register === "true"
  },
  set(value: boolean) {
    generalState.value.register = String(value)
  },
})

const registerInvite = computed({
  get() {
    return generalState.value.register_invite === "true"
  },
  set(value: boolean) {
    generalState.value.register_invite = String(value)
  },
})

const registerRecaptcha = computed({
  get() {
    return generalState.value.register_recaptcha === "true"
  },
  set(value: boolean) {
    generalState.value.register_recaptcha = String(value)
  },
})

const inviteRewardOptions = [{
  value: "0",
  label: "Off",
}, {
  value: "1",
  label: "First order only",
}, {
  value: "2",
  label: "Repeat",
}]

onMounted(async () => {
  await fetchGeneral()
})
</script>

<template>
  <div>
    <UTabs
      :items="items"
      :ui="{ wrapper: 'md:flex items-start gap-4', list: { width: 'md:w-48' } }"
      orientation="vertical"
    >
      <template #general>
        <UForm
          :schema="generalSchema"
          :state="generalState"
          class="space-y-4"
          @submit="onSubmitGeneral"
        >
          <RFormGroup title="Backend Version">
            {{ siteSetting.siteSetting.version }}
          </RFormGroup>
          <RFormGroup title="Frontend Version">
            NEXT-{{ tag ? tag : "dev" }}-{{ abbreviatedSha }}
          </RFormGroup>
          <UDivider />
          <RFormGroup
            name="site_name"
            title="Site name"
          >
            <UInput v-model="generalState.site_name" />
          </RFormGroup>
          <RFormGroup
            name="system_url"
            title="System URL"
          >
            <UInput v-model="generalState.system_url" />
          </RFormGroup>
          <RFormGroup
            name="license"
            title="License"
          >
            <UInput v-model="generalState.license" />
          </RFormGroup>
          <RFormGroup
            name="secure_key"
            title="Secure Key"
          >
            <UInput v-model="generalState.secure_key" />
          </RFormGroup>
          <RFormGroup
            name="script_mirror"
            title="Script Mirror"
          >
            <UInput v-model="generalState.script_mirror" />
          </RFormGroup>
          <RFormGroup
            name="pkg_mirror"
            title="Package Mirror"
          >
            <UInput v-model="generalState.pkg_mirror" />
          </RFormGroup>
          <RFormGroup
            name="suspend_days"
            title="Suspend Days"
          >
            <UInput
              v-model="generalState.suspend_days"
            />
          </RFormGroup>
          <RFormGroup
            name="register"
            title="Register"
          >
            <UToggle v-model="register" />
          </RFormGroup>
          <RFormGroup
            name="register_invite"
            title="Register Invite"
          >
            <UToggle v-model="registerInvite" />
          </RFormGroup>
          <RFormGroup
            name="register_recaptcha"
            title="Register reCAPTCHA"
          >
            <UToggle v-model="registerRecaptcha" />
          </RFormGroup>
          <RFormGroup
            name="recaptcha_public"
            title="reCAPTCHA Public Key"
          >
            <UTextarea v-model="generalState.recaptcha_public" />
          </RFormGroup>
          <RFormGroup
            name="recaptcha_private"
            title="reCAPTCHA Private Key"
          >
            <UTextarea v-model="generalState.recaptcha_private" />
          </RFormGroup>
          <RFormGroup
            name="invite_reward"
            title="Invite Reward"
          >
            <URadioGroup
              v-model="generalState.invite_reward"
              :options="inviteRewardOptions"
            />
          </RFormGroup>
          <RFormGroup
            name="invite_reward_percentage"
            title="Invite Reward Percentage"
          >
            <UInput v-model="generalState.invite_reward_percentage" />
          </RFormGroup>
          <RFormGroup
            name="invite_reward_for_new_user"
            title="Invite Reward For New User"
          >
            <UInput v-model="generalState.invite_reward_for_new_user" />
          </RFormGroup>
          <UButton
            :loading="submittingGeneral"
            label="Save"
            type="submit"
          />
        </UForm>
      </template>
    </UTabs>
  </div>
</template>
