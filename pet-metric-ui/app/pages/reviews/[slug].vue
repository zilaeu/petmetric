<script setup lang="ts">
const route = useRoute()
const activeTab = ref('overview')
const activeImage = ref(0)
const { data: productData, notFound } = await usePetMetricApi<any>(`product-${String(route.params.slug)}`, `/products/${String(route.params.slug)}`, null)
if (notFound.value) throw createError({ statusCode: 404, statusMessage: 'Product review not found' })
const product = computed(() => productData.value || { name: 'Product unavailable', brand: '—', categorySlug: '', score: null, priceDisplay: '—', verdict: 'This product review is temporarily unavailable.', bestFor: '—', subscription: null, merchantUrl: '', merchantName: 'retailer' })
const review = computed(() => product.value.review || {})
const userReview = computed(() => product.value.userReviewSummary || null)
const productCategory = computed(() => ({ title: product.value.categorySlug || 'Products', slug: product.value.categorySlug || 'products' }))
const reviewBestFor = computed(() => product.value.bestFor || '—')
const galleryImages = computed(() => product.value.review?.gallery?.length ? product.value.review.gallery : product.value.img ? [product.value.img] : [])
type SpecRow = [string, string]
const specLabels: Record<string, string> = {
  amazon_bestsellers_rank: 'Amazon best sellers rank',
  cat_count: 'Cat capacity',
  field_of_view: 'Field of view',
  litter_type: 'Litter type',
  night_vision: 'Night vision',
  treat_range: 'Treat range',
  water_flow: 'Water flow'
}
const humanizeSpecKey = (key: string) => specLabels[key] || key.replaceAll('_', ' ').replace(/^./, character => character.toUpperCase())
const humanizeCategory = (value: unknown) => String(value || 'Pet technology').split('-').map(word => word.replace(/^./, character => character.toUpperCase())).join(' ')
const normalizeSpecRows = (value: unknown): Array<{ label?: unknown; key?: unknown; value?: unknown }> => {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') return Object.entries(value as Record<string, unknown>).map(([key, item]) => ({ key, label: key, value: item }))
  return []
}
const technicalSpecs = computed<SpecRow[]>(() => {
  const rows: SpecRow[] = []
  const labels = new Set<string>()
  const values = new Set<string>()
  const add = (label: unknown, value: unknown) => {
    const cleanLabel = String(label || 'Specification').trim()
    const cleanValue = String(value || '—').trim()
    const labelKey = cleanLabel.toLocaleLowerCase('en-US')
    const valueKey = cleanValue.toLocaleLowerCase('en-US')
    if (/price|rating|availability|last checked|subscription/i.test(cleanLabel) || labels.has(labelKey) || values.has(valueKey)) return
    labels.add(labelKey)
    values.add(valueKey)
    rows.push([cleanLabel, cleanValue])
  }
  for (const item of normalizeSpecRows(review.value.quickSpecs)) add(item.label || item.key, item.value)
  for (const item of normalizeSpecRows(product.value.specDetails)) add(item.label || item.key || 'Listing detail', item.value)
  for (const [key, value] of Object.entries(product.value.filterSpecs || {})) add(humanizeSpecKey(key), value)
  add('Brand', product.value.brand)
  add('Product category', humanizeCategory(product.value.categorySlug))
  add('Intended use', product.value.bestFor)
  return rows
})
const heroSpecs = computed(() => technicalSpecs.value.filter(row => row[0] !== 'Brand').slice(0, 4))
const displayPrice = computed(() => product.value.priceDisplay || 'Check current listing')
const listingSpecs = computed<SpecRow[]>(() => [
  ['Price', displayPrice.value],
  ['Price status', product.value.priceStatus === 'verified' ? 'Verified at last check' : product.value.priceStatus === 'stale' ? 'Historical value — recheck' : 'Unavailable'],
  ['Owner rating', product.value.amazonRating == null ? 'Not captured' : `${Number(product.value.amazonRating).toFixed(1)} / 5${product.value.amazonReviewCount == null ? ' (review count not captured)' : ` (${Number(product.value.amazonReviewCount).toLocaleString('en-US')} ratings)`}`],
  ['Availability', product.value.availability || 'Check current listing'],
  ['Plan or subscription', product.value.subscription || 'Not stated'],
  ['Marketplace', product.value.marketplaceDomain || product.value.merchantName || '—'],
  ['Delivery region', product.value.deliveryCountryCode === 'US' ? 'United States' : product.value.deliveryCountryCode || '—'],
  ['ASIN', product.value.asin || product.value.id || '—'],
  ['Listing last checked', product.value.commerceCheckedAt || product.value.updated || '—']
])
const strengths = computed(() => product.value.review?.strengths || [])
const limitations = computed(() => product.value.review?.limitations || [])
const reviewSections = computed(() => [
  { title: 'Decision framework', body: decisionSignals.value.map(signal => `${signal.label}: ${signal.result} (${signal.status}).`).join(' ') },
  ...(userReview.value?.summary
    ? [{ title: 'Owner feedback themes', body: `${userReview.value.summary} Positive themes: ${(userReview.value.positives || []).join('; ') || 'Not captured'}. Concerns: ${(userReview.value.concerns || []).join('; ') || 'Not captured'}.` }]
    : [{ title: 'Owner feedback status', body: 'A review-level owner sample has not yet been verified for this exact Amazon variant. The displayed Amazon rating and review count are marketplace context, not a substitute for coded owner feedback.' }]),
  { title: 'Common questions', body: productFaq.value.map(item => `${item.question} ${item.answer}`).join(' ') },
  ...(Array.isArray(review.value.sections) ? review.value.sections : [])
])
const evidenceStatus = computed(() => product.value.amazonVerified
  ? `Amazon.com listing verified${product.value.commerceCheckedAt ? ` on ${formatReviewDate(product.value.commerceCheckedAt, '')}` : ''}. The editorial record cites ${review.value.sourceCount || 1} source${Number(review.value.sourceCount || 1) === 1 ? '' : 's'}; no hands-on testing is claimed unless a page explicitly describes its test method.`
  : 'This product record is not currently linked to a verified Amazon ASIN.')
const ownershipCost = computed(() => {
  const base = Number(product.value.price)
  const subscription = String(product.value.subscription || '')
  const recurring = subscription && /\$[\d.]+/.test(subscription) ? subscription : 'No recurring subscription captured'
  return { base: Number.isFinite(base) ? `$${base.toFixed(2)}` : 'Unavailable', recurring }
})
const decisionSignals = computed(() => {
  const category = String(product.value.categorySlug || '')
  const criteria: Record<string, string[]> = {
    'pet-grooming-tools': ['Noise and handling', 'Coat or nail fit', 'Cleaning and replacement parts', 'Battery and session length'],
    'pet-waste-cleanup': ['Leak and odor control', 'Capacity and refill cost', 'Daily cleanup effort', 'Pet and home fit'],
    'pet-walking-safety': ['Fit and adjustment range', 'Escape resistance', 'Visibility and control', 'Walking and travel use']
  }
  return (criteria[category] || ['Daily usefulness', 'Setup and maintenance', 'Long-term ownership cost', 'Pet and household fit']).map((label, index) => ({
    label,
    result: index === 0 ? (product.value.bestFor || 'Review the documented use case') : index === 1 ? (technicalSpecs.value[index]?.[1] || 'Check the full specification') : index === 2 ? ownershipCost.value.recurring : 'Confirm the exact fit on the live listing',
    status: index < 2 ? 'Documented' : 'Verify before buying'
  }))
})
const productFaq = computed(() => [
  { question: `Who is the ${product.value.name} best for?`, answer: product.value.bestFor || 'Choose it when its documented fit and maintenance requirements match your pet and household.' },
  { question: `Is the ${product.value.name} price current?`, answer: product.value.priceStatus === 'verified' ? `The displayed Amazon.com price was checked on ${formatReviewDate(product.value.commerceCheckedAt, 'the last recorded date')}. Prices and availability can change.` : 'The current price was not available at the last check. Use the linked Amazon listing before purchasing.' },
  { question: 'What should I verify before buying?', answer: 'Confirm the exact variant, dimensions, included accessories, seller, delivery region, warranty, recurring costs, and return terms on the live listing.' }
])
const formatReviewDate = (value: unknown, fallback: string) => {
  if (!value) return fallback
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date)
}
const researchInfo = computed(() => [
  ['Research date', formatReviewDate(review.value.researchDate, '—')],
  ['Last price check', formatReviewDate(review.value.priceCheckedDate, '—')],
  ['Next review due', review.value.nextReview || '—'],
  ['Sources cited', review.value.sourceCount ? `${review.value.sourceCount} sources` : '—']
])

useHead(() => ({
  title: `${product.value.name} review — PetMetric`,
  meta: [{ name: 'description', content: product.value.verdict }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.value.name,
      image: product.value.img ? [product.value.img] : undefined,
      brand: product.value.brand ? { '@type': 'Brand', name: product.value.brand } : undefined,
      sku: product.value.id,
      url: `https://petmetric.com/reviews/${String(route.params.slug)}/`,
      offers: product.value.price != null ? {
        '@type': 'Offer',
        url: product.value.merchantUrl || `https://petmetric.com/reviews/${String(route.params.slug)}/`,
        priceCurrency: 'USD',
        price: Number(product.value.price).toFixed(2),
        availability: /in stock/i.test(String(product.value.availability || ''))
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock'
      } : undefined,
      aggregateRating: product.value.amazonRating != null && product.value.amazonReviewCount != null ? {
        '@type': 'AggregateRating',
        ratingValue: Number(product.value.amazonRating).toFixed(1),
        reviewCount: Number(product.value.amazonReviewCount)
      } : undefined
    })
  }, {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://petmetric.com/' },
        { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://petmetric.com/products/' },
        { '@type': 'ListItem', position: 3, name: `${product.value.name} Review`, item: `https://petmetric.com/reviews/${String(route.params.slug)}/` }
      ]
    })
  }, {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: productFaq.value.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) })
  }]
}))
</script>

<template>
  <div>
    <AppBreadcrumbs :items="[
      { label: 'Home', to: '/' },
      { label: 'Products', to: '/products/' },
      { label: productCategory.title, to: `/products/${productCategory.slug}/` },
      { label: `${product.name} Review` }
    ]" />

    <section class="review-hero"><div class="container review-hero-grid"><div class="review-gallery"><div class="review-main-image"><img v-if="galleryImages.length" :src="galleryImages[activeImage]" :alt="product.alt" /><div v-else class="empty-state">Image unavailable</div></div><div v-if="galleryImages.length > 1" class="review-thumbs"><button v-for="(image,index) in galleryImages" :key="image" type="button" :class="{active:activeImage===index}" :aria-label="`View image ${index + 1}`" @click="activeImage=index"><img :src="image" alt="" /></button></div></div><div class="review-buy-panel"><p class="design-section-label">{{ product.brand }} · Product review</p><h1 class="display">{{ product.name }}</h1><div class="review-best-for"><strong>Best for:</strong> {{ reviewBestFor }}</div><div class="review-score"><strong>{{ product.score != null ? Number(product.score).toFixed(1) : product.amazonRating != null ? Number(product.amazonRating).toFixed(1) : '—' }}</strong><div><b>{{ product.score != null ? 'PetMetric Score' : 'Amazon rating' }}</b><span>{{ product.score != null ? 'Average across evaluated criteria' : `${product.amazonReviewCount == null ? 'Customer review count not captured' : `${Number(product.amazonReviewCount).toLocaleString('en-US')} customer ratings`} · checked ${formatReviewDate(product.commerceCheckedAt, 'date unavailable')}` }}</span></div></div><div class="review-price"><strong>{{ displayPrice }}</strong><span>Amazon.com US price at last check</span><p><template v-if="product.marketplaceDomain === 'amazon.com'">Delivery location: United States · </template>{{ product.subscription || 'No subscription information shown' }}</p><a v-if="product.merchantUrl" class="btn btn--accent" :href="product.merchantUrl" target="_blank" rel="sponsored nofollow noopener">Check current Amazon listing <AppIcon name="external" :size="14" /></a><small class="affiliate-note">We may earn a commission from eligible purchases. This does not affect our editorial conclusion.</small></div><div class="quick-specs"><div v-for="spec in heroSpecs" :key="`${spec[0]}-${spec[1]}`"><span>{{ spec[0] }}</span><strong>{{ spec[1] }}</strong></div></div></div></div></section>

    <nav class="review-tabs-wrap"><div class="container review-tabs"><button :class="{active:activeTab==='overview'}" @click="activeTab='overview'">Overview</button><button :class="{active:activeTab==='specs'}" @click="activeTab='specs'">Full Specs</button></div></nav>

    <section class="review-content"><div class="container"><div v-if="activeTab==='overview'" class="review-columns"><article class="article-page"><h2>What it is</h2><p>{{ review.summary || product.verdict }}</p><section class="review-detail-section"><h3>Who should choose it</h3><p>{{ product.bestFor || 'Choose this product when its documented features match your pet, home, and maintenance routine.' }}</p></section><section class="review-detail-section"><h3>Evidence and verification</h3><p>{{ evidenceStatus }}</p><p>Listing facts, editorial judgments, and owner feedback are kept separate. Price, stock, seller, delivery, and review counts can change after this page is updated.</p></section><section class="review-detail-section"><h3>Ownership cost snapshot</h3><p>Purchase price at last check: <strong>{{ ownershipCost.base }}</strong>. Recurring cost: <strong>{{ ownershipCost.recurring }}</strong>. Add replacement parts, consumables, cleaning supplies, and warranty coverage before comparing total cost.</p></section><div v-if="strengths.length || limitations.length" class="pros-cons-grid"><section v-if="strengths.length"><p>Strengths</p><ul><li v-for="item in strengths" :key="item"><span>✓</span>{{ item }}</li></ul></section><section v-if="limitations.length"><p>Limitations</p><ul><li v-for="item in limitations" :key="item"><span>–</span>{{ item }}</li></ul></section></div><section v-for="section in reviewSections" :key="section.title" class="review-detail-section"><div><h3>{{ section.title }}</h3></div><p>{{ section.body }}</p></section><section class="review-detail-section"><h3>What to verify before buying</h3><ul><li>Exact size, generation, and included accessories</li><li>Current Amazon seller, delivery region, return terms, and warranty</li><li>Replacement parts, subscription, and ongoing maintenance costs</li></ul></section></article><aside class="review-aside"><p class="design-section-label">Page information</p><table class="mini-spec-table"><tbody><tr v-for="row in researchInfo" :key="row[0]"><th>{{ row[0] }}</th><td>{{ row[1] }}</td></tr></tbody></table><NuxtLink v-if="product.categorySlug" class="btn btn--dark" :to="`/products/${product.categorySlug}/`">Back to category <AppIcon name="arrow" :size="14" /></NuxtLink></aside></div><div v-else class="review-tab-panel"><section class="review-spec-section"><header><h2 class="display">Full specifications</h2><p>Product characteristics combined from the reviewed listing, editorial notes, and category data.</p></header><div class="spec-grid"><div v-for="row in technicalSpecs" :key="`${row[0]}-${row[1]}`"><span>{{ row[0] }}</span><strong>{{ row[1] }}</strong></div></div></section><section class="review-spec-section"><header><h3>Listing information</h3><p>Marketplace fields are separated from product specifications because they can change independently.</p></header><div class="spec-grid"><div v-for="row in listingSpecs" :key="row[0]"><span>{{ row[0] }}</span><strong>{{ row[1] }}</strong></div></div></section></div></div></section>
  </div>
</template>
