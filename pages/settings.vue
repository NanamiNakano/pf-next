<script lang="ts" setup>
import { z } from "zod"
import RFormGroup from "~/components/RFormGroup.vue"
import type { FormSubmitEvent } from "#ui/types"

const userData = useUserDataStore()
const pfClient = usePfClient()
const toast = useToast()
const { t } = useI18n()

const items = computed(() => {
  if (userData.userData.permission && userData.userData.permission === 2) {
    return [{
      slot: "user",
      label: "User",
    }, {
      slot: "system",
      label: "System",
      content: "System",
    }]
  }

  return [{
    slot: "user",
    label: "User",
    content: "User",
  }]
})

const route = useRoute()
const router = useRouter()

const selected = computed({
  get() {
    const index = items.value.findIndex(item => (item.slot === route.query.tab))
    if (index === -1) {
      return 0
    }
    return index
  },
  set(value) {
    router.replace({ query: { tab: items.value[value].slot } })
  },
})

const editingName = ref(false)
const editing = ref(false)
const newName = ref("")

async function onChangeName() {
  editing.value = true
  newName.value = userData.userData.name
  await pfClient.user.changeName(newName.value).then((rps) => {
    if (rps.Ok) {
      toast.add({ title: "Change name successfully" })
      userData.fetch()
    }
    else {
      toast.add({ title: "Change name unsuccessfully", description: rps.Msg, color: "red" })
    }
  })
  editing.value = false
  editingName.value = false
}

const permission = {
  0: "Banned",
  1: "Normal user",
  2: "Admin",
}

const resetting = ref(false)

async function onResetToken() {
  resetting.value = true
  await pfClient.user.resetToken().then((rps) => {
    if (rps.Ok) {
      toast.add({ title: "Reset token successfully " })
      userData.userData.token = rps.Token!
    }
    else {
      toast.add({ title: "Reset token unsuccessfully", description: rps.Msg, color: "red" })
    }
  })
  resetting.value = false
}

const passwordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
}).superRefine(({ confirmNewPassword, newPassword }, ctx) => {
  if (confirmNewPassword !== newPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t("text.signup.passwordMismatch"),
      path: ["confirmNewPassword"],
    })
  }
})
type PasswordSchema = z.output<typeof passwordSchema>
const passwordState = ref({
  oldPassword: undefined,
  newPassword: undefined,
  confirmNewPassword: undefined,
})

const changingPassword = ref(false)
const changing = ref(false)

async function onChangePassword(event: FormSubmitEvent<PasswordSchema>) {
  changing.value = true
  await pfClient.user.changePassword(event.data.oldPassword, event.data.newPassword).then(async (rps) => {
    if (rps.Ok) {
      toast.add({ title: "Change password successfully, please re-login" })
      try {
        localStorage.removeItem("Authorization")
        await navigateTo("/login")
      }
      catch (_) {
        toast.add({ title: t("text.login.toast.logout.error.title"), color: "red" })
      }
    }
    else {
      toast.add({ title: "Change password unsuccessfully", description: rps.Msg, color: "red" })
    }
  })
  changing.value = false
  changingPassword.value = false
}
</script>

<template>
  <div>
    <UTabs
      v-model="selected"
      :items="items"
      :ui="{ wrapper: 'flex items-start gap-4', list: { width: 'w-48' } }"
      orientation="vertical"
    >
      <template #user>
        <div class="flex flex-col gap-4">
          <RFormGroup title="ID">
            {{ userData.userData.id }}
          </RFormGroup>
          <RFormGroup title="Username">
            {{ userData.userData.username }}
          </RFormGroup>
          <RFormGroup title="Display Name">
            <UButtonGroup v-if="editingName">
              <UInput
                v-model="newName"
              />
              <UButton
                :loading="editing"
                icon="i-tabler-check"
                @click="onChangeName"
              />
            </UButtonGroup>
            <div
              v-else
              class="flex justify-between items-center gap-2"
            >
              <div>
                {{ userData.userData.name }}
              </div>
              <UButton
                icon="i-tabler-pencil"
                variant="soft"
                @click="editingName = true"
              />
            </div>
          </RFormGroup>
          <RFormGroup title="Role">
            {{ permission[userData.userData.permission] }}
          </RFormGroup>
          <RFormGroup title="Join date">
            {{ userData.userData.registration_date }}
          </RFormGroup>
          <UDivider label="Security" />
          <RFormGroup title="Token">
            <div class="flex justify-between items-center">
              <div>{{ userData.userData.token }}</div>
              <UButton
                :loading="resetting"
                color="red"
                icon="i-tabler-reload"
                variant="soft"
                @click="onResetToken"
              />
            </div>
          </RFormGroup>
          <RFormGroup title="Password">
            <UButton
              label="Change password"
              @click="changingPassword = true"
            />
          </RFormGroup>
        </div>
      </template>
    </UTabs>
    <RClosableModal
      v-model="changingPassword"
      title="Change Password"
    >
      <UForm
        :schema="passwordSchema"
        :state="passwordState"
        class="space-y-2"
        @submit="onChangePassword"
      >
        <UFormGroup
          name="oldPassword"
          label="Old Password"
        >
          <UInput v-model="passwordState.oldPassword" />
        </UFormGroup>
        <UFormGroup
          name="newPassword"
          label="New Password"
        >
          <UInput v-model="passwordState.newPassword" />
        </UFormGroup>
        <UFormGroup
          name="confirmNewPassword"
          label="Confirm New Password"
          eager-validation
        >
          <UInput v-model="passwordState.confirmNewPassword" />
        </UFormGroup>
        <UButton
          :loading="changing"
          label="Submit"
          type="submit"
        />
      </UForm>
    </RClosableModal>
  </div>
</template>
