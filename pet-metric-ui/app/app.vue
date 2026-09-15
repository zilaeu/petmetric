<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const canonicalOrigin = computed(() => {
  const configured = String(runtimeConfig.public.siteUrl || '').replace(/\/$/, '')
  return configured && !configured.includes('localhost') ? configured : 'https://petmetricus.com'
})
useHead(() => ({
  link: [{ rel: 'canonical', href: `${canonicalOrigin.value}${route.path}` }],
  meta: [
    { property: 'og:url', content: `${canonicalOrigin.value}${route.path}` },
    { property: 'og:type', content: route.path.startsWith('/reviews/') || route.path.startsWith('/guides/') || route.path.startsWith('/comparisons/') || route.path.startsWith('/best-picks/') || route.path.startsWith('/troubleshooting/') ? 'article' : 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
}))

const mobileOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const searchButton = ref<HTMLButtonElement | null>(null)
const menuButton = ref<HTMLButtonElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const navItems = [
  { label: 'Products', to: '/products/' },
  { label: 'Comparisons', to: '/comparisons/' },
  { label: 'Best Picks', to: '/best-picks/' },
  { label: 'Troubleshooting', to: '/troubleshooting/' },
  { label: 'Guides', to: '/guides/' },
  { label: 'About', to: '/about/' }
]
const categoryOptions = await useCategoryOptions('navigation-categories')
const productItems = computed(() => categoryOptions.value.map(item => ({ label: item.label, to: `/products/${item.slug}/` })))

async function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    mobileOpen.value = false
    await nextTick()
    searchInput.value?.focus()
  }
}

function toggleMenu() {
  mobileOpen.value = !mobileOpen.value
  if (mobileOpen.value) searchOpen.value = false
}

function closeNavigation() {
  searchOpen.value = false
  mobileOpen.value = false
}

function handleNavigationEscape() {
  if (searchOpen.value) {
    searchOpen.value = false
    searchButton.value?.focus()
  } else if (mobileOpen.value) {
    mobileOpen.value = false
    menuButton.value?.focus()
  }
}

function submitSearch() {
  if (!searchQuery.value.trim()) return
  navigateTo(`/products/?q=${encodeURIComponent(searchQuery.value.trim())}`)
  closeNavigation()
}
</script>

<template>
  <NuxtRouteAnnouncer />
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header" @keydown.esc="handleNavigationEscape">
    <div class="container nav-inner">
      <NuxtLink class="brand" to="/" aria-label="PetMetricus home">
        <BrandMark /><span class="brand-name">PetMetricus</span>
      </NuxtLink>
      <nav class="nav-links" aria-label="Primary navigation">
        <div v-for="item in navItems" :key="item.to" class="nav-item">
          <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
        </div>
      </nav>
      <button ref="searchButton" class="nav-search" type="button" :aria-expanded="searchOpen" :aria-label="searchOpen ? 'Close search' : 'Open search'" aria-controls="site-search-panel" @click="toggleSearch">
        <AppIcon name="search" :size="18" /><span>Search products…</span>
      </button>
      <button ref="menuButton" class="mobile-toggle" type="button" :aria-expanded="mobileOpen" :aria-label="mobileOpen ? 'Close menu' : 'Open menu'" aria-controls="mobile-navigation" @click="toggleMenu">
        <AppIcon :name="mobileOpen ? 'close' : 'menu'" :size="22" />
      </button>
    </div>
    <div v-if="searchOpen" id="site-search-panel" class="search-panel">
      <div class="container">
        <form @submit.prevent="submitSearch">
          <label for="site-search">Search PetMetricus</label>
          <div class="search-input-row"><input id="site-search" ref="searchInput" v-model="searchQuery" type="search" placeholder="Try “automatic litter box”" /><button class="btn btn--accent" type="submit">Search</button></div>
        </form>
      </div>
    </div>
    <div id="mobile-navigation" class="mobile-menu" :class="{ open: mobileOpen }">
      <div class="container">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" @click="closeNavigation">{{ item.label }}</NuxtLink>
        <NuxtLink v-for="item in productItems" :key="item.to" class="sub-link" :to="item.to" @click="closeNavigation">{{ item.label }}</NuxtLink>
      </div>
    </div>
  </header>

  <main id="main-content"><NuxtPage /></main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <NuxtLink class="brand" to="/"><BrandMark /><span class="brand-name">PetMetricus</span></NuxtLink>
          <p>Independent pet technology research with documented methods, dated sources, and practical buying guidance.</p>
        </div>
        <div><p class="footer-heading">Research</p><div class="footer-links"><NuxtLink to="/comparisons/">Comparisons</NuxtLink><NuxtLink to="/best-picks/">Best Picks</NuxtLink><NuxtLink to="/troubleshooting/">Troubleshooting</NuxtLink><NuxtLink to="/guides/">Guides</NuxtLink></div></div>
        <div><p class="footer-heading">Company</p><div class="footer-links"><NuxtLink to="/about/">About PetMetricus</NuxtLink><NuxtLink to="/editorial-standards/">Editorial Standards</NuxtLink><NuxtLink to="/disclosure/">Disclosure</NuxtLink><NuxtLink to="/privacy/">Privacy</NuxtLink><NuxtLink to="/contact/">Contact</NuxtLink></div></div>
      </div>
      <div class="footer-bottom"><span>© 2026 PetMetricus. All product names are trademarks of their respective owners.</span><span><NuxtLink to="/disclosure/">Commercial disclosure →</NuxtLink></span></div>
    </div>
  </footer>
</template>

<style scoped>
.search-panel { padding: 12px 0; background: #101e36; }
.search-panel form { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: 16px; }
.search-panel label { display: block; margin: 0; color: rgba(255,255,255,.68); font: 11px var(--font-mono); text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; }
.search-input-row { display: flex; gap: 8px; min-width: 0; }
.search-input-row input { height: 36px; min-width: 0; flex: 1; padding: 7px 12px; border: 1px solid rgba(255,255,255,.24); border-radius: 3px; background: rgba(255,255,255,.08); color: white; }
.search-input-row .btn { min-height: 36px; height: 36px; padding-top: 7px; padding-bottom: 7px; }
.search-input-row input::placeholder { color: rgba(255,255,255,.5); }
@media (max-width: 767px) {
  .search-panel { padding: 12px 0; }
  .search-panel form { grid-template-columns: 1fr; gap: 8px; }
  .search-input-row input, .search-input-row .btn { min-height: 44px; height: 44px; }
}
</style>
