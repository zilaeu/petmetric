<script setup lang="ts">
definePageMeta({ key: route => route.fullPath })
const route = useRoute()
const searchQuery = computed(() => String(route.query.q || '').trim())
const { data: categoryData } = await usePetMetricApi<any[]>('product-categories', '/categories', [])
const allProductData = ref<any[]>([])
if (searchQuery.value) {
  const { data } = await usePetMetricApi<any[]>(`all-products-search-${searchQuery.value}`, '/products?limit=100', [])
  allProductData.value = data.value
}
const { data: homeData } = await usePetMetricApi<any>('products-home-stats', '/home', {
  stats: { productsResearched: '—', productCategories: '—', comparisonsPublished: '—', guidesPublished: '—' }
})
const categories = computed(() => categoryData.value.map(category => ({
  ...category,
  criteria: category.criteria.map(criterion => typeof criterion === 'string' ? criterion : criterion.title)
})))
useSeoMeta({ title: 'Pet Products & Reviews — PetMetricus', description: 'Browse independently researched pet products across smart home, feeding, hydration, litter, grooming, cleanup, walking, and safety categories.', ogTitle: 'Pet Products & Reviews — PetMetricus', ogDescription: 'Browse independently researched pet products across practical pet-care categories.' })
useHead(() => ({
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'Pet product categories',
    itemListElement: categories.value.map((category, index) => ({ '@type': 'ListItem', position: index + 1, name: category.title, url: `https://petmetricus.com/products/${category.slug}/` }))
  }) }]
}))
const stats = computed(() => homeData.value.stats)
const heroSubtitle = computed(() => `${stats.value.productsResearched} products across ${stats.value.productCategories} categories. Every entry includes reliability data, full-cost analysis, and a plain-language verdict on who it's for.`)
const heroStats = computed(() => [
  { value: String(stats.value.productsResearched), label: 'products total' },
  { value: String(stats.value.productCategories), label: 'categories' },
  { value: String(stats.value.comparisonsPublished), label: 'comparisons' },
  { value: String(stats.value.guidesPublished), label: 'buying guides' }
])
const searchResults = computed(() => {
  const query = searchQuery.value.toLocaleLowerCase('en-US')
  if (!query) return []
  return allProductData.value.filter(product => `${product.name} ${product.brand} ${product.categorySlug} ${product.specs?.join(' ') || ''}`.toLocaleLowerCase('en-US').includes(query))
})
</script>
<template>
  <div>
    <DesignHero eyebrow="Product database" title="Pet tech, researched and ranked." :subtitle="heroSubtitle" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Products' }]" :stats="heroStats" />
    <section class="criteria-strip"><div class="container"><span>Choose around your real routine:</span><b v-for="item in ['Pet fit','Daily usefulness','Setup effort','Care and cleaning','Ongoing cost','Support when needed']" :key="item">{{ item }}</b></div></section>
    <section v-if="searchQuery" class="home-section product-search-results"><div class="container"><div class="design-section-heading"><div><p class="design-section-label">Search results</p><h2 class="display">{{ searchResults.length }} result{{ searchResults.length === 1 ? '' : 's' }} for “{{ searchQuery }}”</h2></div><NuxtLink class="text-link" to="/products/">Clear search</NuxtLink></div><div v-if="searchResults.length" class="design-product-list"><DesignProductCard v-for="(product,index) in searchResults" :key="product.slug" :product="product" :generic="true" :rank="index + 1" /></div><div v-else class="empty-state">No products match this search. Try a brand, product name, or category such as “camera” or “feeder”.</div></div></section>
    <section class="home-section products-hub-section"><div class="container"><div class="design-section-heading"><div><p class="design-section-label">{{ stats.productCategories }} categories</p><h2 class="display">Choose your product type.</h2></div></div><div class="hub-category-grid"><article v-for="category in categories" :key="category.slug" class="hub-category-card"><div class="hub-category-image"><R2Image :image-key="category.imageKey" :fallback="category.img" :alt="category.alt" /><div class="image-overlay" /><div class="hub-category-overlay"><div><span>{{ category.count }} products · {{ category.priceRange || 'Price unavailable' }}</span><h3>{{ category.title }}</h3></div></div></div><div class="hub-category-body"><p>{{ category.description }}</p><p class="design-section-label">Key buying criteria</p><ul><li v-for="criterion in category.criteria" :key="criterion">{{ criterion }}</li></ul><div class="hub-actions"><NuxtLink class="btn btn--dark" :to="`/products/${category.slug}/`">Browse {{ category.count }} products <AppIcon name="arrow" :size="13" /></NuxtLink><NuxtLink class="btn btn--light" :to="{ path: '/best-picks/', query: { category: category.slug } }">Best picks</NuxtLink></div></div></article></div><div v-if="!categories.length" class="empty-state">Product categories are temporarily unavailable.</div><div class="hub-link-grid"><NuxtLink v-for="item in [{icon:'scale',title:'Compare products',body:'Head-to-head on identical criteria.',to:'/comparisons/',cta:'Comparison library'},{icon:'target',title:'Best picks by use case',body:'Named winners for specific situations.',to:'/best-picks/',cta:'See best picks'},{icon:'wrench',title:'Fix a problem',body:'Symptom-first troubleshooting guides.',to:'/troubleshooting/',cta:'Troubleshooting'}]" :key="item.title" class="hub-link-card" :to="item.to"><span aria-hidden="true"><AppIcon :name="item.icon as any" :size="22" /></span><h3>{{ item.title }}</h3><p>{{ item.body }}</p><strong>{{ item.cta }} <AppIcon name="arrow" :size="12" /></strong></NuxtLink></div></div></section>
  </div>
</template>
