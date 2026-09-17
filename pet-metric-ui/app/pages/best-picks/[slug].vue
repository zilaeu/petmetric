<script setup lang="ts">
const route = useRoute()
const { data: bestPickData, notFound } = await usePetMetricApi<any>(`best-pick-${String(route.params.slug)}`, `/best-picks/${String(route.params.slug)}`, null)
if (notFound.value) throw createError({ statusCode: 404, statusMessage: 'Best pick not found' })
const content = computed(() => {
  const item = bestPickData.value
  const summary = item?.content?.why || item?.tradeoff || 'This recommendation is temporarily unavailable.'
  const category = String(item?.categorySlug || '')
  const isCamera = category === 'pet-cameras'
  const isTracker = category === 'gps-pet-trackers'
  const isFeeder = category === 'smart-pet-feeders'
  const isLitter = category === 'automatic-litter-boxes'
  const decision = item?.content?.decision && typeof item.content.decision === 'object'
    ? item.content.decision
    : {
        headline: `Why ${item?.pick || 'this product'} earns the recommendation`,
        summary: 'The recommendation is based on the constraint that defines this scenario, then balanced against the most important ownership trade-offs.',
        criteria: [
          { label: 'Scenario fit', result: 'Leads', detail: summary },
          { label: 'Ownership trade-off', result: 'Acceptable', detail: item?.tradeoff || 'Every option has a cost, maintenance task, or limitation.' },
          { label: 'Decision boundary', result: 'Must verify', detail: 'Confirm the live listing, fit, coverage, and recurring costs before buying.' }
        ],
        boundary: 'Choose another option if the live product details do not match your household priorities.',
        confidence: 'Limited'
      }
  const normalizedCriteria = (Array.isArray(decision.criteria) ? decision.criteria : []).map((criterion: any) => {
    if (typeof criterion === 'string') {
      return { label: criterion, result: 'Verify', detail: `Confirm ${criterion.toLowerCase()} for the exact product variant and your household.` }
    }
    return {
      label: criterion?.label || 'Decision criterion',
      result: criterion?.result || 'Verify',
      detail: criterion?.detail || 'Confirm this point against the exact listing and intended use.'
    }
  })
  const authoredSections = Array.isArray(item?.content?.sections) && item.content.sections.length
    ? item.content.sections
    : [
        { title: 'Why this is the fit', body: `${summary} The recommendation prioritizes the constraint that defines this scenario, so the product earns its place through a specific workflow rather than a broad feature count.` },
        { title: isCamera ? 'What to observe at home' : isTracker ? 'Coverage and alert reality' : isFeeder ? 'Accuracy with your routine' : isLitter ? 'Fit for your cats and space' : 'What the scenario demands', body: isCamera ? 'Check Wi-Fi strength, night visibility, audio delay, alert usefulness, and whether remote interaction calms or excites your pet. Observe quietly before speaking or dispensing treats.' : isTracker ? 'Confirm cellular coverage where your pet lives and travels. Test a safe-zone alert, collar attachment, live-location refresh, and battery behavior before relying on the tracker outdoors.' : isFeeder ? 'Run repeated weighed portions with the food you actually use. Check hopper access, jam recovery, bowl height, backup power, and whether the schedule remains usable when the app or Wi-Fi is unavailable.' : isLitter ? 'Measure the complete operating footprint, confirm entrance and weight range, and watch the first cycles. Account for litter compatibility, drawer capacity, cleaning access, and how each cat responds to the design.' : 'Write down the one failure or inconvenience this recommendation is meant to reduce, then verify the product addresses it in your home.' },
        { title: 'The trade-offs to accept', body: `${item?.tradeoff || 'Every option has a cost, maintenance task, or limitation.'} Include recurring plans, consumables, charging, cleaning, setup time, and replacement risk in the total ownership decision.` },
        { title: 'What to verify before buying', body: 'Confirm the current configuration, dimensions, included accessories, recurring costs, seller, stock, warranty, return terms, and delivery region on the live listing. Marketplace details can change after this guide was written.' },
        { title: 'A practical first-week plan', body: isCamera ? 'Place the camera where the relevant behavior is visible, run a quiet observation session, and change one setting at a time.' : isTracker ? 'Charge fully, fit the collar securely, test alerts nearby, and keep a physical ID tag and recovery plan in place.' : isFeeder ? 'Program a conservative schedule, weigh several meals, inspect the chute after the first day, and keep a backup feeding plan.' : isLitter ? 'Use a familiar supported litter, provide a second box during the transition, supervise the first cycles, and set a cleaning reminder.' : 'Start with a supervised trial, record what works, and keep a fallback routine for power, network, or device failures.' }
      ]
  const decisionSections = [
    { title: 'Why this product wins the scenario', body: decision.summary },
    ...(normalizedCriteria.map((criterion: any) => ({
      title: `${criterion.label} · ${criterion.result}`,
      body: criterion.detail
    }))),
    { title: 'Where the conclusion changes', body: decision.boundary },
    { title: 'Evidence confidence', body: `${decision.confidence}. This is a scenario-specific recommendation, not a universal ranking.` }
  ]
  const sections = [...decisionSections, ...authoredSections]
  const alternatives = (Array.isArray(item?.content?.alternatives) ? item.content.alternatives : []).map((alternative: any) => {
    if (Array.isArray(alternative)) return { name: String(alternative[0] || 'Alternative'), detail: String(alternative[1] || 'Compare this option against the same decision criteria.') }
    if (alternative && typeof alternative === 'object') return { name: String(alternative.name || alternative.title || 'Alternative'), detail: String(alternative.detail || alternative.body || alternative.reason || 'Compare this option against the same decision criteria.') }
    return { name: String(alternative), detail: 'Compare this option against the same fit, maintenance, safety, and ownership-cost criteria.' }
  })
  return {
    title: item?.title || 'Recommendation unavailable',
    pick: item?.pick || '—',
    summary,
    notFor: item?.content?.notFor || 'Choose another option if the live listing does not meet your household requirements or budget.',
    evidenceNote: item?.content?.evidenceNote || '',
    decision,
    normalizedCriteria,
    sections,
    alternatives,
    product: item?.product || null,
    productSlug: item?.productSlug || item?.product?.slug || '',
    updated: item?.updated || '',
    budget: item?.budget || 'See current price on the live listing',
    img: item?.img || '',
    imageKey: item?.imageKey || ''
  }
})
useHead(() => ({
  title: `${content.value.title} — PetMetricus`,
  meta: [{ name: 'description', content: seoDescription(`${content.value.title}: ${content.value.summary}`) }],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(articleJsonLd({
    title: content.value.title,
    description: content.value.summary,
    url: `https://petmetricus.com/best-picks/${String(route.params.slug)}/`,
    dateModified: content.value.updated,
    image: content.value.img
  })) }, { type: 'application/ld+json', innerHTML: JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://petmetricus.com/' },
      { '@type': 'ListItem', position: 2, name: 'Best Picks', item: 'https://petmetricus.com/best-picks/' },
      { '@type': 'ListItem', position: 3, name: content.value.title, item: `https://petmetricus.com/best-picks/${String(route.params.slug)}/` }
    ]
  }) }]
}))
</script>
<template><div><AppBreadcrumbs :items="[{label:'Home',to:'/'},{label:'Best Picks',to:'/best-picks/'},{label:content.title}]" /><section class="page-hero best-pick-article-hero"><div class="container"><div class="best-pick-hero-copy"><span class="eyebrow">Best pick · Scenario guide</span><h1 class="display">{{ content.title }}</h1><p>{{ content.summary }}</p><div class="best-pick-article-meta"><span>Our pick</span><strong>{{ content.pick }}</strong><b>{{ content.budget }}</b></div></div><div v-if="content.img" class="best-pick-hero-image"><R2Image :image-key="content.imageKey" :fallback="content.img" :alt="content.pick" eager /></div></div></section><section class="section"><div class="container content-layout"><article class="article-page best-pick-article"><div class="note"><p><strong>Our pick: {{ content.pick }}.</strong> This is a recommendation for this scenario, not a universal ranking.</p></div><section v-for="(section,index) in content.sections" :key="section.title" class="best-pick-article-section"><p class="design-section-label">{{ String(index + 1).padStart(2, '0') }}</p><h2>{{ section.title }}</h2><p>{{ section.body }}</p></section><section class="best-pick-article-section best-pick-article-boundary"><h2>Who should choose something else</h2><p>{{ content.notFor }} If your priorities differ, start from the <NuxtLink to="/comparisons/">comparison desk</NuxtLink> and use the same criteria to make a different call.</p></section><section v-if="content.alternatives.length" class="best-pick-article-section"><p class="design-section-label">Alternatives</p><h2>Also worth considering</h2><div class="best-pick-alternatives"><article v-for="alternative in content.alternatives" :key="alternative.name"><strong>{{ alternative.name }}</strong><p>{{ alternative.detail }}</p></article></div></section><section v-if="content.product" class="best-pick-article-section best-pick-product-facts"><p class="design-section-label">Verified product record</p><h2>What was checked on Amazon</h2><dl><div><dt>ASIN</dt><dd>{{ content.product.asin }}</dd></div><div><dt>Brand / variant</dt><dd>{{ content.product.brand || content.pick }}</dd></div><div><dt>Rating</dt><dd>{{ content.product.rating === null ? 'Not captured' : `${content.product.rating.toFixed(1)} / 5` }}<span v-if="content.product.reviewCount !== null"> · {{ content.product.reviewCount.toLocaleString() }} reviews</span><span v-else> · review count not captured</span></dd></div><div><dt>Availability</dt><dd>{{ content.product.availability || 'Check live Amazon listing' }}</dd></div><div><dt>Checked</dt><dd>{{ content.product.commerceCheckedAt || 'Date not available' }}</dd></div></dl><a v-if="content.product.merchantUrl" class="button button-primary best-pick-amazon-link" :href="content.product.merchantUrl" target="_blank" rel="sponsored nofollow noopener">Check current Amazon listing ↗</a></section><section class="best-pick-article-section"><h2>How we reached this conclusion</h2><p>We normalized the category criteria, checked the exact product variant, and separated listing facts from scenario judgment. Pricing, stock, seller, and delivery can change{{ content.updated ? `. Last editorial update ${content.updated}.` : '.' }} Affiliate relationships do not determine the result.</p><p v-if="content.evidenceNote" class="best-pick-evidence-note">{{ content.evidenceNote }}</p></section></article><aside class="sidebar"><div class="sidebar-card best-pick-side-card"><span class="eyebrow">At a glance</span><h3>{{ content.pick }}</h3><dl><div><dt>Scenario</dt><dd>{{ content.title }}</dd></div><div><dt>Budget</dt><dd>{{ content.budget }}</dd></div><div><dt>Best for</dt><dd>{{ content.summary }}</dd></div><div v-if="content.product"><dt>Product record</dt><dd>{{ content.product.asin }} · Amazon.com</dd></div></dl></div><div class="sidebar-card"><span class="eyebrow">Decision shortcut</span><h3>Start with one constraint.</h3><p class="muted">Name the cost, behavior or maintenance task you are least willing to compromise on. That usually narrows the field faster than a feature checklist.</p><NuxtLink v-if="content.productSlug" class="text-link" :to="`/reviews/${content.productSlug}/`">Read full product detail →</NuxtLink></div></aside></div></section></div></template>
