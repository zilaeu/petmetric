export interface ApiListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ApiEnvelope<T> {
  data: T
  meta?: ApiListMeta
}

export async function usePetMetricApi<T = unknown>(key: string, path: string, fallback: T) {
  const config = useRuntimeConfig()
  const source = ref<'api' | 'fallback'>('api')
  // Keep the failure marker in Nuxt payload/state so a failed SSR request can
  // be retried once after the browser has mounted (for example while the API
  // server or database is still starting).
  const failed = useState(`petmetric-api-failed:${key}`, () => false)

  const notFound = useState(`petmetric-api-not-found:${key}`, () => false)
  const statePromise = useAsyncData(key, async () => {
    try {
      // A relative $fetch during Cloudflare SSR can execute without the
      // Pages request context (and therefore without D1/R2 bindings). Use the
      // current request origin for server-side reads so the API is handled as
      // a normal Pages request with bindings attached.
      const baseURL = import.meta.server
        ? `${useRequestURL().origin}${config.public.apiBase}`
        : config.public.apiBase
      const response = await $fetch<ApiEnvelope<T>>(path, {
        baseURL,
        retry: 1,
        timeout: 5000
      })
      source.value = 'api'
      failed.value = false
      notFound.value = false
      return response.data
    } catch (error) {
      source.value = 'fallback'
      failed.value = true
      const statusCode = Number((error as any)?.statusCode || (error as any)?.response?.status || 0)
      notFound.value = statusCode === 404
      console.warn(`[PetMetricus API] ${path} unavailable; using bundled fallback data.`, error)
      return fallback
    }
  }, {
    default: () => fallback,
    dedupe: 'defer'
  })

  if (import.meta.client) {
    // Register the lifecycle hook before awaiting useAsyncData. Registering it
    // after an await loses the active component instance in async setup.
    onMounted(async () => {
      if (!failed.value) return
      failed.value = false
      const state = await statePromise
      await state.refresh()
    })
  }

  const state = await statePromise
  return { ...state, source, notFound }
}
