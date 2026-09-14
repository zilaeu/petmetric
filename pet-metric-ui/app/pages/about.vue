<script setup lang="ts">
const { data: categoryData } = await usePetMetricApi<any[]>('about-categories', '/categories', [])
const categories = computed(() => categoryData.value.slice(0, 20))
const { data: pageData } = await usePetMetricApi<any>('about-page', '/pages/about', null)
const { data: homeData } = await usePetMetricApi<any>('about-stats', '/home', { stats: { productsResearched: '—', productCategories: '—', comparisonsPublished: '—', guidesPublished: '—' } })
const stats = computed(() => homeData.value.stats)
const aboutTitle = computed(() => pageData.value?.title || 'About PetMetric')
const aboutDescription = computed(() => pageData.value?.description || 'Independent research for clearer pet technology decisions.')

const researchSteps = [
  { number: '01', title: 'Define the owner decision', body: 'We begin with the practical question a reader is trying to answer, then identify the household and pet constraints that can change the recommendation.' },
  { number: '02', title: 'Build a consistent framework', body: 'Products in the same category are examined against the same decision criteria so important differences do not disappear inside feature lists.' },
  { number: '03', title: 'Check claims and limitations', body: 'We separate verified specifications, manufacturer claims, observed behavior, and information that remains unclear. Gaps stay visible.' },
  { number: '04', title: 'Publish with context', body: 'Our conclusions explain who a product may suit, the tradeoffs involved, when the information was checked, and what still needs verification.' }
]

const readerPromises = [
  { icon: 'source', title: 'Evidence is labeled', body: 'A manufacturer statement is not presented as independent proof, and an Amazon rating is not treated as functional evidence.' },
  { icon: 'scale', title: 'Tradeoffs stay visible', body: 'We do not compress every decision into a winner. Fit, ongoing cost, maintenance, privacy, and regional compatibility can change the answer.' },
  { icon: 'refresh', title: 'Research has a date', body: 'Products, firmware, subscriptions, and listings change. Dates tell you when our information was last checked and when to verify again.' },
  { icon: 'shield', title: 'Commercial ties are separated', body: 'Affiliate eligibility does not decide inclusion, order, score, or verdict. Relationships are disclosed where they matter.' }
]

const boundaries = [
  'We do not provide veterinary diagnosis, treatment, nutrition plans, or behavioral care advice.',
  'We do not guarantee current price, stock, seller identity, delivery, or regional compatibility on retailer pages.',
  'We do not treat popularity, star ratings, or a long feature list as proof that a product is safe or reliable.',
  'We do not accept payment to raise a score, change a verdict, hide a limitation, or place a product above a better fit.',
  'We do not present hands-on testing unless we actually performed it and describe the scope of that evaluation.'
]

useSeoMeta({ title: 'About PetMetric — Independent pet technology research', description: 'Learn why PetMetric exists, what we cover, how our research works, and the promises that guide every page.' })
</script>

<template>
  <div>
    <DesignHero variant="about" eyebrow="About PetMetric" :title="aboutTitle" :subtitle="aboutDescription" :breadcrumb="[{label:'Home',to:'/'},{label:'About'}]" />
    <section class="company-section">
      <div class="company-container">
        <div class="company-two-col company-two-col--intro">
          <div><p class="design-section-label">Why we exist</p><h2 class="display">Pet technology should solve a real problem—not create a new one.</h2></div>
          <div>
            <p>PetMetric is an independent research publication for people choosing connected and automated products for their pets. We turn specifications, subscriptions, safety claims, app features, and ownership tradeoffs into practical decisions.</p>
            <p>The category moves quickly: product names change, firmware alters behavior, features move behind paywalls, and retailer listings mix generations or regional variants. Our job is to slow that decision down, show what is known, and make uncertainty easy to see.</p>
            <p>We are built for readers who want more than a “best overall” badge—especially when a pet's size, routine, diet, behavior, or home environment means the popular choice may not be the right one.</p>
          </div>
        </div>
        <div class="company-stats">
          <div v-for="item in [{n:stats.productsResearched,l:'Products researched'},{n:stats.productCategories,l:'Product categories'},{n:stats.comparisonsPublished,l:'Product comparisons'},{n:stats.guidesPublished,l:'Buying guides'}]" :key="item.l"><strong>{{item.n}}</strong><span>{{item.l}}</span></div>
        </div>
      </div>
    </section>

    <section class="rich-content-section rich-content-section--muted">
      <div class="company-container">
        <div class="rich-section-heading"><div><p class="design-section-label">Our research process</p><h2 class="display">A decision-first method from question to publication.</h2></div><p>We use repeatable criteria while leaving room for category-specific concerns. An automatic litter box and a GPS tracker should not be judged by the same generic scorecard.</p></div>
        <div class="company-process-grid"><article v-for="step in researchSteps" :key="step.number"><span>{{ step.number }}</span><h3>{{ step.title }}</h3><p>{{ step.body }}</p></article></div>
        <div class="company-process-link"><NuxtLink class="text-link" to="/editorial-standards/">Read the full editorial and scoring standards</NuxtLink></div>
      </div>
    </section>

    <section class="rich-content-section">
      <div class="company-container">
        <div class="rich-section-heading"><div><p class="design-section-label">What readers can expect</p><h2 class="display">Four promises behind every conclusion.</h2></div><p>Trust comes from showing the limits of the work, not from pretending every question has a neat or permanent answer.</p></div>
        <div class="company-promise-grid"><article v-for="item in readerPromises" :key="item.title"><AppIcon :name="item.icon as any" :size="22" /><div><h3>{{ item.title }}</h3><p>{{ item.body }}</p></div></article></div>
      </div>
    </section>

    <section class="company-cover-section">
      <div class="company-container">
        <p class="design-section-label">What we cover</p><h2 class="display company-heading">{{ stats.productCategories }} categories where hardware meets daily care.</h2>
        <p class="company-cover-intro">We focus on products whose usefulness depends on more than a single specification: the pet, the home, software reliability, maintenance, connectivity, and long-term cost all matter.</p>
        <div class="company-categories"><NuxtLink v-for="category in categories" :key="category.slug" :to="`/products/${category.slug}/`"><R2Image :image-key="category.imageKey" :fallback="category.img" alt="" /><div><strong>{{ category.title }}</strong><span>{{ category.count }} products · Updated {{ category.updated }}</span></div><AppIcon name="arrow" :size="14" /></NuxtLink></div>
        <NuxtLink class="btn btn--accent company-cover-cta" to="/products/">Browse all product types <AppIcon name="arrow" :size="13" /></NuxtLink>
        <div v-if="!categories.length" class="empty-state">Category information is temporarily unavailable.</div>
      </div>
    </section>

    <section class="rich-content-section rich-content-section--muted">
      <div class="company-container rich-split-layout">
        <div><p class="design-section-label">Our boundaries</p><h2 class="display">What PetMetric does not claim to be.</h2><p class="rich-lead">Clear limits protect readers from overconfidence. Our research supports a purchase or troubleshooting decision; it does not replace professional care, manufacturer safety instructions, or a final pre-purchase check.</p></div>
        <ul class="rich-check-list rich-check-list--plain"><li v-for="item in boundaries" :key="item"><AppIcon name="check" :size="18" /><span>{{ item }}</span></li></ul>
      </div>
    </section>

    <section class="company-final-section">
      <div class="company-container"><div><p class="design-section-label">Accountability</p><h2 class="display">Questions, corrections, and commercial relationships stay visible.</h2><p>If you find an outdated specification, a missing limitation, or a conclusion that the evidence does not support, send us the page and a source. We review substantiated corrections and date material changes.</p></div><div class="company-actions"><NuxtLink class="btn btn--dark" to="/editorial-standards/">Editorial standards <AppIcon name="arrow" :size="13" /></NuxtLink><NuxtLink class="btn btn--light" to="/disclosure/">Commercial disclosure <AppIcon name="arrow" :size="13" /></NuxtLink><NuxtLink class="btn btn--light" to="/contact/">Submit a correction <AppIcon name="arrow" :size="13" /></NuxtLink></div></div>
    </section>
  </div>
</template>
