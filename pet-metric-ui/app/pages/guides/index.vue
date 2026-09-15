<script setup lang="ts">
const { data: guideData } = await usePetMetricApi<any[]>('guides', '/guides?limit=100', [])
const route = useRoute()
const router = useRouter()
const active = ref(String(route.query.category || 'all'))
const currentPage = ref(1)
const pageSize = 9
const filtered = computed(() => active.value === 'all' ? guideData.value : guideData.value.filter(item => item.categorySlug === active.value))
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const pagedGuides = computed(() => filtered.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))
watch(active, () => { currentPage.value = 1 })
const filters = await useCategoryOptions('guide-categories')
watch(() => route.query.category, value => { active.value = String(value || 'all') })
watch(active, value => { currentPage.value = 1; if (String(route.query.category || 'all') !== value) router.replace({ path: route.path, query: value === 'all' ? {} : { category: value } }) })

const guidePrinciples = [
  { icon: 'scale', title: 'Compare the full cost', body: 'We look beyond the shelf price to subscriptions, consumables, replacement parts, and realistic ownership costs.' },
  { icon: 'source', title: 'Translate the specifications', body: 'We explain which claims affect daily use, which require context, and which are mostly marketing language.' },
  { icon: 'shield', title: 'Start with fit and safety', body: 'The right choice depends on your pet, household, connectivity, and tolerance for maintenance—not a universal ranking.' }
]

const topicPaths = [
  { label: 'Automatic litter boxes', to: '/products/automatic-litter-boxes/', question: 'Will it fit my cat, litter, room, and cleaning routine?', detail: 'Start with entry size, weight limits, litter compatibility, safety sensors, drawer capacity, and ongoing consumable cost.' },
  { label: 'GPS pet trackers', to: '/products/gps-pet-trackers/', question: 'Will it still work where my pet actually goes?', detail: 'Compare network coverage, live-mode refresh rates, escape alerts, battery tradeoffs, collar fit, and subscription terms.' },
  { label: 'Smart pet feeders', to: '/products/smart-pet-feeders/', question: 'Can I trust every scheduled portion?', detail: 'Focus on portion repeatability, food compatibility, jam behavior, backup power, schedule storage, and cleaning access.' },
  { label: 'Pet cameras', to: '/products/pet-cameras/', question: 'Which features help my pet instead of only reassuring me?', detail: 'Review field of view, alert quality, local or cloud storage, two-way audio, privacy controls, and paywalled features.' }
  ,{ label: 'Smart water fountains', to: '/products/smart-water-fountains/', question: 'Can I keep water fresher with less daily maintenance?', detail: 'Compare cleaning access, filter or separation systems, pump reliability, noise, capacity, and whether hydration data is trustworthy.' }
  ,{ label: 'Pet grooming tools', to: '/products/pet-grooming-tools/', question: 'Which tool matches my pet’s coat and tolerance?', detail: 'Compare noise, heat, blade range, battery, cleaning, and replacement parts before trimming at home.' }
  ,{ label: 'Pet waste cleanup', to: '/products/pet-waste-cleanup/', question: 'Where is the mess actually coming from?', detail: 'Separate leakage, litter tracking, odor, overflow, and recurring supply cost before choosing a cleanup product.' }
  ,{ label: 'Walking and safety', to: '/products/pet-walking-safety/', question: 'Will the fit stay secure when my pet pulls or backs out?', detail: 'Measure chest and neck, compare adjustment range, pressure distribution, visibility, and travel compatibility.' }
]

const guideFaq = [
  { question: 'Are guides the same as product reviews?', answer: 'No. Guides teach a category, technology, or ownership decision. Reviews evaluate one product, while comparisons normalize two plausible alternatives against the same criteria.' },
  { question: 'How current is the information?', answer: 'Guide cards show an updated date. We revisit a guide when pricing models, compatibility, firmware behavior, or the products that define a category materially change.' },
  { question: 'What if my question is not covered?', answer: 'Send us the decision you are trying to make. Useful reader questions help us prioritize new explainers and clarify confusing sections in existing guides.' }
]

useSeoMeta({ title: 'Guides — PetMetricus', description: 'Topic-based buying guides for pet technology.' })
</script>

<template>
  <div>
    <DesignHero
      eyebrow="Buying education"
      title="Know before you buy."
      subtitle="Topic-based guides that answer the questions product pages can't — how technologies work, how costs compare over time, and what specs actually matter."
      :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Guides' }]"
    />
    <section class="rich-intro-section">
      <div class="container">
        <div class="rich-section-heading">
          <div><p class="design-section-label">A better starting point</p><h2 class="display">Learn the category before choosing the product.</h2></div>
          <p>Pet technology often combines hardware, an app, consumables, and a subscription. Our guides separate those layers so you can decide what your household actually needs before opening a product listing.</p>
        </div>
        <div class="rich-principle-grid">
          <article v-for="principle in guidePrinciples" :key="principle.title">
            <AppIcon :name="principle.icon as any" :size="22" />
            <h3>{{ principle.title }}</h3>
            <p>{{ principle.body }}</p>
          </article>
        </div>
      </div>
    </section>
    <section class="home-section">
      <div class="container">
        <div class="rich-section-heading rich-section-heading--compact">
          <div><p class="design-section-label">Guide library</p><h2 class="display">Explore every buying guide.</h2></div>
          <p>Filter by product category, then open a guide for plain-language explanations, practical tradeoffs, and the questions worth asking before you buy.</p>
        </div>
        <div class="filter-row">
          <span>Topic:</span>
          <button :class="{ active: active === 'all' }" @click="active = 'all'">All guides</button>
          <button v-for="item in filters" :key="item.slug" :class="{ active: active === item.slug }" @click="active = item.slug">{{ item.label }}</button>
        </div>
        <div class="guides-design-grid">
          <NuxtLink v-for="guide in pagedGuides" :key="guide.slug" class="guide-design-card" :to="`/guides/${guide.slug}/`">
            <div class="guide-image">
              <R2Image :image-key="guide.imageKey" :fallback="guide.img" alt="" />
              <span>{{ guide.category }}</span>
            </div>
            <div class="guide-body">
              <h2>{{ guide.title }}</h2>
              <p>{{ guide.desc }}</p>
              <div><span>{{ guide.readTime }}</span><span>Updated {{ guide.updated }}</span><AppIcon name="arrow" :size="14" /></div>
            </div>
          </NuxtLink>
        </div><nav v-if="pageCount > 1" class="pagination" aria-label="Guide pages"><button v-for="page in pageCount" :key="page" type="button" :class="{active: currentPage === page}" :aria-current="currentPage === page ? 'page' : undefined" @click="currentPage = page">{{ page }}</button></nav>
        <div class="guide-bottom-note">
          <div><h3>Looking for a specific product recommendation?</h3><p>Guides explain the technology. Our best picks and comparisons name specific products.</p></div>
          <div><NuxtLink class="btn btn--dark" to="/best-picks/">Best picks <AppIcon name="arrow" :size="13" /></NuxtLink><NuxtLink class="btn btn--light" to="/comparisons/">Comparisons</NuxtLink></div>
        </div>
      </div>
    </section>
    <section class="rich-content-section rich-content-section--muted">
      <div class="container">
        <div class="rich-section-heading">
          <div><p class="design-section-label">Choose your path</p><h2 class="display">The first question to ask in each category.</h2></div>
          <p>Features only make sense in context. These starting questions narrow the field faster than comparing long specification tables.</p>
        </div>
        <div class="rich-topic-list">
          <NuxtLink v-for="(topic, index) in topicPaths" :key="topic.to" :to="topic.to">
            <span>0{{ index + 1 }}</span>
            <div><p>{{ topic.label }}</p><h3>{{ topic.question }}</h3><small>{{ topic.detail }}</small></div>
            <AppIcon name="arrow" :size="16" />
          </NuxtLink>
        </div>
      </div>
    </section>
    <section class="rich-content-section">
      <div class="container rich-split-layout">
        <div>
          <p class="design-section-label">How to use our guides</p>
          <h2 class="display">From an open question to a defensible shortlist.</h2>
          <p class="rich-lead">A guide should help you eliminate poor fits—not create a longer shopping list. Use the category explanation first, then move to recommendations only when your constraints are clear.</p>
        </div>
        <ol class="rich-step-list">
          <li><b>1</b><div><strong>Define the job</strong><span>Write down the problem, the pet-specific constraint, and what a successful daily routine looks like.</span></div></li>
          <li><b>2</b><div><strong>Identify non-negotiables</strong><span>Set limits for size, safety, connectivity, noise, maintenance, subscription cost, and return policy.</span></div></li>
          <li><b>3</b><div><strong>Build a small shortlist</strong><span>Use our Best Picks for use-case recommendations, then compare realistic alternatives side by side.</span></div></li>
          <li><b>4</b><div><strong>Verify before checkout</strong><span>Confirm the current variant, regional compatibility, price, seller, warranty, and subscription terms.</span></div></li>
        </ol>
      </div>
    </section>
    <section class="rich-content-section rich-content-section--muted">
      <div class="container rich-faq-layout">
        <div><p class="design-section-label">Guide FAQ</p><h2 class="display">What readers should know.</h2><p>Our guides are decision support, not veterinary advice or a substitute for current manufacturer safety instructions.</p></div>
        <div class="rich-faq-list">
          <details v-for="item in guideFaq" :key="item.question"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details>
        </div>
      </div>
    </section>
  </div>
</template>
