<script lang="ts" setup>
import { z } from "zod"
import type { FormSubmitEvent } from "#ui/types"

definePageMeta({
  layout: "auth",
})

const pfClient = usePfClient()
const toast = useToast()
const { t } = useI18n()
const siteSetting = useSiteSettingStore()
const registering = ref(false)

const schema = z.object({
  username: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
  refererCode: z.string().optional(),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t("text.signup.passwordMismatch"),
      path: ["confirmPassword"],
    })
  }
}).superRefine(({ refererCode }, ctx) => {
  if ((siteSetting.siteSetting.register_invite === "true") && (refererCode === undefined || refererCode.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t("text.signup.required"),
      path: ["refererCode"],
    })
  }
})

type Schema = z.output<typeof schema>

const state = ref({
  username: undefined,
  password: undefined,
  confirmPassword: undefined,
  refererCode: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  registering.value = true
  await pfClient.auth.register(event.data.username, event.data.password, undefined, event.data.refererCode).then(async (rps) => {
    if (rps.Ok) {
      toast.add({
        title: t("text.signup.toast.signup.ok.title"),
        actions: [{ label: t("text.signup.toast.signup.ok.signin"), click: () => navigateTo("/login") }],
      })
    }
    else {
      toast.add({ title: t("text.signup.toast.signup.error.title"), description: rps.Msg, color: "red" })
    }
  })
  registering.value = false
}

onMounted(async () => {
  siteSetting.fetch()
  if (siteSetting.siteSetting.register !== "true") {
    toast.add({
      title: t("text.signup.toast.system.notAllowSignup.title"),
      description: t("text.signup.toast.system.notAllowSignup.description"),
      color: "red",
    })
    await navigateTo("/login")
  }
})
</script>

<template>
  <div class="mx-4 w-full max-w-md">
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup
        :label="$t('text.signup.username')"
        name="username"
        required
      >
        <UInput v-model="state.username" />
      </UFormGroup>

      <UFormGroup
        :label="$t('text.signup.password')"
        name="password"
        required
      >
        <UInput
          v-model="state.password"
          type="password"
        />
      </UFormGroup>

      <UFormGroup
        :label="$t('text.signup.confirmPassword')"
        name="confirmPassword"
        required
      >
        <UInput
          v-model="state.confirmPassword"
          type="password"
        />
      </UFormGroup>

      <UFormGroup
        :label="$t('text.signup.refererCode')"
        :required="siteSetting.siteSetting.register_invite === 'true'"
        name="refererCode"
      >
        <UInput v-model="state.refererCode" />
      </UFormGroup>
      <UButton
        :loading="registering"
        block
        type="submit"
      >
        {{ $t("text.signup.submit") }}
      </UButton>
      <UDivider :label="$t('text.signup.hasAccount')" />
      <UButton
        :label="$t('text.signup.login')"
        @click="navigateTo('/login')"
        block
      />
    </UForm>
  </div>
</template>
