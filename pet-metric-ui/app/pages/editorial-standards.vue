<script setup lang="ts">
const active = ref('independence')

const sections = [
  { id: 'independence', eyebrow: 'Principle 01', title: 'Editorial independence', body: [
    'PetMetricus chooses what to cover based on reader usefulness, category relevance, and the quality of information available. A commercial relationship does not guarantee coverage, inclusion, a higher position, a score, or a favorable verdict.',
    'Researchers and editors do not use commission rates when forming a shortlist or assessing a product. When a recommended product has no affiliate program, we still include it. When an affiliated product is a poor fit, we say so.',
    'If sponsored work is introduced, it will be labeled at the top of the page and kept outside our reviews, comparisons, Best Picks, scores, and research conclusions.'
  ], points: ['No paid rankings or score changes', 'No requirement that a recommendation be monetizable', 'Commercial relationships disclosed at page level'] },
  { id: 'selection', eyebrow: 'Principle 02', title: 'How we choose products and topics', body: [
    'We prioritize decisions with meaningful consequences for safety, recurring cost, reliability, privacy, or the daily care routine. Reader questions, product changes, and gaps in existing coverage can all prompt new research.',
    'A comparison should pair plausible alternatives for the same buyer or clearly explain why a premium-versus-value or same-brand decision is useful. We do not create mismatched comparisons simply because two product names attract searches.',
    'A shortlist may consider availability, category relevance, model generation, and evidence quality. Popularity can help identify what readers encounter, but it is not evidence of quality.'
  ], points: ['Decision relevance before search volume', 'Comparable use cases and current generations', 'Evidence quality considered before publication'] },
  { id: 'sources', eyebrow: 'Principle 03', title: 'How we source and label evidence', body: [
    'Primary sources—manuals, support documents, official specifications, regulatory filings, subscription terms, and current retailer listings—form the baseline for factual claims. We record the relevant model, region, source, and check date when those details affect interpretation.',
    'Manufacturer statements are attributed as claims. Independent measurements, structured user-feedback analysis, and our own observations are labeled separately so readers can tell what each conclusion rests on.',
    'When sources conflict, we show the disagreement or withhold a conclusion. Missing information is not silently converted into a negative score, and a retailer rating is never treated as proof of a core function.'
  ], points: ['Primary sources for specifications and policies', 'Claims, observations, and independent evidence kept distinct', 'Conflicts and unknowns remain visible'] },
  { id: 'testing', eyebrow: 'Principle 04', title: 'Hands-on testing and product samples', body: [
    'We only say “tested” when PetMetricus directly evaluated the product. The page should explain the unit or variant, evaluation period, conditions, procedures, and important limitations. Research based only on documentation or external evidence is described as research, not testing.',
    'A manufacturer-provided or loaned sample is disclosed. Providing a sample does not guarantee publication, a positive result, or advance approval. Manufacturers may check factual details, but they do not approve our verdict.',
    'Where repeatability matters—such as feeder portions, battery behavior, notification timing, or noise—we favor repeated observations over a single successful attempt and avoid implying laboratory precision we did not achieve.'
  ], points: ['Scope and limits of hands-on work disclosed', 'Sample source identified', 'Repeatable procedures for measurable behavior'] },
  { id: 'scoring', eyebrow: 'Principle 05', title: 'Scoring, rankings, and recommendations', body: [
    'Scores summarize evidence; they do not replace it. Criteria are defined for the category and should connect to a real owner decision. The underlying criterion results and limitations matter more than a decimal-point difference in the total.',
    'A product can be strong overall and still be wrong for a specific pet or home. Best Picks are organized around use cases, while comparisons explain where each alternative has an edge and whether the evidence is sufficient to name one.',
    'Price, subscription terms, regional coverage, firmware, and availability change. We avoid permanent “best” language when the conclusion depends on volatile facts, and we tell readers what to verify before buying.'
  ], points: ['Category-specific criteria', 'Fit and tradeoffs alongside any score', 'No false precision when evidence is limited'] },
  { id: 'updates', eyebrow: 'Principle 06', title: 'Updates, freshness, and material changes', body: [
    'Pages carry a checked or updated date appropriate to their content. We prioritize review when a product is recalled or discontinued, a new generation launches, a major firmware release changes behavior, subscription terms move, or a substantiated reader correction identifies a material issue.',
    'A date means the page was reviewed to the scope described; it is not a guarantee that every retailer field remains current. Price, stock, seller, shipping, and regional compatibility should always be confirmed at the destination.',
    'When a material change affects a verdict, score, safety statement, or recommendation, we update the page and describe the change rather than quietly preserving an outdated conclusion.'
  ], points: ['Risk and reader impact guide update priority', 'Volatile commerce facts clearly limited', 'Material conclusion changes documented'] },
  { id: 'corrections', eyebrow: 'Principle 07', title: 'Corrections and reader feedback', body: [
    'We welcome corrections that include the page URL, the disputed statement, and a source or reproducible observation. We aim to acknowledge submissions promptly and verify substantive corrections within five business days, though complex or manufacturer-dependent questions may take longer.',
    'Confirmed factual errors are corrected. Material changes receive a visible note or changelog entry with what changed and when. Minor spelling or formatting fixes may be made without a separate notice when they do not alter meaning.',
    'If we cannot verify a proposed correction, we do not present it as fact. We may ask for more detail, preserve the existing wording, or revise the page to state the uncertainty more clearly.'
  ], points: ['Evidence-backed corrections welcomed', 'Material corrections dated', 'Unverified reports handled transparently'] }
]

const selectSection = async (id: string) => {
  active.value = id
  await nextTick()
  const target = document.getElementById(id)
  if (!target) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  window.history.replaceState(null, '', `#${id}`)
}

let sectionObserver: IntersectionObserver | undefined

onMounted(() => {
  const initialSection = window.location.hash.slice(1)
  if (sections.some(section => section.id === initialSection)) active.value = initialSection
  sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
    if (visibleSection) active.value = visibleSection.target.id
  }, { rootMargin: '-90px 0px -55% 0px', threshold: 0 })
  sections.forEach(section => {
    const element = document.getElementById(section.id)
    if (element) sectionObserver?.observe(element)
  })
})

onBeforeUnmount(() => sectionObserver?.disconnect())

useSeoMeta({ title: 'Editorial standards & research methodology — PetMetricus', description: 'How PetMetricus selects topics, sources evidence, tests products, scores findings, updates research, and corrects errors.' })
</script>

<template>
  <div>
    <DesignHero variant="editorial" eyebrow="Methodology" title="Editorial standards & research methodology" subtitle="The rules we use to select topics, separate claims from evidence, form conclusions, disclose limitations, and correct the record." :breadcrumb="[{label:'Home',to:'/'},{label:'About',to:'/about/'},{label:'Editorial Standards'}]" />
    <section class="standards-overview">
      <div class="container">
        <p class="design-section-label">Our governing idea</p>
        <div><h2 class="display">A useful answer shows both its evidence and its limits.</h2><p>PetMetricus covers products that sit close to a pet's daily routine. That requires more care than repeating specifications or sorting by star rating. These standards apply to our guides, comparisons, Best Picks, reviews, and troubleshooting content.</p></div>
        <dl><div><dt>Commercial influence</dt><dd>Excluded from rankings and verdicts</dd></div><div><dt>Evidence status</dt><dd>Claims and unknowns labeled</dd></div><div><dt>Material errors</dt><dd>Corrected and dated</dd></div></dl>
      </div>
    </section>
    <div class="methodology-page">
      <div class="methodology-layout">
        <nav class="methodology-nav" aria-label="Editorial standards sections">
          <p>On this page</p>
          <button v-for="section in sections" :key="section.id" type="button" :class="{ active: active === section.id }" :aria-current="active === section.id ? 'location' : undefined" @click="selectSection(section.id)">{{ section.title }}</button>
          <NuxtLink to="/disclosure/">Commercial disclosure <AppIcon name="arrow" :size="12" /></NuxtLink>
        </nav>
        <article class="methodology-content">
          <section v-for="section in sections" :id="section.id" :key="section.id" :class="{ active: active === section.id }">
            <p class="design-section-label">{{ section.eyebrow }}</p>
            <h2>{{ section.title }}</h2>
            <div><p v-for="paragraph in section.body" :key="paragraph">{{ paragraph }}</p></div>
            <ul><li v-for="point in section.points" :key="point"><AppIcon name="check" :size="15" />{{ point }}</li></ul>
          </section>
          <aside class="standards-note"><AppIcon name="shield" :size="24" /><div><strong>Safety and professional care</strong><p>PetMetricus does not provide veterinary diagnosis or treatment. Manufacturer instructions, recalls, warranty terms, and advice from a qualified professional take priority when health or safety is involved.</p></div></aside>
          <div class="methodology-correction">
            <strong>Found something we got wrong?</strong>
            <p>Send the page URL, the statement in question, and the strongest source you have. We review substantiated corrections and explain material changes.</p>
            <NuxtLink class="btn btn--accent" to="/contact/">Submit a correction <AppIcon name="arrow" :size="13" /></NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
