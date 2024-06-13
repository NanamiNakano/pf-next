<script setup lang="ts">
import markdownit from "markdown-it"

const userData = useUserDataStore()
const announcement = useAnnouncementStore()
const loadingAnnouncement = ref(true)
const showAnnouncementModel = ref(false)
const readAnnouncement = ref(0)
const announcementPage = ref(1)
const md = markdownit()

onMounted(async () => {
  await announcement.fetchAll()
  loadingAnnouncement.value = false

  const storageRead = localStorage.getItem("readAnnouncement")
  if (!storageRead) {
    localStorage.setItem("readAnnouncement", "0")
  }
  if (announcement.announcements.length === 1) {
    readAnnouncement.value = announcement.announcements[0].id
  }
  else {
    readAnnouncement.value = parseInt(storageRead!)
  }

  watch(announcementPage, () => {
    if (readAnnouncement.value < announcement.announcements[announcementPage.value - 1].id) {
      readAnnouncement.value = announcement.announcements[announcementPage.value - 1].id
      localStorage.setItem("readAnnouncement", readAnnouncement.value.toString())
    }
  })
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

      <template
        v-if="!loadingAnnouncement && announcement.announcements.length >= 0"
        #footer
      >
        <UButton
          :label="$t('text.index.readAll')"
          @click="showAnnouncementModel = true"
        >
          <template #trailing>
            <div class="font-light">
              {{
                announcement.announcements.filter((item) => {
                  return item.id > readAnnouncement
                }).length
              }} {{ $t("text.index.unread") }}
            </div>
          </template>
        </UButton>
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
