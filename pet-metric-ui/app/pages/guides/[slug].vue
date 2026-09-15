<script setup lang="ts">
interface GuideSection {
  title: string
  body?: string
  paragraphs?: string[]
  bullets?: string[]
  checklist?: string[]
  table?: { headers: string[], rows: string[][] } | Record<string, string>[]
  note?: string
}

interface GuideFaq { question: string, answer: string }

const route = useRoute()
const { data: guideData, notFound } = await usePetMetricApi<any>(`guide-${String(route.params.slug)}`, `/guides/${String(route.params.slug)}`, null)
if (notFound.value) throw createError({ statusCode: 404, statusMessage: 'Guide not found' })
const guide = computed(() => guideData.value || { title: 'Guide unavailable', desc: 'This guide is temporarily unavailable.', category: 'Guide', categorySlug: '', readTime: '—', updated: '—', content: { sections: [] } })
const sections = computed<GuideSection[]>(() => guide.value.content?.sections || [])
const faq = computed<GuideFaq[]>(() => (Array.isArray(guide.value.content?.faq) ? guide.value.content.faq : []).map((item: any) => ({
  question: String(item?.question ?? item?.q ?? ''),
  answer: String(item?.answer ?? item?.a ?? '')
})).filter(item => item.question && item.answer))
const sectionId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const tableHeaders = (table: GuideSection['table']) => {
  if (!Array.isArray(table)) return table?.headers || []
  return [...new Set(table.flatMap(row => Object.keys(row || {})))]
}
const tableRows = (table: GuideSection['table']) => {
  if (!Array.isArray(table)) return table?.rows || []
  const headers = tableHeaders(table)
  return table.map(row => headers.map(header => row[header] || ''))
}

useHead(() => ({
  title: `${guide.value.title} — PetMetricus`,
  meta: [{ name: 'description', content: guide.value.desc }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://petmetricus.com/' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://petmetricus.com/guides/' },
        { '@type': 'ListItem', position: 3, name: guide.value.title, item: `https://petmetricus.com/guides/${String(route.params.slug)}/` }
      ]
    })
  }, ...(faq.value.length ? [{ type: 'application/ld+json', innerHTML: JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faq.value.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
  }) }] : [])]
}))
</script>

<template>
  <div>
    <DesignHero eyebrow="Buying education" :title="guide.title" :subtitle="guide.desc" :breadcrumb="[{label:'Home',to:'/'},{label:'Guides',to:'/guides/'},{label:guide.title}]" />
    <section class="company-section article-detail-section">
      <div class="container content-layout article-detail-layout">
        <article class="article-page guide-detail">
          <p class="design-section-label">{{ guide.category }} · {{ guide.readTime }} · Updated {{ guide.updated }}</p>
          <div class="article-cover-frame">
            <R2Image class="article-cover" :image-key="guide.imageKey" :fallback="guide.img" :alt="guide.title" eager />
          </div>
          <p v-if="guide.content?.summary" class="article-lede">{{ guide.content.summary }}</p>

          <section v-if="guide.content?.takeaways?.length" class="article-summary" aria-labelledby="quick-answer-heading">
            <p class="design-section-label">Quick answer</p><h2 id="quick-answer-heading">What matters most</h2>
            <ul class="check-list"><li v-for="item in guide.content.takeaways" :key="item"><AppIcon name="check" :size="16" /><span>{{ item }}</span></li></ul>
          </section>

          <template v-if="sections.length">
            <section v-for="section in sections" :id="sectionId(section.title)" :key="section.title" class="article-section">
              <h2>{{ section.title }}</h2>
              <p v-if="section.body">{{ section.body }}</p>
              <p v-for="paragraph in section.paragraphs || []" :key="paragraph">{{ paragraph }}</p>
              <ul v-if="section.bullets?.length"><li v-for="item in section.bullets" :key="item">{{ item }}</li></ul>
              <ul v-if="section.checklist?.length" class="check-list check-list--plain"><li v-for="item in section.checklist" :key="item"><AppIcon name="check" :size="16" /><span>{{ item }}</span></li></ul>
              <div v-if="section.table" class="article-table-wrap" tabindex="0" role="region" :aria-label="`${section.title} table`">
                <table class="comparison-table article-data-table"><thead><tr><th v-for="header in tableHeaders(section.table)" :key="header">{{ header }}</th></tr></thead><tbody><tr v-for="(row, rowIndex) in tableRows(section.table)" :key="rowIndex"><td v-for="(cell, cellIndex) in row" :key="cellIndex" :data-label="tableHeaders(section.table)[cellIndex]">{{ cell }}</td></tr></tbody></table>
              </div>
              <div v-if="section.note" class="note"><p>{{ section.note }}</p></div>
            </section>
          </template>
          <template v-else><h2>Start with the decision, not the feature list.</h2><p>Good pet technology research begins with the home, the animal, and the problem being solved. This guide lays out the criteria in plain language so you can build a shortlist before comparing specific products.</p></template>

          <section v-if="faq.length" id="common-questions" class="article-section article-faq"><p class="design-section-label">FAQ</p><h2>Common questions</h2><details v-for="item in faq" :key="item.question"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details></section>
          <section v-if="guide.content?.sources?.length" class="article-sources"><h2>Sources and scope</h2><p>{{ guide.content.sourceNote || 'Use manufacturer instructions for the exact model and region. Product details can change.' }}</p><ul><li v-for="source in guide.content.sources" :key="source.label"><a :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.label }} <AppIcon name="external" :size="12" /></a></li></ul></section>

          <div class="note"><p>Ready to compare models? See our <NuxtLink to="/best-picks/">Best Picks</NuxtLink> and normalized <NuxtLink to="/comparisons/">Comparison Library</NuxtLink>.</p></div>
          <NuxtLink class="btn btn--dark" :to="`/products/${guide.categorySlug}/`">Browse {{ guide.category }} <AppIcon name="arrow" :size="14" /></NuxtLink>
        </article>
        <aside class="sidebar article-sidebar">
          <nav v-if="sections.length" class="sidebar-card" aria-label="On this page"><span class="eyebrow">On this page</span><ul><li v-for="section in sections" :key="section.title"><a :href="`#${sectionId(section.title)}`">{{ section.title }}</a></li><li v-if="faq.length"><a href="#common-questions">Common questions</a></li></ul></nav>
          <div class="sidebar-card"><span class="eyebrow">Continue research</span><ul><li><NuxtLink :to="`/products/${guide.categorySlug}/`">Browse products</NuxtLink></li><li><NuxtLink to="/comparisons/">Compare alternatives</NuxtLink></li><li><NuxtLink to="/editorial-standards/">How we research</NuxtLink></li></ul></div>
        </aside>
      </div>
    </section>
  </div>
</template>
