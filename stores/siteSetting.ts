import type { SystemSettings } from "@nanaminakano/pfsdk"

export const useSiteSettingStore = defineStore("siteSettingStore", () => {
  const siteSetting = ref(<SystemSettings>{ site_name: "PortForward", version: "0.1.0" })
  const pfClient = usePfClient()

  function fetch() {
    pfClient.system.getSettings().then((rps) => {
      if (rps.Ok) {
        siteSetting.value = rps.Data!
      }
    })
  }

  return { siteSetting, fetch }
})
