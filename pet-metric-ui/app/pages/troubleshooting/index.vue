<script setup lang="ts">
const active = ref('all')
const route = useRoute()
const router = useRouter()
const search = ref('')
const openHref = ref<string | null>(null)
const { data: troubleData } = await usePetMetricApi<any[]>('troubleshooting', '/troubleshooting?limit=100', [])
const categoryFilters = await useCategoryOptions('troubleshooting-categories')
active.value = String(route.query.category || 'all')
watch(() => route.query.category, value => { active.value = String(value || 'all') })
watch(active, value => { currentPage.value = 1; if (String(route.query.category || 'all') !== value) router.replace({ path: route.path, query: value === 'all' ? {} : { category: value } }) })
const currentPage = ref(1)
const pageSize = 10
const filtered = computed(() => troubleData.value.filter(item => (active.value === 'all' || item.categorySlug === active.value) && (!search.value || `${item.product} ${item.problem}`.toLowerCase().includes(search.value.toLowerCase()))))
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const pagedTroubleshooting = computed(() => filtered.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))
watch([active, search], () => { currentPage.value = 1 })

const fixMethod = [
  { icon: 'shield', title: 'Make the device safe', body: 'Stop if you see heat, smoke, damaged wiring, liquid near power, or an exposed moving mechanism. Isolate power before inspecting.' },
  { icon: 'wrench', title: 'Test one cause at a time', body: 'Start with reversible checks—power, placement, blockage, connectivity, and settings—before resets or disassembly.' },
  { icon: 'source', title: 'Preserve useful evidence', body: 'Record the light pattern, error code, app message, firmware version, and what changed before the problem began.' }
]

const escalationItems = [
  'The device overheats, smells burnt, leaks, sparks, or exposes a moving part.',
  'The same fault returns after the documented cleaning, restart, and reset sequence.',
  'A safety sensor, lock, motor, battery, cable, or power adapter appears damaged.',
  'The product is under warranty and the next step would require opening its housing.',
  'A feeder failure could interrupt a prescribed diet or leave a pet without a reliable meal.'
]

const supportChecklist = [
  'Product name, exact model or generation, and serial number',
  'Purchase date, retailer, country, and warranty status',
  'Exact error message, indicator-light pattern, or app screenshot',
  'Firmware and app version, plus phone and router details if relevant',
  'Steps already attempted and whether the behavior changed after each one'
]

useSeoMeta({ title: 'Troubleshooting — PetMetricus', description: 'Step-by-step, safety-first troubleshooting for popular pet technology.' })
</script>

<template>
  <div><AppBreadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'Troubleshooting' }]" /><section class="troubles-hero"><div class="container"><p class="design-eyebrow">Fix library</p><h1 class="display">Product not working right?</h1><p>Symptom-first fixes arranged from the safest, simplest check to the point where manufacturer support is the better next step.</p><label><span class="sr-only">Search troubleshooting guides</span><AppIcon name="search" :size="18" /><input v-model="search" type="search" placeholder="Search by product or symptom…" /></label><small>Try a model name, error message, or symptom such as “offline,” “not cycling,” or “not dispensing.”</small></div></section>
    <section class="rich-intro-section"><div class="container"><div class="rich-section-heading"><div><p class="design-section-label">Before you troubleshoot</p><h2 class="display">A safe, ordered way to diagnose the problem.</h2></div><p>Changing several settings at once makes the cause harder to identify. Our guides begin with observation, protect schedules and saved data where possible, and clearly mark the point to stop.</p></div><div class="rich-principle-grid"><article v-for="item in fixMethod" :key="item.title"><AppIcon :name="item.icon as any" :size="22" /><h3>{{ item.title }}</h3><p>{{ item.body }}</p></article></div></div></section>
    <section class="trouble-index-section"><div class="container"><div class="rich-section-heading rich-section-heading--compact"><div><p class="design-section-label">Step-by-step library</p><h2 class="display">Find the symptom, then work in order.</h2></div><p>Open any row for a quick sequence. The full guide adds safety context, escalation advice, and the details worth sharing with support.</p></div><div class="filter-row"><span>Category:</span><button :class="{active:active==='all'}" :aria-pressed="active==='all'" @click="active='all'">All</button><button v-for="item in categoryFilters" :key="item.slug" :class="{active:active===item.slug}" :aria-pressed="active===item.slug" @click="active=item.slug">{{item.label}}</button><small>{{ filtered.length }} guide{{ filtered.length === 1 ? '' : 's' }}</small></div><div class="trouble-expand-list"><article v-for="item in pagedTroubleshooting" :key="item.href"><button type="button" :aria-expanded="openHref===item.href" @click="openHref = openHref === item.href ? null : item.href"><div><p><strong>{{ item.product }}</strong><b :class="item.difficulty === 'Moderate' ? 'moderate' : ''">{{ item.difficulty }}</b><span>{{ item.views }} views</span></p><h2>{{ item.problem }}</h2></div><i :class="{open:openHref===item.href}" aria-hidden="true">+</i></button><div v-if="openHref===item.href" class="trouble-expanded"><p class="modal-label">Resolution steps</p><ol><li v-for="(step,stepIndex) in item.steps" :key="step"><b>{{ stepIndex + 1 }}</b><span>{{ step }}</span></li></ol><footer><NuxtLink class="btn btn--accent" :to="item.href">Full guide ↗</NuxtLink><span>Updated {{ item.updated }} · <NuxtLink to="/contact/">Submit a correction</NuxtLink></span></footer></div></article><div v-if="!filtered.length" class="empty-state">No guides match your search. Try a different product name or symptom.</div></div><nav v-if="pageCount > 1" class="pagination" aria-label="Troubleshooting pages"><button v-for="page in pageCount" :key="page" type="button" :class="{active: currentPage === page}" :aria-current="currentPage === page ? 'page' : undefined" @click="currentPage = page">{{ page }}</button></nav><div class="trouble-cta"><div><h3>Can’t find your exact issue?</h3><p>Tell us the model, symptom, and what you already tried. Reader reports help us decide which fixes to research next.</p></div><NuxtLink class="btn btn--accent" to="/contact/">Submit your issue <AppIcon name="arrow" :size="14" /></NuxtLink></div></div></section>
    <section class="rich-content-section rich-content-section--muted"><div class="container rich-split-layout"><div><p class="design-section-label">Know when to stop</p><h2 class="display">Contact support instead of continuing if…</h2><p class="rich-lead">Troubleshooting should never trade safety or warranty coverage for one more experiment. Unplug the device when its manufacturer instructs you to do so.</p></div><ul class="rich-check-list"><li v-for="item in escalationItems" :key="item"><AppIcon name="shield" :size="18" /><span>{{ item }}</span></li></ul></div></section>
    <section class="rich-content-section"><div class="container rich-split-layout"><div><p class="design-section-label">Make support faster</p><h2 class="display">Collect the details they will ask for.</h2><p class="rich-lead">A precise report reduces repeated questions and helps distinguish a device fault from an app, network, setup, or consumable issue.</p><NuxtLink class="text-link" to="/contact/">Send a correction or request a guide</NuxtLink></div><ol class="rich-number-list"><li v-for="(item, index) in supportChecklist" :key="item"><b>0{{ index + 1 }}</b><span>{{ item }}</span></li></ol></div></section>
  </div>
</template>
