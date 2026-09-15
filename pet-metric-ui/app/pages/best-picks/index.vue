<script setup lang="ts">
const { data: bestPickData } = await usePetMetricApi<any[]>('best-picks', '/best-picks?limit=100', [])
const route = useRoute()
const router = useRouter()
const categoryFilters = await useCategoryOptions('best-pick-categories')
const categorySlugs = computed(() => categoryFilters.value.map(item => item.slug))
const queryCategory = String(route.query.category || '')
const active = ref(categorySlugs.value.includes(queryCategory) ? queryCategory : 'all')
const openPick = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = 9

watch(() => route.query.category, (value) => {
  const category = String(value || '')
  active.value = categorySlugs.value.includes(category) ? category : 'all'
  openPick.value = null
})

function setActive(category: string) {
  active.value = category
  openPick.value = null
  router.replace({ path: route.path, query: category === 'all' ? {} : { category } })
}

const picks = computed(() => {
  const items = active.value === 'all' ? bestPickData.value : bestPickData.value.filter(item => item.categorySlug === active.value)
  return items.map(item => ({
    ...item,
    verdict: item.content?.why || item.tradeoff,
    bestFor: item.content?.why || item.pick,
    notFor: item.content?.notFor || '',
    alternatives: item.content?.alternatives || []
  }))
})
const pageCount = computed(() => Math.max(1, Math.ceil(picks.value.length / pageSize)))
const pagedPicks = computed(() => picks.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))
watch(active, () => { currentPage.value = 1 })

useSeoMeta({ title: 'Best Picks — PetMetricus', description: 'Scenario-based pet technology recommendations with budget and tradeoffs.' })
</script>

<template>
  <div>
    <DesignHero eyebrow="Scene-based buying guides" title="The best pick for your situation." subtitle="Every guide names a winner, explains the trade-offs, and states who it does and doesn't suit. No composite scores — just a clear recommendation for a specific use case." :breadcrumb="[{label:'Home',to:'/'},{label:'Best Picks'}]" />
    <section class="bp-section"><div class="container">
      <div class="filter-row"><span>Category:</span><button :class="{active:active==='all'}" :aria-pressed="active==='all'" @click="setActive('all')">All</button><button v-for="item in categoryFilters" :key="item.slug" :class="{active:active===item.slug}" :aria-pressed="active===item.slug" @click="setActive(item.slug)">{{ item.label }}</button></div>
      <div class="bp-grid"><article v-for="pick in pagedPicks" :key="pick.href" class="bp-card" :class="{open:openPick===pick.href}">
        <button class="bp-card-toggle" type="button" :aria-expanded="openPick===pick.href" @click="openPick = openPick === pick.href ? null : pick.href"><div class="bp-image"><R2Image :image-key="pick.imageKey" :fallback="pick.img" :alt="pick.pick" /><span>{{ pick.category }}</span></div><div class="bp-body"><h2>{{ pick.title }}</h2><div class="bp-winner"><span>Our pick</span><strong>{{ pick.pick }}</strong><b>{{ pick.budget }}</b></div><p>{{ pick.verdict }}</p><footer><span>Updated {{ pick.updated || '—' }}</span><strong>{{ openPick === pick.href ? 'Close preview' : 'Preview decision' }} <AppIcon name="arrow" :size="12" /></strong></footer></div></button>
        <div v-if="openPick===pick.href" class="bp-expanded"><div class="bp-expanded-intro"><p class="design-section-label">Decision preview</p><h3>Is {{ pick.pick }} right for this situation?</h3></div><div class="bp-fit-grid"><div><strong>It fits when</strong><p>{{ pick.bestFor }}</p></div><div><strong>Look elsewhere when</strong><p>{{ pick.notFor || 'The live listing does not meet your household requirements or budget.' }}</p></div></div><template v-if="pick.alternatives.length"><p class="modal-label">Also consider</p><div class="bp-alternatives"><p v-for="alt in pick.alternatives" :key="alt[0]"><strong>{{ alt[0] }}</strong><span>{{ alt[1] }}</span></p></div></template><div class="modal-actions"><NuxtLink class="btn btn--accent" :to="pick.href">Read the full guide <AppIcon name="arrow" :size="13" /></NuxtLink><NuxtLink class="btn btn--light" :to="`/products/${pick.categorySlug}/`">Browse all {{ pick.category }}</NuxtLink></div></div>
      </article></div><nav v-if="pageCount > 1" class="pagination" aria-label="Best picks pages"><button v-for="page in pageCount" :key="page" type="button" :class="{active: currentPage === page}" :aria-current="currentPage === page ? 'page' : undefined" @click="currentPage = page">{{ page }}</button></nav>
    </div></section>
    <section class="bp-bottom"><div><p class="design-section-label muted-label">Still deciding?</p><h3>Compare products head-to-head.</h3><span>Our comparison library uses identical criteria across every matchup.</span></div><NuxtLink class="btn btn--accent" to="/comparisons/">Browse comparisons <AppIcon name="arrow" :size="15" /></NuxtLink></section>
  </div>
</template>
