import type { SystemSettings } from "@nanaminakano/pfsdk"

export const useSiteSettingStore = defineStore("siteSettingStore", () => {
  const siteSetting = ref<SystemSettings>(<SystemSettings>{})
  const pfClient = usePfClient()

  async function fetch() {
    await pfClient.system.getSettings().then((rps) => {
      if (rps.Ok) {
        siteSetting.value = rps.Data!
      }
    })
  }

  return { siteSetting, fetch }
})
