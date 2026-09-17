<script setup lang="ts">
definePageMeta({ key: route => route.fullPath })

const route = useRoute()
const slug = computed(() => String(route.params.category))
// Slugs are canonical lowercase identifiers. Reject mixed-case variants
// instead of rendering an unavailable 200 page (soft 404).
if (String(route.params.category) !== String(route.params.category).toLowerCase()) {
  throw createError({ statusCode: 404, statusMessage: 'Product category not found' })
}
const { data: categoryApiData, notFound: categoryNotFound } = await usePetMetricApi<any>(`category-${slug.value}`, `/categories/${slug.value}`, null)
const { data: productApiData } = await usePetMetricApi<any[]>(`category-products-${slug.value}`, `/categories/${slug.value}/products?limit=100`, [])
const { data: categoryComparisons } = await usePetMetricApi<any[]>(`category-comparisons-${slug.value}`, `/comparisons?category=${slug.value}&limit=100`, [])
const { data: categoryBestPicks } = await usePetMetricApi<any[]>(`category-best-picks-${slug.value}`, `/best-picks?category=${slug.value}&limit=100`, [])
const { data: categoryGuides } = await usePetMetricApi<any[]>(`category-guides-${slug.value}`, `/guides?category=${slug.value}&limit=100`, [])
const { data: categoryTroubleshooting } = await usePetMetricApi<any[]>(`category-troubleshooting-${slug.value}`, `/troubleshooting?category=${slug.value}&limit=100`, [])
if (categoryNotFound.value) throw createError({ statusCode: 404, statusMessage: 'Product category not found' })
const apiMeta = computed(() => categoryApiData.value?.title ? categoryApiData.value : null)
const apiProducts = computed(() => Array.isArray(productApiData.value) ? productApiData.value : null)
const effectiveMeta = computed(() => apiMeta.value || { title: 'Products unavailable', eyebrow: 'Product database', subtitle: 'This category is temporarily unavailable.', count: 0, reviewedCount: 0, comparisons: 0, updated: '—', criteria: [] })
const effectiveProducts = computed(() => apiProducts.value || [])
const relatedComparisons = computed(() => Array.isArray(categoryComparisons.value) ? categoryComparisons.value.slice(0, 2) : [])
const relatedBestPicks = computed(() => Array.isArray(categoryBestPicks.value) ? categoryBestPicks.value.slice(0, 2) : [])
const relatedGuides = computed(() => Array.isArray(categoryGuides.value) ? categoryGuides.value.slice(0, 2) : [])
const relatedTroubleshooting = computed(() => Array.isArray(categoryTroubleshooting.value) ? categoryTroubleshooting.value.slice(0, 2) : [])
const search = ref('')
const sort = ref('rank')
const openFaq = ref<number | null>(null)
const selectedFacets = reactive<Record<string, string>>({})
const currentPage = ref(1)
const pageSize = 10
const isLitterCategory = computed(() => slug.value === 'automatic-litter-boxes')
const pricedProducts = computed(() => effectiveProducts.value.filter(product => product.price != null && product.price !== '' && Number.isFinite(Number(product.price))))
const hasPriceFilter = computed(() => pricedProducts.value.length >= 2)
const priceFloor = computed(() => {
  if (!pricedProducts.value.length) return 0
  return Math.floor(Math.min(...pricedProducts.value.map(product => Number(product.price))) / 10) * 10
})
const priceCeiling = computed(() => {
  if (!pricedProducts.value.length) return 0
  return Math.ceil(Math.max(...pricedProducts.value.map(product => Number(product.price))) / 10) * 10
})
const maxPrice = ref(priceCeiling.value)
watch(priceCeiling, (value, previous) => {
  if (previous === undefined || maxPrice.value === previous) maxPrice.value = value
}, { immediate: true })
const criterionIcons = computed(() => ({
  'smart-pet-feeders': ['scale', 'clock', 'camera', 'external', 'source'],
  'gps-pet-trackers': ['tracker', 'clock', 'scale', 'target', 'shield'],
  'pet-cameras': ['scale', 'clock', 'source', 'feeder', 'scale'],
  'automatic-litter-boxes': ['litter', 'source', 'scale', 'external', 'source'],
  'smart-water-fountains': ['feeder', 'refresh', 'source', 'clock', 'scale', 'shield'],
  'pet-grooming-tools': ['scale', 'clock', 'source', 'shield'],
  'pet-waste-cleanup': ['shield', 'source', 'scale', 'external'],
  'pet-walking-safety': ['scale', 'shield', 'external', 'source']
}[slug.value] || []))

interface FacetOption { value: string; label: string; terms: string[]; exclude?: boolean; notTerms?: string[] }
interface FacetDefinition { key: string; label: string; options: FacetOption[] }
const facetDefinitions = computed<FacetDefinition[]>(() => ({
  'automatic-litter-boxes': [
    { key: 'design', label: 'Entry and cleaning design', options: [
      { value: 'open', label: 'Open or uncovered', terms: ['open-top', 'uncovered'] },
      { value: 'rotating', label: 'Rotating or globe style', terms: ['rotating', 'globe'], notTerms: ['open-top', 'uncovered'] }
    ] },
    { key: 'litter', label: 'Litter system', options: [
      { value: 'clumping', label: 'Clumping litter', terms: ['clumping'] },
      { value: 'crystal', label: 'Crystal tray', terms: ['crystal'] }
    ] },
    { key: 'connection', label: 'App connectivity', options: [
      { value: 'connected', label: 'App or Wi-Fi', terms: ['wi-fi', 'app tracking', 'usage tracking', 'ai-camera'], notTerms: ['no app'] },
      { value: 'standalone', label: 'No app required', terms: ['no app'] }
    ] }
  ],
  'smart-pet-feeders': [
    { key: 'camera', label: 'Meal visibility', options: [
      { value: 'camera', label: 'Built-in camera', terms: ['1080p'] },
      { value: 'no-camera', label: 'No camera', terms: ['no camera', 'without camera'] }
    ] },
    { key: 'control', label: 'Control style', options: [
      { value: 'connected', label: 'App or Wi-Fi control', terms: ['wi-fi', 'connected', 'remote control'], notTerms: ['app-free', 'without another app'] },
      { value: 'standalone', label: 'On-device scheduling', terms: ['on-device', 'app-free', 'without another app', 'programmable portion'] }
    ] }
  ],
  'gps-pet-trackers': [
    { key: 'pet', label: 'Designed for', options: [
      { value: 'dog', label: 'Dogs', terms: ['dog'] },
      { value: 'cat', label: 'Cats', terms: ['cat'] }
    ] },
    { key: 'battery', label: 'Battery priority', options: [
      { value: 'weeks', label: 'Multi-week claim', terms: ['week'] },
      { value: 'days', label: 'Daily / multi-day claim', terms: ['day'] }
    ] }
  ],
  'pet-cameras': [
    { key: 'interaction', label: 'Pet interaction', options: [
      { value: 'treats', label: 'Treat dispensing', terms: ['treat dispenser', 'treat toss', 'treat-dispensing', 'remote treats'], notTerms: ['no treats', 'no treat dispenser', 'without treat'] },
      { value: 'view-only', label: 'Camera only', terms: ['no treats', 'no treat dispenser', 'without treat'] }
    ] },
    { key: 'coverage', label: 'Room coverage', options: [
      { value: 'moving', label: 'Pan, tilt, or 360°', terms: ['pan', 'tilt', '360°', 'rotating'] },
      { value: 'fixed', label: 'Fixed view', terms: ['fixed'] }
    ] }
  ],
  'smart-water-fountains': [
    { key: 'filter', label: 'Ongoing supplies', options: [
      { value: 'filters', label: 'Replacement filters', terms: ['filterless', 'no replacement filter'], exclude: true },
      { value: 'filterless', label: 'No replacement filters', terms: ['filterless', 'no replacement filter'] }
    ] },
    { key: 'priority', label: 'Main priority', options: [
      { value: 'tracking', label: 'Hydration tracking', terms: ['hydration', 'drinking history', 'app monitoring'] },
      { value: 'cordless', label: 'Cordless placement', terms: ['cordless', 'battery'] }
    ] }
  ],
  'pet-grooming-tools': [
    { key: 'power', label: 'Power style', options: [{ value: 'cordless', label: 'Cordless', terms: ['cordless', 'battery'] }, { value: 'corded', label: 'Corded', terms: ['corded'] }] },
    { key: 'coat', label: 'Coat use', options: [{ value: 'thick', label: 'Thick coat', terms: ['thick', 'heavy coat'] }, { value: 'quiet', label: 'Quiet / nervous pets', terms: ['quiet', 'low-noise'] }] }
  ],
  'pet-waste-cleanup': [
    { key: 'routine', label: 'Cleanup routine', options: [{ value: 'pads', label: 'Pads and liquid containment', terms: ['pad', 'absorbent'] }, { value: 'litter', label: 'Litter tracking', terms: ['litter', 'tracking'] }] },
    { key: 'reusable', label: 'Replacement style', options: [{ value: 'reusable', label: 'Washable / reusable', terms: ['washable', 'reusable'] }, { value: 'disposable', label: 'Disposable refills', terms: ['disposable', 'refill'] }] }
  ],
  'pet-walking-safety': [
    { key: 'fit', label: 'Primary fit', options: [{ value: 'everyday', label: 'Everyday walks', terms: ['everyday', 'walking comfort'] }, { value: 'control', label: 'Extra control', terms: ['handle', 'strong dogs'] }] },
    { key: 'visibility', label: 'Visibility', options: [{ value: 'reflective', label: 'Reflective / low light', terms: ['reflective', 'visibility'] }] }
  ]
}[slug.value] || []))

const productSearchText = (product: any) => [product.name, product.brand, product.verdict, product.bestFor, product.subscription, ...(product.specs || []), ...Object.values(product.filterSpecs || {})].join(' ').toLowerCase()
const productFacetText = (product: any) => [product.name, product.verdict, product.bestFor, ...(product.specs || []), ...Object.values(product.filterSpecs || {})].join(' ').toLowerCase()
const containsFacetTerm = (text: string, term: string) => {
  const normalized = term.toLowerCase()
  if (!/^[a-z0-9]+$/.test(normalized)) return text.includes(normalized)
  return new RegExp(`\\b${normalized}\\b`, 'i').test(text)
}
const matchesFacet = (product: any, facet: FacetDefinition) => {
  const selected = selectedFacets[facet.key]
  if (!selected || selected === 'all') return true
  const option = facet.options.find(item => item.value === selected)
  if (!option) return true
  const text = productFacetText(product)
  if (option.notTerms?.some(term => containsFacetTerm(text, term))) return false
  const includesTerm = option.terms.some(term => containsFacetTerm(text, term))
  return option.exclude ? !includesTerm : includesTerm
}

const sortOptions = computed(() => [
  { value: 'rank', label: 'PetMetricus order' },
  { value: 'rating', label: 'Highest owner rating' },
  { value: 'reviews', label: 'Most owner feedback' },
  { value: 'name', label: 'Product name A–Z' },
  ...(hasPriceFilter.value ? [{ value: 'price-asc', label: 'Price: low to high' }, { value: 'price-desc', label: 'Price: high to low' }] : [])
])

const products = computed(() => [...effectiveProducts.value]
  .filter(p => !hasPriceFilter.value || maxPrice.value === priceCeiling.value || (p.price != null && p.price <= maxPrice.value))
  .filter(p => !search.value || productSearchText(p).includes(search.value.toLowerCase()))
  .filter(p => facetDefinitions.value.every(facet => matchesFacet(p, facet)))
  .sort((a, b) => sort.value === 'price-asc' ? (a.price ?? Infinity) - (b.price ?? Infinity)
    : sort.value === 'price-desc' ? (b.price ?? -Infinity) - (a.price ?? -Infinity)
      : sort.value === 'rating' ? (b.amazonRating ?? b.score ?? -Infinity) - (a.amazonRating ?? a.score ?? -Infinity)
        : sort.value === 'reviews' ? (b.amazonReviewCount ?? -Infinity) - (a.amazonReviewCount ?? -Infinity)
          : sort.value === 'name' ? String(a.name).localeCompare(String(b.name))
            : (a.rank ?? Infinity) - (b.rank ?? Infinity)))
const pageCount = computed(() => Math.max(1, Math.ceil(products.value.length / pageSize)))
const pagedProducts = computed(() => products.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))
watch([search, maxPrice, sort, selectedFacets], () => { currentPage.value = 1 }, { deep: true })
const reset = () => {
  search.value = ''
  maxPrice.value = priceCeiling.value
  sort.value = 'rank'
  for (const key of Object.keys(selectedFacets)) delete selectedFacets[key]
}

useHead(() => ({
  title: `${effectiveMeta.value.title} — PetMetricus`,
  meta: [{ name: 'description', content: seoDescription(`${effectiveMeta.value.title}: ${effectiveMeta.value.subtitle}`) }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://petmetricus.com/' },
        { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://petmetricus.com/products/' },
        { '@type': 'ListItem', position: 3, name: effectiveMeta.value.title, item: `https://petmetricus.com/products/${slug.value}/` }
      ]
    }) },
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'ItemList', name: `${effectiveMeta.value.title} product research`,
      numberOfItems: effectiveProducts.value.length,
      itemListElement: effectiveProducts.value.map((product: any, index: number) => ({
        '@type': 'ListItem', position: index + 1, name: product.name,
        url: `https://petmetricus.com/reviews/${product.slug}/`
      }))
    }) }
  ]
}))
</script>

<template>
  <div>
    <DesignHero :eyebrow="effectiveMeta.eyebrow" :title="effectiveMeta.title" :subtitle="effectiveMeta.subtitle" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products/' }, { label: effectiveMeta.title }]" :stats="[{ value: String(effectiveMeta.count), label: 'products' }, { value: String(effectiveMeta.reviewedCount ?? 0), label: 'reviewed in depth' }, { value: effectiveMeta.updated || '—', label: 'last updated' }, { value: String(effectiveMeta.comparisons ?? 0), label: 'comparisons' }]" />
    <section class="category-criteria" :class="{ 'category-criteria--litter': isLitterCategory }"><div class="container"><div v-for="(criterion, index) in effectiveMeta.criteria" :key="criterion.title" class="category-criterion"><span>0{{ index + 1 }}</span><strong><i v-if="criterionIcons[index]" aria-hidden="true"><AppIcon :name="criterionIcons[index] as any" :size="16" /></i>{{ criterion.title }}</strong><p>{{ criterion.description }}</p></div></div></section>
    <section class="category-decision-path"><div class="container"><p class="design-section-label muted-label">Choose your next step</p><div class="category-decision-grid"><NuxtLink to="#product-shortlist"><strong>I'm choosing a product</strong><span>Browse the filtered shortlist and full specifications →</span></NuxtLink><NuxtLink v-if="relatedComparisons.length" :to="`/comparisons/${relatedComparisons[0].slug}/`"><strong>I'm comparing two options</strong><span>{{ relatedComparisons[0].a }} vs {{ relatedComparisons[0].b }} →</span></NuxtLink><NuxtLink v-else to="/comparisons/"><strong>I'm comparing two options</strong><span>Open the comparison library →</span></NuxtLink><NuxtLink v-if="relatedBestPicks.length" :to="relatedBestPicks[0].href"><strong>I want a scenario recommendation</strong><span>{{ relatedBestPicks[0].title }} →</span></NuxtLink><NuxtLink v-else to="/best-picks/"><strong>I want a scenario recommendation</strong><span>Open Best Picks →</span></NuxtLink><NuxtLink v-if="relatedTroubleshooting.length" :to="relatedTroubleshooting[0].href"><strong>I already own a product</strong><span>{{ relatedTroubleshooting[0].title }} →</span></NuxtLink><NuxtLink v-else to="/troubleshooting/"><strong>I already own a product</strong><span>Open Troubleshooting →</span></NuxtLink></div></div></section>
    <section class="category-main home-section" :class="{ 'category-main--litter': isLitterCategory }">
      <div class="container category-layout">
        <aside class="category-filters">
          <div class="filter-panel">
            <p class="design-section-label">Filter & search</p>
            <label class="filter-search"><AppIcon name="search" :size="17" /><input v-model="search" type="search" :placeholder="`Search ${effectiveMeta.title.toLowerCase()}…`" /></label>
            <label v-if="hasPriceFilter" class="price-control"><span>Max price <strong>${{ maxPrice }}</strong></span><input v-model.number="maxPrice" type="range" :min="priceFloor" :max="priceCeiling" :step="10" /><small><i>${{ priceFloor }}</i><i>${{ priceCeiling }}</i></small></label>
            <template v-for="facet in facetDefinitions" :key="facet.key">
              <p class="design-section-label filter-subhead">{{ facet.label }}</p>
              <div class="filter-choice-list">
                <button :class="{ active: !selectedFacets[facet.key] || selectedFacets[facet.key] === 'all' }" :aria-pressed="!selectedFacets[facet.key] || selectedFacets[facet.key] === 'all'" @click="selectedFacets[facet.key] = 'all'">Any</button>
                <button v-for="option in facet.options" :key="option.value" :class="{ active: selectedFacets[facet.key] === option.value }" :aria-pressed="selectedFacets[facet.key] === option.value" @click="selectedFacets[facet.key] = option.value">{{ option.label }}</button>
              </div>
            </template>
            <button class="reset-button" @click="reset">Reset</button>
          </div>
          <div class="filter-related"><p class="design-section-label">Related</p><NuxtLink v-if="slug === 'smart-pet-feeders'" to="/best-picks/best-pet-feeder-portion-control/">Best feeder for portion control</NuxtLink><NuxtLink v-else-if="slug === 'gps-pet-trackers'" to="/best-picks/best-gps-tracker-escape-prone-dogs/">Best GPS for escape-prone dogs</NuxtLink><NuxtLink v-else-if="slug === 'pet-cameras'" to="/best-picks/best-pet-camera-separation-anxiety/">Best camera for separation anxiety</NuxtLink><NuxtLink v-else-if="slug === 'pet-grooming-tools'" to="/best-picks/best-quiet-grooming-clipper/">Best quiet grooming clipper</NuxtLink><NuxtLink v-else-if="slug === 'pet-waste-cleanup'" to="/best-picks/best-large-dog-training-pad/">Best large-area training pad</NuxtLink><NuxtLink v-else-if="slug === 'pet-walking-safety'" to="/best-picks/best-everyday-dog-harness/">Best everyday dog harness</NuxtLink><NuxtLink v-else to="/best-picks/">Best picks</NuxtLink><NuxtLink to="/comparisons/">Compare products</NuxtLink><NuxtLink to="/troubleshooting/">Troubleshooting</NuxtLink></div>
        </aside>
        <div id="product-shortlist" class="category-results">
          <h2 class="sr-only">{{ effectiveMeta.title }} products</h2>
          <div class="category-results-header"><span>Showing <strong>{{ products.length }}</strong> of {{ effectiveProducts.length }}</span><label>Sort by: <select v-model="sort"><option v-for="option in sortOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select></label></div>
          <div class="design-product-list"><DesignProductCard v-for="(product, index) in pagedProducts" :key="product.slug" :product="product" :generic="true" :rank="(currentPage - 1) * pageSize + index + 1" /><div v-if="!products.length" class="empty-state">No products match your filters. Reset the filters to restore the full shortlist.</div></div><nav v-if="pageCount > 1" class="pagination" aria-label="Product pages"><button v-for="page in pageCount" :key="page" type="button" :class="{active: currentPage === page}" :aria-current="currentPage === page ? 'page' : undefined" @click="currentPage = page">{{ page }}</button></nav>
        </div>
      </div>
    </section>
    <section class="category-related-content"><div class="container"><div class="design-section-heading"><div><p class="design-section-label muted-label">Continue research</p><h2 class="display">The useful next pages for {{ effectiveMeta.title }}.</h2></div><p>Stay within this category while moving from shortlist to recommendation, comparison, education, or post-purchase help.</p></div><div class="category-related-grid"><section><p class="design-section-label">Best Picks</p><NuxtLink v-for="item in relatedBestPicks" :key="item.slug" :to="item.href"><strong>{{ item.title }}</strong><span>{{ item.pick }}</span></NuxtLink><NuxtLink class="related-more" :to="{ path: '/best-picks/', query: { category: slug } }">View all Best Picks →</NuxtLink></section><section><p class="design-section-label">Comparisons</p><NuxtLink v-for="item in relatedComparisons" :key="item.slug" :to="item.href"><strong>{{ item.a }} vs {{ item.b }}</strong><span>{{ item.comparisonType || 'Direct alternative' }}</span></NuxtLink><NuxtLink class="related-more" :to="{ path: '/comparisons/', query: { category: slug } }">View all comparisons →</NuxtLink></section><section><p class="design-section-label">Guides</p><NuxtLink v-for="item in relatedGuides" :key="item.slug" :to="item.href"><strong>{{ item.title }}</strong><span>{{ item.readTime }}</span></NuxtLink><NuxtLink class="related-more" :to="{ path: '/guides/', query: { category: slug } }">View all Guides →</NuxtLink></section><section><p class="design-section-label">Troubleshooting</p><NuxtLink v-for="item in relatedTroubleshooting" :key="item.slug" :to="item.href"><strong>{{ item.title }}</strong><span>{{ item.problem }}</span></NuxtLink><NuxtLink class="related-more" :to="{ path: '/troubleshooting/', query: { category: slug } }">View all troubleshooting →</NuxtLink></section></div></div></section>
    <section class="category-table-section"><div class="container"><p class="design-section-label muted-label">Quick shortlist</p><h2 class="display">Compare all {{ effectiveProducts.length }} products</h2><p class="table-scroll-hint">Swipe or use the arrow keys to see every column.</p><div class="table-scroll" tabindex="0" role="region" :aria-label="`${effectiveMeta.title} product comparison table`"><table class="design-table design-table--shortlist"><thead><tr><th>#</th><th>Product</th><th>Owner rating</th><th>Best fit</th><th>Before you choose</th><th>Details</th></tr></thead><tbody><tr v-for="(product, index) in effectiveProducts" :key="product.slug"><td>#{{ index + 1 }}</td><td><strong>{{ product.name }}</strong></td><td class="table-score">{{ product.amazonRating == null ? '—' : `${Number(product.amazonRating).toFixed(1)} (${Number(product.amazonReviewCount || 0).toLocaleString('en-US')})` }}</td><td class="table-best-fit">{{ product.bestFor || '—' }}</td><td class="table-consideration">{{ product.verdict || '—' }}</td><td class="table-details"><NuxtLink :to="`/reviews/${product.slug}/`">Review <AppIcon name="arrow" :size="12" /></NuxtLink></td></tr></tbody></table></div></div></section>
    <section v-if="slug === 'automatic-litter-boxes'" class="category-faq"><div class="container article-page"><p class="design-section-label muted-label">Common questions</p><h2 class="display">Before you choose</h2><div v-for="(faq, index) in [['Do automatic litter boxes work with any litter?','Most units require clumping litter. Crystal-tray models are the main exception, and mixing litter types can affect sensors and cycling.'],['How much should I budget beyond the purchase price?','Include litter, waste bags, replacement trays, filters, and any optional app subscription in a 12-month estimate.'],['Is an automatic litter box safe for every cat?','Check the manufacturer weight range and introduce the unit gradually. Stop use and contact support if a mechanism behaves unexpectedly.']]" :key="faq[0]" class="faq-row"><button :aria-expanded="openFaq === index" @click="openFaq = openFaq === index ? null : index"><span>{{ faq[0] }}</span><span aria-hidden="true">{{ openFaq === index ? '−' : '+' }}</span></button><p v-if="openFaq === index">{{ faq[1] }}</p></div></div></section>
  </div>
</template>
