<script setup lang="ts">
const route = useRoute()
const { data: comparisonData, notFound } = await usePetMetricApi<any>(`comparison-${String(route.params.slug)}`, `/comparisons/${String(route.params.slug)}`, null)
if (notFound.value) throw createError({ statusCode: 404, statusMessage: 'Comparison not found' })

const article = computed(() => {
  const current = comparisonData.value || { a: 'Comparison', b: 'unavailable', category: 'Products', verdict: 'This comparison is temporarily unavailable.', criteria: [] }
  return {
    title: `${current.a} vs. ${current.b}`,
    category: current.category,
    verdict: current.verdict,
    a: current.a,
    b: current.b,
    updated: current.updated || '—',
    readTime: current.readTime || '—',
    checkedAt: current.checkedAt || null,
    evidenceConfidence: current.evidenceConfidence || 'Limited',
    marketplace: current.marketplace || 'Amazon.com',
    deliveryCountry: current.deliveryCountry || 'United States',
    decisionQuestion: current.decisionQuestion || 'Which product better fits your pet and household?',
    comparisonType: current.comparisonType || 'Direct alternative',
    scopeNote: current.scopeNote || '',
    whyCompare: current.whyCompare || '',
    controversy: current.controversy || '',
    decisionRule: current.decisionRule || '',
    bestFor: current.bestFor || [],
    rows: current.criteria || [],
    attributes: (current.productAttributes || []).filter((row: any) => row.key !== 'catalog_order'),
    products: current.products || [],
    userReviewSummaries: current.userReviewSummaries || [],
    userFeedback: current.userFeedback || null,
    researchConclusion: current.researchConclusion || { coreFunctionLeader: 'Not established.', practicalChoice: 'Not established.', developerLessons: [], marketOpportunities: [] }
  }
})

const onlyDifferences = ref(false)
const normalizeValue = (value?: unknown) => String(value ?? '').trim().toLowerCase().replaceAll(/\s+/g, ' ')
const isUnknownValue = (value?: unknown) => /^(not verified|not available|not clearly stated|check amazon|unknown|—)/i.test(String(value ?? '').trim())
const isBothUnknown = (row: any) => (row.aStatus === 'unclear' || isUnknownValue(row.aVal)) && (row.bStatus === 'unclear' || isUnknownValue(row.bVal))
const isDifferent = (row: any) => normalizeValue(row.aVal) !== normalizeValue(row.bVal) || row.aStatus !== row.bStatus
// Rows where neither product has usable evidence do not help a purchase decision.
// Keep one-sided unknowns visible: absence of a statement is not proof of no support.
const applyRowFilters = (rows: any[]) => rows.filter((row) => !isBothUnknown(row) && (!onlyDifferences.value || isDifferent(row)))

const visibleRows = computed(() => applyRowFilters(article.value.rows))
const visibleAttributes = computed(() => applyRowFilters(article.value.attributes))
const matrixCountLabel = computed(() => onlyDifferences.value
  ? `${visibleRows.value.length} differences shown`
  : `${visibleRows.value.length} functions with available evidence`)
const keyDifferences = computed(() => article.value.rows
  .filter((row: any) => !isBothUnknown(row) && isDifferent(row))
  .slice(0, 20))

const attributeGroups = computed(() => {
  const groups = [
    { key: 'purchase', label: 'Purchase context', keys: ['price', 'rating', 'review_count', 'availability', 'subscription', 'amazon_rank'] },
    { key: 'size', label: 'Size and physical specifications', keys: ['dimensions', 'dimension', 'weight', 'item_weight', 'capacity'] },
    { key: 'identity', label: 'Product identity and selected variant', keys: ['brand', 'asin', 'model', 'variant', 'color', 'material'] }
  ]
  const assigned = new Set(groups.flatMap(group => group.keys))
  const result = groups.map(group => ({ ...group, rows: visibleAttributes.value.filter((row: any) => group.keys.includes(row.key)) }))
  const other = visibleAttributes.value.filter((row: any) => !assigned.has(row.key))
  if (other.length) result.push({ key: 'other', label: 'Additional specifications', keys: [], rows: other })
  return result.filter(group => group.rows.length)
})

const productHeading = (side: 'a' | 'b') => {
  const product = productFor(side)
  return product?.asin ? `${product.name} (${product.asin})` : (side === 'a' ? article.value.a : article.value.b)
}

const productFor = (side: 'a' | 'b') => article.value.products.find((item: any) => item.side === side)
const reviewThemes = (review: any) => Array.isArray(review.themes) ? review.themes : []
const hasReviewThemes = (review: any) => reviewThemes(review).length > 0
const reviewAdvantages = (review: any) => reviewThemes(review).filter((theme: any) => theme.kind === 'positive')
const reviewProblems = (review: any) => reviewThemes(review).filter((theme: any) => theme.kind !== 'positive')
const allLatestReviewSamples = computed(() => article.value.userReviewSummaries.length > 0
  && article.value.userReviewSummaries.every((review: any) => review.sampleMethod === 'latest_desc'))
const ownerSummary = (detail: string) => detail
  .replace(/^All \d+ visible reviews describe/i, 'Owners describe')
  .replace(/^\d+ of \d+ reviews describe/i, 'Owners describe')
  .replace(/^\d+ of \d+ reviews discuss/i, 'Owners discuss')
  .replace(/^\d+ of \d+ reviews mention/i, 'Owners mention')
  .replace(/^\d+ of \d+ reviews value/i, 'Owners value')
  .replace(/^\d+ of \d+ reviews report/i, 'Owners report')
  .replace(/^\d+ of \d+ reviews specifically call out/i, 'Some owners specifically call out')

const marketplaceLabel = computed(() => {
  return article.value.marketplace
})

const productRecommendation = (product: any) => article.value.bestFor.find((item: any) => normalizeValue(item.pick).includes(normalizeValue(product.name)) || normalizeValue(product.name).includes(normalizeValue(item.pick)))
const productFitText = (product: any) => {
  const recommendation = productRecommendation(product)
  if (recommendation) return recommendation.who.replace(/^Best fit if\s+/i, '')
  const side = product.side === 'b' ? 'b' : 'a'
  const other = side === 'a' ? 'b' : 'a'
  const distinctive = article.value.rows
    .filter((row: any) => ['explicit', 'claim'].includes(row[`${side}Status`]) && ['unclear', 'unsupported'].includes(row[`${other}Status`]))
    .slice(0, 3)
    .map((row: any) => row.label)
  return distinctive.length
    ? `you prioritize ${distinctive.join(', ')}, which are more clearly documented for this product.`
    : 'its documented functions match your priorities and the unresolved fit checks are acceptable.'
}

useHead(() => ({
  title: `${article.value.title} — PetMetric`,
  meta: [{ name: 'description', content: article.value.verdict }],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://petmetric.com/' },
      { '@type': 'ListItem', position: 2, name: 'Comparisons', item: 'https://petmetric.com/comparisons/' },
      { '@type': 'ListItem', position: 3, name: article.value.title, item: `https://petmetric.com/comparisons/${String(route.params.slug)}/` }
    ]
  }) }]
}))
</script>

<template>
  <div>
    <AppBreadcrumbs :items="[{label:'Home',to:'/'},{label:'Comparisons',to:'/comparisons/'},{label:article.title}]" />
    <section class="page-hero comparison-hero"><div class="container"><span class="eyebrow">{{ article.category }} · {{ article.comparisonType }}</span><h1 class="display">{{ article.title }}</h1></div></section>

    <section class="section comparison-detail-section"><div class="container content-layout comparison-detail-layout"><article class="article-page comparison-detail-page">
      <section class="comparison-decision-summary" aria-labelledby="decision-summary-title">
        <p class="design-section-label">Decision summary</p>
        <h2 id="decision-summary-title">{{ article.decisionQuestion }}</h2>
        <p class="comparison-decision-lead">{{ article.verdict }}</p>
        <p v-if="article.comparisonType !== 'Direct alternative'" class="comparison-scope-note"><strong>Comparison scope:</strong> This is a {{ article.comparisonType.toLowerCase() }}. The products should not be treated as interchangeable replacements.</p>
        <div v-if="article.products.length" class="comparison-fit-grid">
          <article v-for="product in article.products" :key="product.side">
            <span>Choose {{ product.name }} if…</span>
            <strong>{{ productFitText(product) }}</strong>
          </article>
        </div>
        <p v-if="article.scopeNote" class="comparison-scope-note">{{ article.scopeNote }}</p>
        <div v-if="article.whyCompare || article.controversy || article.decisionRule" class="comparison-decision-context">
          <article v-if="article.whyCompare"><span>Why compare these products</span><p>{{ article.whyCompare }}</p></article>
          <article v-if="article.controversy"><span>Where this comparison can mislead</span><p>{{ article.controversy }}</p></article>
          <article v-if="article.decisionRule"><span>Decision rule</span><p>{{ article.decisionRule }}</p></article>
        </div>
      </section>

      <section v-if="article.products.length" class="comparison-product-identities" aria-label="Products being compared">
        <article v-for="product in article.products" :key="product.side" class="comparison-product-identity">
          <R2Image :image-key="null" :fallback="product.img || ''" :alt="product.name" />
          <div>
            <p class="design-section-label">Product {{ product.side.toUpperCase() }}</p>
            <h2>{{ product.name }}</h2>
            <p><strong>{{ product.brand }}</strong> · ASIN {{ product.asin || 'Not verified' }}</p>
            <p>{{ product.variant }}</p>
<a v-if="product.merchantUrl" class="text-link" :href="product.merchantUrl" target="_blank" rel="sponsored nofollow noopener">View original listing</a>
          </div>
        </article>
      </section>

      <section class="comparison-research-scope" aria-label="Research scope">
        <div><span>Marketplace</span><strong>{{ marketplaceLabel }}</strong></div>
        <div><span>Delivery location</span><strong>{{ article.deliveryCountry }}</strong></div>
        <div><span>Listing checked</span><strong>{{ article.checkedAt || article.updated }}</strong></div>
        <div><span>Evidence coverage</span><strong>{{ article.evidenceConfidence }}</strong></div>
        <p v-if="!article.checkedAt">The two listings do not currently share one confirmed check date. Time-sensitive values should be treated as snapshots.</p>
      </section>

      <section v-if="keyDifferences.length" id="key-differences" class="comparison-section-block">
        <div class="comparison-section-heading"><div><p class="design-section-label">Start here</p><h2>Key purchase differences</h2></div><span>{{ keyDifferences.length }} decision-relevant differences</span></div>
        <div class="key-difference-list">
          <article v-for="row in keyDifferences" :key="row.label">
            <h3>{{ row.label }}</h3>
            <div><span>{{ article.a }}</span><p>{{ row.aVal }}</p></div>
            <div><span>{{ article.b }}</span><p>{{ row.bVal }}</p></div>
          </article>
        </div>
      </section>

      <section id="core-functions" class="comparison-section-block">
        <div class="comparison-section-heading"><div><p class="design-section-label">Functional comparison</p><h2>Core function matrix</h2></div><span>{{ matrixCountLabel }}</span></div>
        <div class="comparison-view-controls" aria-label="Comparison display options">
          <label><input v-model="onlyDifferences" type="checkbox" /> <span>Only show differences</span></label>
        </div>
        <table v-if="visibleRows.length" class="comparison-table comparison-table--decision comparison-table--core">
          <thead><tr><th>Core function</th><th><a v-if="productFor('a')?.merchantUrl" class="comparison-product-link" :href="productFor('a').merchantUrl" target="_blank" rel="noopener">{{ productHeading('a') }}</a><template v-else>{{ productHeading('a') }}</template></th><th><a v-if="productFor('b')?.merchantUrl" class="comparison-product-link" :href="productFor('b').merchantUrl" target="_blank" rel="noopener">{{ productHeading('b') }}</a><template v-else>{{ productHeading('b') }}</template></th></tr></thead>
          <tbody><template v-for="(row,index) in visibleRows" :key="row.label">
            <tr v-if="index === 0 || row.group !== visibleRows[index - 1]?.group" class="comparison-table-group"><th colspan="3">{{ row.group }}</th></tr>
            <tr><td data-label="Core function"><strong :title="row.helpText">{{ row.label }}</strong><small v-if="row.helpText">{{ row.helpText }}</small></td><td :data-label="productHeading('a')"><span class="evidence-value">{{ row.aVal }}</span></td><td :data-label="productHeading('b')"><span class="evidence-value">{{ row.bVal }}</span></td></tr>
          </template></tbody>
        </table>
        <p v-else class="comparison-empty-state">No documented differences match this view. Turn off “Only show differences” to see comparable functions.</p>
      </section>

      <details id="specifications" class="comparison-specifications" open>
        <summary><span><small>Reference details</small><strong>Purchase context and product specifications</strong></span><em>{{ visibleAttributes.length }} attributes</em></summary>
        <div class="comparison-specifications-body">
          <section v-for="group in attributeGroups" :key="group.key">
            <h3>{{ group.label }}</h3>
            <table class="comparison-table comparison-table--decision comparison-table--core comparison-table--attributes">
              <thead><tr><th>Product attribute</th><th><a v-if="productFor('a')?.merchantUrl" class="comparison-product-link" :href="productFor('a').merchantUrl" target="_blank" rel="noopener">{{ productHeading('a') }}</a><template v-else>{{ productHeading('a') }}</template></th><th><a v-if="productFor('b')?.merchantUrl" class="comparison-product-link" :href="productFor('b').merchantUrl" target="_blank" rel="noopener">{{ productHeading('b') }}</a><template v-else>{{ productHeading('b') }}</template></th></tr></thead>
              <tbody><tr v-for="row in group.rows" :key="row.key"><td data-label="Product attribute"><strong>{{ row.label }}</strong><small v-if="row.note">{{ row.note }}</small></td><td :data-label="productHeading('a')"><span class="evidence-value">{{ row.aVal }}</span></td><td :data-label="productHeading('b')"><span class="evidence-value">{{ row.bVal }}</span></td></tr></tbody>
            </table>
          </section>
        </div>
      </details>

      <section v-if="article.userReviewSummaries.length || article.userFeedback" id="user-reviews" class="comparison-section-block comparison-user-reviews">
        <div class="comparison-section-heading">
          <div><p class="design-section-label">Owner experience</p><h2>What users liked—and what caused friction</h2></div>
          <span>{{ allLatestReviewSamples ? 'Newest review snapshot' : 'Owner review snapshot' }}</span>
        </div>
        <p v-if="allLatestReviewSamples" class="comparison-user-reviews-intro">A practical summary of the product advantages and problems described in each product’s newest available reviews. We use up to 50 per product and use all available reviews when there are fewer. These are reported experiences, not PetMetric test results.</p>
        <p v-else-if="article.userReviewSummaries.length" class="comparison-user-reviews-intro">A practical summary of the product advantages and problems described in the linked review sources. These are reported experiences, not PetMetric test results.</p>
        <div v-if="article.userReviewSummaries.length" class="comparison-review-grid">
          <article v-for="review in article.userReviewSummaries" :key="review.side" class="comparison-review-card">
            <header>
              <div>
                <p class="design-section-label">Product {{ review.side.toUpperCase() }}</p>
                <h3>{{ review.productName }}</h3>
              <p v-if="review.rating !== null && review.reviewCount" class="comparison-review-rating">{{ review.sourceName }} rating <strong>{{ review.rating.toFixed(1) }} / 5</strong> · {{ review.reviewCount.toLocaleString('en-US') }} ratings</p>
              <p v-else class="comparison-review-rating">No ratings or review text were available when checked.</p>
              <p v-if="review.sampleMethod === 'latest_desc'" class="comparison-review-rating">Latest {{ review.visibleReviewCount }} reviews<span v-if="review.sampleOldestReviewAt && review.sampleNewestReviewAt"> · {{ review.sampleOldestReviewAt }} to {{ review.sampleNewestReviewAt }}</span></p>
              </div>
            </header>
            <div v-if="hasReviewThemes(review)" class="comparison-review-groups">
              <section>
                <h4>Advantages users mention</h4>
                <ul>
                  <li v-for="theme in reviewAdvantages(review)" :key="theme.label"><strong>{{ theme.label }}</strong><p>{{ ownerSummary(theme.detail) }}</p></li>
                </ul>
              </section>
              <section>
                <h4>Problems users encountered</h4>
                <ul>
                  <li v-for="theme in reviewProblems(review)" :key="theme.label"><strong>{{ theme.label }}</strong><p>{{ ownerSummary(theme.detail) }}</p></li>
                </ul>
              </section>
            </div>
            <div v-else class="comparison-review-empty">
              <h4>Not enough verified owner feedback yet</h4>
              <p>{{ review.summary }}</p>
            </div>
            <footer>
              <p>{{ review.sampleNote }}</p>
              <a :href="review.sourceUrl" target="_blank" rel="noopener">{{ hasReviewThemes(review) ? `Read ${review.sourceName}` : `Check ${review.sourceName}` }}</a>
            </footer>
          </article>
        </div>
        <div v-else class="comparison-review-empty">
          <h3>Owner-review sample not yet verified</h3>
          <p>{{ article.userFeedback.summary }}</p>
          <p>{{ article.userFeedback.sampleLimit }}</p>
        </div>
      </section>

      <section id="conclusion" class="comparison-section-block">
        <p class="design-section-label">Conditional recommendation</p><h2>Research conclusion</h2>
        <div class="research-conclusion"><p><strong>Core-function leader:</strong> {{ article.researchConclusion.coreFunctionLeader }}</p><p><strong>Practical choice:</strong> {{ article.researchConclusion.practicalChoice }}</p></div>
      </section>

      <div class="correction-cta"><div><h3>See something that changed?</h3><p>Send us the exact source, marketplace, and variant so we can re-check this comparison.</p></div><NuxtLink class="btn btn--accent" to="/contact/">Submit a correction</NuxtLink></div>
    </article>

    <aside class="sidebar comparison-sidebar"><nav class="sidebar-card" aria-label="On this page"><span class="eyebrow">On this page</span><ul><li v-if="keyDifferences.length"><a href="#key-differences">Key differences</a></li><li><a href="#core-functions">Core functions</a></li><li><a href="#specifications">Specifications</a></li><li v-if="article.userReviewSummaries.length || article.userFeedback"><a href="#user-reviews">User reviews</a></li><li><a href="#conclusion">Conclusion</a></li></ul></nav><div class="sidebar-card"><span class="eyebrow">Continue research</span><ul><li><NuxtLink to="/products/">Browse product database</NuxtLink></li><li><NuxtLink to="/best-picks/">Read our Best Picks</NuxtLink></li><li><NuxtLink to="/editorial-standards/">How we compare</NuxtLink></li></ul></div></aside>
    </div></section>
  </div>
</template>
