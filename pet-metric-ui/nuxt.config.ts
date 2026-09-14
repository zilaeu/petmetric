export default defineNuxtConfig({
  compatibilityDate: '2026-08-31',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en-US' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#102a43' },
        { name: 'color-scheme', content: 'light' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },
  routeRules: {
    '/reviews/petkit-pura-x/': { redirect: { to: '/reviews/petlibro-luma/', statusCode: 301 } },
    '/reviews/petkit-pura-max/': { redirect: { to: '/reviews/neakasa-m1-plus/', statusCode: 301 } },
    '/reviews/litter-robot-3-connect/': { redirect: { to: '/reviews/petsafe-scoopfree-smartspin/', statusCode: 301 } },
    '/reviews/petsafe-scoopfree-ultra/': { redirect: { to: '/reviews/petsafe-scoopfree-crystal-pro-legacy/', statusCode: 301 } },
    '/reviews/petkit-fresh-element-infinity/': { redirect: { to: '/reviews/petkit-yumshare-solo/', statusCode: 301 } },
    '/reviews/arf-pets-feeder/': { redirect: { to: '/reviews/voluas-automatic-cat-feeder/', statusCode: 301 } },
    '/reviews/fi-series-3/': { redirect: { to: '/reviews/tractive-dog-6/', statusCode: 301 } },
    '/reviews/tractive-gps-dog-4/': { redirect: { to: '/reviews/tractive-xl-smart-dog/', statusCode: 301 } },
    '/reviews/whistle-go-explore/': { redirect: { to: '/reviews/life360-pet-gps-tracker/', statusCode: 301 } },
    '/reviews/jiobit-smart-tag/': { redirect: { to: '/reviews/tractive-smart-cat-gps-tracker/', statusCode: 301 } },
    '/comparisons/tractive-gps-vs-fi-series-3/': { redirect: { to: '/comparisons/tractive-xl-vs-tractive-dog-6/', statusCode: 301 } },
    '/comparisons/life360-vs-tractive-smart-dog/': { redirect: { to: '/comparisons/life360-vs-tractive-dog-6/', statusCode: 301 } },
    '/comparisons/petlibro-granary-vs-arf-pets-feeder/': { redirect: { to: '/comparisons/petlibro-granary-vs-voluas-feeder/', statusCode: 301 } }
  },
  modules: ['nitro-cloudflare-dev'],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      // In production the Pages Functions API is same-origin. Keep the
      // external localhost URL available only when explicitly configured for
      // local development against the standalone REST service.
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },
  typescript: {
    strict: true,
    typeCheck: false
  }
})
