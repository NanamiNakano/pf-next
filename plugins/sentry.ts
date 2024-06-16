import * as Sentry from "@sentry/vue"

function lazyLoadSentryIntegrations() {
  // don't load on server
  if (!import.meta.client) return

  import("@sentry/vue").then((lazyLoadedSentry) => {
    Sentry.addIntegration(lazyLoadedSentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }))
  })
}

function getSentryIntegrations() {
  // don't load on server
  if (!import.meta.client) return []

  const router = useRouter()
  const browserTracing = Sentry.browserTracingIntegration({ router })

  return [browserTracing]
}

export default defineNuxtPlugin((nuxtApp) => {
  const vueApp = nuxtApp.vueApp
  const config = useRuntimeConfig()

  Sentry.init({
    app: vueApp,
    dsn: config.public.sentry.dsn,
    integrations: getSentryIntegrations(),

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: config.public.sentry.tracesSampleRate,

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost"],

    // This sets the sample rate. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: config.public.sentry.replaySampleRate,

    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: config.public.sentry.errorReplaySampleRate,
  })

  // Lazy-load the replay integration to reduce bundle size
  lazyLoadSentryIntegrations()
})
