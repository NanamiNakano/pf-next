import { defineStore } from "pinia"
import type { AnnouncementData } from "@nanaminakano/pfsdk"

export const useAnnouncementStore = defineStore("announcementStore", () => {
  const announcements = ref<AnnouncementData[]>([])
  const toast = useToast()
  const { t } = useI18n()
  const pfClient = usePfClient()

  async function fetchAll() {
    await pfClient.announcement.getAnnouncements().then((rps) => {
      if (rps.Ok) {
        announcements.value = rps.Data!
      }
      else {
        toast.add({ title: t("text.announcement.toast.error.title"), description: rps.Msg, color: "red" })
      }
    })
  }

  return { announcements, fetchAll }
})
