<script setup lang="ts">
interface DetailedStep { title: string, instruction: string, why?: string, result?: string }
interface FaqItem { question: string, answer: string }

const route = useRoute()
const { data: articleData, notFound } = await usePetMetricApi<any>(`troubleshooting-${String(route.params.slug)}`, `/troubleshooting/${String(route.params.slug)}`, null)
if (notFound.value) throw createError({ statusCode: 404, statusMessage: 'Troubleshooting guide not found' })
const article = computed(() => articleData.value || { title: 'Guide unavailable', description: 'This troubleshooting guide is temporarily unavailable.', steps: [], content: {} })
// The full guide uses the editorially enriched sequence when available. The
// list endpoint is normalized to this same sequence by the API repository.
const detailedSteps = computed<DetailedStep[]>(() => {
  const enriched = Array.isArray(article.value.content?.detailedSteps) ? article.value.content.detailedSteps : []
  if (enriched.length) return enriched
  return (article.value.steps || []).map((instruction: string, index: number) => ({
    title: `Check ${index + 1}`,
    instruction
  }))
})
const faq = computed<FaqItem[]>(() => (Array.isArray(article.value.content?.faq) ? article.value.content.faq : []).map((item: any) => ({
  question: String(item?.question ?? item?.q ?? ''),
  answer: String(item?.answer ?? item?.a ?? '')
})).filter(item => item.question && item.answer))

useHead(() => ({
  title: `${article.value.title} — PetMetric`,
  meta: [{ name: 'description', content: article.value.description }],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://petmetric.com/' },
      { '@type': 'ListItem', position: 2, name: 'Troubleshooting', item: 'https://petmetric.com/troubleshooting/' },
      { '@type': 'ListItem', position: 3, name: article.value.title, item: `https://petmetric.com/troubleshooting/${String(route.params.slug)}/` }
    ]
  }) }, ...(faq.value.length ? [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.value.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }) }] : [])]
}))
</script>

<template>
  <div>
    <AppBreadcrumbs :items="[{label:'Home',to:'/'},{label:'Troubleshooting',to:'/troubleshooting/'},{label:article.title}]" />
    <section class="page-hero trouble-detail-hero"><div class="container"><span class="eyebrow">Troubleshooting · Step by step</span><h1 class="display">{{ article.title }}</h1><p>{{ article.description }}</p><dl class="trouble-meta"><div><dt>Difficulty</dt><dd>{{ article.difficulty || 'Easy fix' }}</dd></div><div><dt>Time</dt><dd>{{ article.time || '5–10 min' }}</dd></div><div><dt>Updated</dt><dd>{{ article.updated || '—' }}</dd></div></dl></div></section>
    <section class="section article-detail-section"><div class="container content-layout article-detail-layout">
      <article class="article-page trouble-detail">
        <div class="note safety-note"><p><strong>Stop first:</strong> {{ article.content?.safety || 'If the device is hot, smells burnt, has a damaged cable or exposes a moving mechanism, unplug it and contact the manufacturer.' }}</p></div>
        <p v-if="article.content?.intro" class="article-lede">{{ article.content.intro }}</p>

        <section v-if="article.content?.quickChecks?.length" class="article-summary"><p class="design-section-label">Before taking it apart</p><h2>Three quick checks</h2><ul class="check-list"><li v-for="item in article.content.quickChecks" :key="item"><AppIcon name="check" :size="16" /><span>{{ item }}</span></li></ul></section>

        <section id="fixes-in-order" class="article-section"><h2>Fixes in order</h2><p>Test after each step. Stop as soon as automatic cycling returns; changing several things at once makes the cause harder to identify.</p><ol class="detailed-steps"><li v-for="(step, index) in detailedSteps" :key="step.title"><span class="step-number">{{ index + 1 }}</span><div><h3>{{ step.title }}</h3><p>{{ step.instruction }}</p><p v-if="step.why" class="step-detail"><strong>Why this matters:</strong> {{ step.why }}</p><p v-if="step.result" class="step-result"><strong>What success looks like:</strong> {{ step.result }}</p></div></li></ol></section>

        <section v-if="article.content?.causeTable?.length" id="what-the-result-means" class="article-section"><h2>What the result means</h2><div class="article-table-wrap" tabindex="0" role="region" aria-label="Troubleshooting results table"><table class="comparison-table article-data-table"><thead><tr><th>What you observe</th><th>Likely direction</th><th>Next move</th></tr></thead><tbody><tr v-for="row in article.content.causeTable" :key="row.observation"><td data-label="Observation">{{ row.observation }}</td><td data-label="Likely direction">{{ row.cause }}</td><td data-label="Next move">{{ row.next }}</td></tr></tbody></table></div></section>

        <section id="when-to-contact-support" class="article-section"><h2>When to contact support</h2><p>{{ article.content?.support || 'Contact support if the same failure returns after a clean power cycle and the documented reset, or if the product is under warranty. Include the serial number, purchase date, error state and the steps you already tried.' }}</p><ul v-if="article.content?.supportChecklist?.length"><li v-for="item in article.content.supportChecklist" :key="item">{{ item }}</li></ul></section>
        <section v-if="faq.length" id="common-questions" class="article-section article-faq"><p class="design-section-label">FAQ</p><h2>Common questions</h2><details v-for="item in faq" :key="item.question"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details></section>
        <section v-if="article.content?.sources?.length" class="article-sources"><h2>Sources and scope</h2><p>{{ article.content.sourceNote || 'Controls and light states can change with firmware. Confirm the current manufacturer instructions for your unit.' }}</p><ul><li v-for="source in article.content.sources" :key="source.label"><a :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.label }} <AppIcon name="external" :size="12" /></a></li></ul></section>
        <div class="correction-cta"><div><h3>Need to correct this guide?</h3><p>Send a source or a safer sequence and we will review it.</p></div><NuxtLink class="btn btn--accent" to="/contact/">Contact PetMetric</NuxtLink></div>
      </article>
      <aside class="sidebar article-sidebar"><nav class="sidebar-card" aria-label="On this page"><span class="eyebrow">On this page</span><ul><li><a href="#fixes-in-order">Fixes in order</a></li><li v-if="article.content?.causeTable?.length"><a href="#what-the-result-means">What the result means</a></li><li><a href="#when-to-contact-support">When to contact support</a></li><li v-if="faq.length"><a href="#common-questions">Common questions</a></li></ul></nav><div class="sidebar-card"><span class="eyebrow">Related paths</span><ul><li v-if="article.productSlug"><NuxtLink :to="`/reviews/${article.productSlug}/`">Read the product review</NuxtLink></li><li><NuxtLink to="/products/">Find your product</NuxtLink></li><li><NuxtLink to="/comparisons/">Compare alternatives</NuxtLink></li></ul></div></aside>
    </div></section>
  </div>
</template>
