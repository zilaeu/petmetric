<script setup lang="ts">
import type { DesignComparison } from '~/composables/designData'
const { data: comparisonData } = await usePetMetricApi<DesignComparison[]>('comparisons', '/comparisons?limit=100', [])
const comparisons = computed(() => comparisonData.value)
const categoryOptions = await useCategoryOptions('comparison-categories')

const route = useRoute()
const router = useRouter()
const activeCategory = ref(String(route.query.category || 'all'))
const productQuery = ref('')
const currentPage = ref(1)
const pageSize = 9
const selected = ref<DesignComparison | null>(null)
const modal = ref<HTMLElement | null>(null)
const modalCloseButton = ref<HTMLButtonElement | null>(null)
let lastFocusedElement: HTMLElement | null = null
const filtered = computed(() => {
  const query = productQuery.value.trim().toLocaleLowerCase('en-US')
  return comparisons.value.filter(item => {
    const matchesCategory = activeCategory.value === 'all' || item.categorySlug === activeCategory.value
    const matchesProduct = !query || `${item.a} ${item.b}`.toLocaleLowerCase('en-US').includes(query)
    return matchesCategory && matchesProduct
  })
})
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const paged = computed(() => filtered.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))
watch(() => route.query.category, value => { activeCategory.value = String(value || 'all') })
watch(activeCategory, value => { currentPage.value = 1; if (String(route.query.category || 'all') !== value) router.replace({ path: route.path, query: value === 'all' ? {} : { category: value } }) })
const featuredComparison = computed(() => comparisons.value.find(item => item.featured) || comparisons.value[0] || null)
const resetFilters = () => { activeCategory.value = 'all'; productQuery.value = '' }
const normalizeValue = (value?: unknown) => String(value ?? '').trim().toLowerCase().replaceAll(/\s+/g, ' ')
const isUnknownValue = (value?: unknown) => /^(not verified|not available|not clearly stated|check amazon|unknown|—)/i.test(String(value ?? '').trim())
const quickDifferences = computed(() => (selected.value?.criteria || [])
  .filter(row => {
    const bothUnknown = (row.aStatus === 'unclear' || isUnknownValue(row.aVal)) && (row.bStatus === 'unclear' || isUnknownValue(row.bVal))
    return !bothUnknown && (normalizeValue(row.aVal) !== normalizeValue(row.bVal) || row.aStatus !== row.bStatus)
  })
  .slice(0, 5))

function openComparison(item: DesignComparison) {
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
  selected.value = item
}

function closeComparison() {
  selected.value = null
}

function releaseModal() {
  document.documentElement.classList.remove('comparison-modal-open')
  document.body.classList.remove('comparison-modal-open')
}

function handleModalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeComparison()
    return
  }
  if (event.key !== 'Tab' || !modal.value) return

  const focusable = Array.from(modal.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    .filter(element => element.offsetParent !== null)
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(selected, async (value) => {
  if (value) {
    document.documentElement.classList.add('comparison-modal-open')
    document.body.classList.add('comparison-modal-open')
    await nextTick()
    modalCloseButton.value?.focus()
    return
  }

  releaseModal()
  await nextTick()
  lastFocusedElement?.focus()
  lastFocusedElement = null
})

onBeforeUnmount(releaseModal)

useSeoMeta({ title: 'Comparisons — PetMetricus', description: 'Side-by-side pet technology comparisons using consistent category criteria.' })
</script>

<template>
  <div>
    <DesignHero eyebrow="Comparison library" title="Compare products side by side." subtitle="Review product specifications, core functions, and evidence across pet technology categories." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Comparisons' }]" />

    <section v-if="featuredComparison" class="featured-wrap"><div class="container"><button class="featured-comparison" type="button" @click="openComparison(featuredComparison)"><div><div class="versus"><strong>{{ featuredComparison.a }}</strong><span>vs</span><strong>{{ featuredComparison.b }}</strong></div><p>{{ featuredComparison.verdict }}</p><div class="comparison-best-list comparison-best-list--featured"><div v-for="item in featuredComparison.bestFor" :key="item.pick"><b>{{ item.pick }}</b><span>{{ item.who }}</span></div></div></div><div class="featured-side"><strong>{{ featuredComparison.evidenceConfidence || 'Limited' }}</strong><span>evidence coverage</span><span class="btn btn--accent">Quick comparison <AppIcon name="arrow" :size="13" /></span></div></button></div></section>

    <section class="home-section"><div class="container">
      <div class="comparison-library-filters">
        <div class="comparison-filter-controls"><label><span>Product type</span><select v-model="activeCategory"><option value="all">All categories</option><option v-for="item in categoryOptions" :key="item.slug" :value="item.slug">{{ item.label }}</option></select></label><label class="comparison-name-filter"><span>Product name</span><input v-model="productQuery" type="search" placeholder="Search either product…" /></label></div>
        <small class="comparison-filter-count">{{ filtered.length }} comparison{{ filtered.length === 1 ? '' : 's' }}</small>
      </div>
      <div v-if="filtered.length" class="comparison-design-grid"><button v-for="item in paged" :key="item.href" class="comparison-design-card" type="button" @click="openComparison(item)"><div class="comparison-card-header"><span>Checked {{ item.checkedAt || item.updated }}</span></div><div class="comparison-card-body"><div class="versus"><strong>{{ item.a }}</strong><span>vs</span><strong>{{ item.b }}</strong></div><p>{{ item.verdict }}</p><div class="comparison-best-list"><div v-for="best in item.bestFor" :key="best.pick"><b :class="{ neutral: best.pick === 'No recommendation yet' }">{{ best.pick }}</b><span>{{ best.who }}</span></div></div><div class="comparison-card-bottom"><span>{{ item.evidenceConfidence || 'Limited' }} evidence</span><strong>Quick comparison <AppIcon name="arrow" :size="13" /></strong></div></div></button></div>
      <nav v-if="pageCount > 1" class="pagination" aria-label="Comparison pages"><button v-for="page in pageCount" :key="page" type="button" :class="{ active: currentPage === page }" :aria-current="currentPage === page ? 'page' : undefined" @click="currentPage = page">{{ page }}</button></nav>
      <div v-if="!filtered.length" class="empty-state comparison-filter-empty"><p>No comparison matches these filters.</p><button class="btn btn--light" type="button" @click="resetFilters">Show all comparisons</button></div>
    </div></section>

    <section class="comparison-note"><div class="container"><div><p class="design-section-label muted-label">How comparisons are structured</p><p>Each comparison uses the same criterion set for that category. A per-criterion edge is not an overall recommendation; the right product depends on your pet, household, and verified evidence.</p></div><div><p class="design-section-label muted-label">Sources and pricing</p><p>Amazon prices, stock, and review counts are snapshots and may change. Different configurations and small review samples are not treated as fair evidence of overall value.</p></div><NuxtLink class="text-link" to="/editorial-standards/">Full methodology</NuxtLink></div></section>

<Teleport to="body"><div v-if="selected" class="comparison-modal-backdrop" @click.self="closeComparison" @keydown="handleModalKeydown"><section ref="modal" class="comparison-modal comparison-modal--quick" role="dialog" aria-modal="true" aria-labelledby="comparison-modal-title"><header><div><p>{{ selected.category }} · Checked {{ selected.checkedAt || selected.updated }} · {{ selected.evidenceConfidence || 'Limited' }} evidence</p><h2 id="comparison-modal-title">{{ selected.a }} <span>vs</span> {{ selected.b }}</h2></div><button ref="modalCloseButton" type="button" aria-label="Close comparison" @click="closeComparison">×</button></header><div class="comparison-modal-body"><div class="modal-verdict"><p>{{ selected.decisionQuestion || 'Quick decision summary' }}</p><span>{{ selected.verdict }}</span><small>{{ selected.scopeNote }}</small></div><div v-if="selected.bestFor?.length" class="modal-section"><p class="modal-label">Best fit based on current evidence</p><div class="modal-best-grid"><div v-for="(item,index) in selected.bestFor.slice(0,2)" :key="`${item.pick}-${item.who}`" :class="{ orange:index === 1, neutral:item.pick === 'No recommendation yet' }"><strong>{{ item.pick }}</strong><span>{{ item.who }}</span></div></div></div><div v-if="quickDifferences.length" class="modal-section"><p class="modal-label">{{ quickDifferences.length }} key difference{{ quickDifferences.length === 1 ? '' : 's' }}</p><div class="quick-difference-list"><article v-for="row in quickDifferences" :key="row.label"><strong>{{ row.label }}</strong><p><span>{{ selected.a }}</span>{{ row.aVal }}</p><p><span>{{ selected.b }}</span>{{ row.bVal }}</p></article></div></div><div class="modal-actions"><NuxtLink class="btn btn--accent" :to="selected.href" @click="closeComparison">View full comparison <AppIcon name="arrow" :size="13" /></NuxtLink><button class="btn btn--light" type="button" @click="closeComparison">Keep browsing</button></div></div></section></div></Teleport>
  </div>
</template>
