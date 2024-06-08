<script setup lang="ts">
import { z } from "zod"
import type { UserData } from "@nanaminakano/pfsdk"
import type { FormSubmitEvent } from "#ui/types"

definePageMeta({
  layout: "auth",
})

const pfClient = usePfClient()
const toast = useToast()
const { t } = useI18n()
const sessionCookie = useCookie("session_id")
const loggedIn = ref(false)
const userData = useState("userData", () => ({} as UserData))

const schema = z.object({
  username: z.string(),
  password: z.string(),
})

type Schema = z.output<typeof schema>

const state = ref({
  username: undefined,
  password: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await pfClient.auth.login(event.data.username, event.data.password).then(async (rps) => {
    if (rps.Ok) {
      toast.add({ title: t("text.login.toast.login.ok") })
      loggedIn.value = true
      await pfClient.user.getData().then((rps) => {
        console.log(rps)
        if (rps.Ok) {
          userData.value = rps.Data!
        }
      })
    }
    else {
      toast.add({ title: t("text.login.toast.login.error"), description: rps.Msg, color: "red" })
    }
  })
}

async function logout() {
  await pfClient.auth.logout().then((rps) => {
    if (rps.Ok) {
      loggedIn.value = false
      toast.add({ title: t("text.login.toast.logout.ok") })
    }
    else {
      toast.add({ title: t("text.login.toast.logout.error"), description: rps.Msg, color: "red" })
    }
  })
}

onMounted(async () => {
  if (sessionCookie.value) {
    loggedIn.value = true
    await pfClient.user.getData().then((rps) => {
      console.log(rps)
      if (rps.Ok) {
        userData.value = rps.Data!
      }
    })
  }
})
</script>

<template>
  <div class="mx-4 w-full max-w-md">
    <UForm
      v-if="!loggedIn"
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup
        :label="$t('text.login.username')"
        name="email"
      >
        <UInput v-model="state.username" />
      </UFormGroup>

      <UFormGroup
        :label="$t('text.login.password')"
        name="password"
      >
        <UInput
          v-model="state.password"
          type="password"
        />
      </UFormGroup>

      <UButton type="submit">
        {{ $t("text.login.submit") }}
      </UButton>
    </UForm>
    <UContainer
      v-else
      class="space-y-4"
    >
      <p class="text-center text-xl">
        {{ $t("text.login.loggedIn") }}
      </p>
      <div class="flex justify-around items-center">
        <div class="flex space-x-2 items-center">
          <TablerIcon
            name="user-circle"
            class="w-16 h-16"
          />
          <div class="text-left">
            <h2>{{ userData.name }}</h2>
            <p class="font-light text-gray-400">
              {{ userData.username }}
            </p>
          </div>
        </div>
        <UButton
          variant="outline"
          @click="logout"
        >
          <TablerIcon
            name="logout"
            class="w-6 h-6"
          />
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>

</style>
