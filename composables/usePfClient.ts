import { PfClient } from "@nanaminakano/pfsdk"

export const usePfClient = () => {
  const config = useRuntimeConfig()
  const pfClient = new PfClient(config.public.apiEndpoint)
  return pfClient
}
