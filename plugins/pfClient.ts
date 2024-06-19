import { PfClient } from "@nanaminakano/pfsdk"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const pfClient = new PfClient(config.public.apiEndpoint)
  return {
    provide: {
      pfClient: pfClient,
    },
  }
})
