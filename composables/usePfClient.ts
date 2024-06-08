import { PfClient } from "@nanaminakano/pfsdk"

export const usePfClient = () => {
  const config = useRuntimeConfig()
  return new PfClient(config.public.apiEndpoint)
}
