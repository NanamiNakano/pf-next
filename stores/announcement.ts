import { defineStore } from "pinia"
import type { AnnouncementData } from "@nanaminakano/pfsdk"

export const useAnnouncementStore = defineStore("announcementStore", () => {
  const announcements = ref<AnnouncementData[]>([])
  const toast = useToast()
  const pfClient = usePfClient()

  async function fetchAll() {
    await pfClient.announcement.getAnnouncements().then((rps) => {
      if (rps.Ok) {
        announcements.value = rps.Data!
      }
      else {
        toast.add({ title: "Error", color: "red" }) // TODO: i18n
      }
    }).catch(() => {
      toast.add({ title: "Error", color: "red" })
      console.log("Error")
    })
  }

  return { announcements, fetchAll }
})
