import type { UserData } from "@nanaminakano/pfsdk"

export const useUserDataStore = defineStore("userDataStore", () => {
  const userData = ref({} as UserData)
  const pfClient = usePfClient()

  function fetch() {
    pfClient.user.getData().then((rps) => {
      if (rps.Ok) {
        userData.value = rps.Data!
      }
    })
  }

  return { userData, fetch }
})
