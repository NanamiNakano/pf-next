<script setup lang="ts">
import markdownit from "markdown-it"

const userData = useUserDataStore()
const announcement = useAnnouncementStore()
const loadingAnnouncement = ref(true)
const showAnnouncementModel = ref(false)
const announcementPage = ref(1)
const md = markdownit()

onMounted(async () => {
  await announcement.fetchAll()
  loadingAnnouncement.value = false
  console.log(announcement.announcements.length)
})

async function reloadAnnouncement() {
  loadingAnnouncement.value = true
  await announcement.fetchAll()
  loadingAnnouncement.value = false
}
</script>

<template>
  <div>
    <h1 class="text-2xl py-2">
      {{ $t("text.index.welcome") }} {{ userData.userData.name }}
    </h1>

    <UCard>
      <template #header>
        <div class="flex justify-between">
          <h2 class="text-base">
            {{ $t("text.index.latestAnnouncement") }}
          </h2>
          <UButton
            :loading="loadingAnnouncement"
            :label="$t('text.index.reload')"
            @click="reloadAnnouncement"
          />
        </div>
      </template>

      <div class="prose dark:prose-invert max-w-none max-h-80 overflow-y-scroll w-full">
        <p v-if="loadingAnnouncement">
          {{ $t("text.index.loading") }}
        </p>
        <p v-else-if="announcement.announcements.length === 0">
          {{ $t("text.index.noAnnouncement") }}
        </p>
        <div
          v-else
          class="w-full"
        >
          <h1 class="not-prose text-3xl text-black dark:text-white">
            {{ announcement.announcements.at(-1)!.title }}
          </h1>
          <UDivider class="not-prose py-2" />
          <div
            v-dompurify-html="md.render(announcement.announcements.at(-1)!.content)"
          />
        </div>
      </div>

      <template #footer>
        <UButton
          v-if="!loadingAnnouncement && announcement.announcements.length >= 0"
          :label="$t('text.index.readAll')"
          @click="showAnnouncementModel = true"
        />
      </template>
    </UCard>

    <UModal v-model="showAnnouncementModel">
      <UCard>
        <div
          v-if="showAnnouncementModel"
          class="prose dark:prose-invert max-w-none max-h-80 overflow-y-scroll w-full"
        >
          <h1 class="not-prose text-3xl text-black dark:text-white">
            {{ announcement.announcements.at(announcementPage - 1)!.title }}
          </h1>
          <UDivider class="not-prose py-2" />
          <div
            v-dompurify-html="md.render(announcement.announcements.at(announcementPage - 1)!.content)"
          />
        </div>

        <template #footer>
          <UPagination
            v-model="announcementPage"
            :page-count="1"
            :total="announcement.announcements.length"
          />
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>

</style>
