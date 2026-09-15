declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const measurementId = String(useRuntimeConfig().public.gaMeasurementId || '').trim()
  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return

  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: unknown[]) => window.dataLayer.push(args)
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  script.dataset.purpose = 'analytics'
  document.head.appendChild(script)

  const trackPageView = () => {
    window.gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`
    })
  }

  // Nuxt emits page:finish after both initial hydration and client-side
  // navigations, so each route is counted once without a full reload.
  nuxtApp.hook('page:finish', trackPageView)
})
