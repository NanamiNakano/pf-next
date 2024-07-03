<script lang="ts" setup>
import type { AdminSystemSettings } from "@nanaminakano/pfsdk"
import RFormGroup from "~/components/RFormGroup.vue"
import { abbreviatedSha } from "~build/git"

const siteSetting = ref({} as AdminSystemSettings)
const items = computed(() => [{
  slot: "general",
  label: "General",
}])
</script>

<template>
  <div>
    <UTabs
      :items="items"
      :ui="{ wrapper: 'md:flex items-start gap-4', list: { width: 'md:w-48' } }"
      orientation="vertical"
    >
      <template #general>
        <div class="flex flex-col gap-4">
          <RFormGroup title="Backend Version">
            {{ siteSetting.version }}
          </RFormGroup>
          <RFormGroup title="Frontend Version">
            NEXT-{{ abbreviatedSha }}
          </RFormGroup>
          <UDivider />
        </div>
      </template>
    </UTabs>
  </div>
</template>
