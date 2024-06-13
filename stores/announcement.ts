import { defineStore } from "pinia"
import type { AnnouncementData } from "@nanaminakano/pfsdk"

export const useAnnouncementStore = defineStore("announcementStore", () => {
  const announcements = ref<AnnouncementData[]>([])
  const pfClient = usePfClient()

  async function fetchAll() {
    await pfClient.announcement.getAnnouncements().then((rps) => {
      if (rps.Ok) {
        announcements.value = rps.Data!
      }
    })
  }

  return { announcements, fetchAll }
})
