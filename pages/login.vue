<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from "#ui/types"

definePageMeta({
  layout: "auth",
})

const pfClient = usePfClient()
const toast = useToast()
const { t } = useI18n()
const loggedIn = ref(false)
const logging = ref(false)
const siteSetting = useSiteSettingStore()
const userData = useUserDataStore()

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
  logging.value = true
  await pfClient.auth.login(event.data.username, event.data.password).then(async (rps) => {
    if (rps.Ok) {
      toast.add({ title: t("text.login.toast.login.ok.title"), timeout: 2000, callback: async () => await navigateTo("/") })
      loggedIn.value = true
      await userData.fetch()
    }
    else {
      toast.add({ title: t("text.login.toast.login.error.title"), description: rps.Msg, color: "red" })
    }
  })
  logging.value = false
}

async function logout() {
  try {
    localStorage.removeItem("Authorization")
    loggedIn.value = false
    toast.add({ title: t("text.login.toast.logout.ok.title") })
  }
  catch (_) {
    toast.add({ title: t("text.login.toast.logout.error.title"), color: "red" })
  }
}

onMounted(async () => {
  if (localStorage.getItem("Authorization")) {
    loggedIn.value = true
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
        name="username"
        required
      >
        <UInput v-model="state.username" />
      </UFormGroup>

      <UFormGroup
        :label="$t('text.login.password')"
        name="password"
        required
      >
        <UInput
          v-model="state.password"
          type="password"
        />
      </UFormGroup>

      <div class="flex justify-between items-center">
        <UButton
          type="submit"
          :loading="logging"
        >
          {{ $t("text.login.submit") }}
        </UButton>
        <div class="flex items-center">
          <p
            v-if="siteSetting.siteSetting.register === 'true'"
            class="text-gray-400 px-2"
          >
            {{ $t("text.login.noAccount") }}
          </p>
          <UButton
            v-if="siteSetting.siteSetting.register === 'true'"
            :label="$t('text.login.signup')"
            @click="navigateTo('/signup')"
          />
        </div>
      </div>
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
          <div
            v-if="userData.userData.name"
            class="text-left"
          >
            <h2>{{ userData.userData.name }}</h2>
            <p class="font-light text-gray-400">
              {{ userData.userData.username }}
            </p>
          </div>
          <div
            v-else
            class="space-y-2"
          >
            <USkeleton class="h-4 w-48" />
            <USkeleton class="h-4 w-36" />
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
