import { PfClient } from "@nanaminakano/pfsdk"

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const pfClient = new PfClient(config.public.apiEndpoint)
  nuxtApp.provide("pfClient", pfClient)
})
