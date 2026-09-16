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
const { data: searchableProducts } = await usePetMetricApi<any[]>('global-search-products', '/products?limit=100', [])
const { data: searchableComparisons } = await usePetMetricApi<any[]>('global-search-comparisons', '/comparisons?limit=100', [])
const { data: searchableTroubleshooting } = await usePetMetricApi<any[]>('global-search-troubleshooting', '/troubleshooting?limit=100', [])
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
const globalSearchResults = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('en-US')
  if (query.length < 2) return []
  const matches = (value: unknown) => String(value || '').toLocaleLowerCase('en-US').includes(query)
  return [
    ...searchableProducts.value.filter(item => matches(`${item.name} ${item.brand} ${item.categorySlug}`)).slice(0, 4).map(item => ({ type: 'Product', title: item.name, detail: item.brand || item.category, to: `/reviews/${item.slug}/` })),
    ...searchableComparisons.value.filter(item => matches(`${item.a} ${item.b} ${item.category}`)).slice(0, 4).map(item => ({ type: 'Comparison', title: `${item.a} vs ${item.b}`, detail: item.category, to: item.href })),
    ...searchableTroubleshooting.value.filter(item => matches(`${item.product} ${item.problem} ${item.description || ''}`)).slice(0, 4).map(item => ({ type: 'Troubleshooting', title: item.problem, detail: item.product, to: item.href })),
  ]
})

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
  if (globalSearchResults.value[0]) navigateTo(globalSearchResults.value[0].to)
  else navigateTo(`/products/?q=${encodeURIComponent(searchQuery.value.trim())}`)
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
          <div class="search-input-row"><input id="site-search" ref="searchInput" v-model="searchQuery" type="search" autocomplete="off" placeholder="Search products, comparisons, or troubleshooting…" /><button class="btn btn--accent" type="submit">Search</button></div>
          <div v-if="searchQuery.trim().length >= 2" class="global-search-results"><NuxtLink v-for="item in globalSearchResults" :key="`${item.type}-${item.to}`" :to="item.to" @click="closeNavigation"><span>{{ item.type }}</span><strong>{{ item.title }}</strong><small>{{ item.detail }}</small></NuxtLink><p v-if="!globalSearchResults.length">No matching products, comparisons, or troubleshooting guides.</p></div>
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
.global-search-results { grid-column: 2; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; max-height: 320px; overflow: auto; }
.global-search-results a { display: grid; gap: 2px; padding: 10px 12px; border: 1px solid rgba(255,255,255,.12); border-radius: 4px; background: rgba(255,255,255,.06); color: white; text-decoration: none; }
.global-search-results a:hover { border-color: var(--accent); background: rgba(255,255,255,.1); }
.global-search-results span { color: var(--accent); font: 10px var(--font-mono); letter-spacing: .05em; text-transform: uppercase; }
.global-search-results strong { overflow: hidden; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.global-search-results small { overflow: hidden; color: rgba(255,255,255,.55); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.global-search-results p { grid-column: 1/-1; margin: 4px 0 0; color: rgba(255,255,255,.65); font-size: 13px; }
@media (max-width: 767px) {
  .search-panel { padding: 12px 0; }
  .search-panel form { grid-template-columns: 1fr; gap: 8px; }
  .search-input-row input, .search-input-row .btn { min-height: 44px; height: 44px; }
  .global-search-results { grid-column: 1; grid-template-columns: 1fr; }
}
</style>
