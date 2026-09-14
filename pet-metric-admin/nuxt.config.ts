export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-08-31',
  devtools: { enabled: true },
  css: ['~/assets/admin.css'],
  runtimeConfig: { public: { apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:4000/api/v1' } },
  app: { head: { title: 'PetMetric Admin', meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }] } }
})
