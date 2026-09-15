<script setup lang="ts">
const revenueTypes = [
  { label: 'Affiliate links', status: 'May earn revenue', icon: 'external', body: 'When a reader follows an eligible retailer link and completes a purchase, PetMetricus may receive a commission. The reader does not pay PetMetricus an additional fee.' },
  { label: 'Sponsored editorial', status: 'Not currently published', icon: 'source', body: 'We do not currently publish sponsored reviews, comparisons, Best Picks, buying guides, or troubleshooting articles.' },
  { label: 'Display advertising', status: 'Not currently used', icon: 'scale', body: 'We do not currently run banner or programmatic display advertising. This page will be updated before that changes.' },
  { label: 'Product samples', status: 'May be accepted for evaluation', icon: 'shield', body: 'A manufacturer may provide or loan a unit. The relationship and testing scope must be disclosed on the relevant page.' }
]

const sections = [
  { title: 'How affiliate links work', body: [
    'Some “Check price,” retailer, and product links use affiliate tracking. If you click one and make a qualifying purchase, the retailer may pay PetMetricus a commission. Eligibility, attribution windows, and rates are set by the retailer or network and may change.',
    'An affiliate relationship does not increase the price charged by PetMetricus. The retailer controls price, tax, shipping, stock, seller selection, returns, warranties, and the final transaction. Always verify those details at checkout.',
    'A link can be monetized without changing the editorial conclusion. We may also use ordinary, non-affiliate links when they are clearer or when no commercial program exists.'
  ], important: 'Affiliate eligibility and commission rate do not determine which products we cover, how they are ordered, the score they receive, or the verdict we publish.' },
  { title: 'Where disclosures appear', body: [
    'This page explains our overall policy. Commercial pages should also include a plain-language disclosure close to purchase links so readers do not need to search the footer for context.',
    'Individual pages may identify a retailer relationship, the source of a product sample, or another fact specific to that article. Link styling or a button label alone is not intended to substitute for disclosure.',
    'External retailer links should be treated as destinations operated by third parties. Their content, privacy practices, availability, and terms can change after our last check.'
  ] },
  { title: 'Sponsored content and brand influence', body: [
    'PetMetricus does not currently publish sponsored content. If that changes, paid material will be labeled “Sponsored” prominently at the beginning of the page and kept distinct from independent reviews, comparisons, rankings, scores, and verdicts.',
    'Brands may provide factual corrections, manuals, or clarification. They may not purchase a higher score, choose competitors, approve our conclusion, suppress a supported limitation, or require positive language as a condition of coverage.',
    'We may give a manufacturer a reasonable opportunity to answer a technical question. Their answer is treated as a company statement unless independently verified.'
  ], important: 'Advertising or sponsorship, if introduced, will not be presented as independent editorial research.' },
  { title: 'Samples, loans, discounts, and access', body: [
    'When a product is supplied, loaned, discounted, or made available through special access, the relevant page should say so. We also describe whether the work was hands-on and the important limits of the evaluation.',
    'A sample does not guarantee coverage or a positive outcome. PetMetricus does not accept a product in exchange for a promised recommendation, minimum score, favorable comparison, or advance approval.',
    'How a unit is returned, retained for long-term checking, or otherwise handled depends on the arrangement. The editorial conclusion remains ours.'
  ] },
  { title: 'Pricing, availability, and retailer responsibility', body: [
    'Prices and availability are snapshots, not guarantees. Retailer pages can change by region, delivery address, seller, membership status, coupon, tax, shipping, product variant, or time of day.',
    'PetMetricus is not the seller and does not process orders, payments, shipping, returns, warranty claims, or subscription cancellations. Questions about a transaction should be directed to the retailer, manufacturer, or service provider.',
    'Before purchasing, confirm the exact model or generation, included accessories, voltage, cellular region, subscription requirement, seller, return window, and warranty coverage.'
  ] },
  { title: 'Compliance and policy updates', body: [
    'Our goal is clear and conspicuous disclosure consistent with applicable endorsement guidance, including the U.S. Federal Trade Commission Endorsement Guides. A legal standard is the floor; the practical test is whether a reasonable reader can understand the relationship before acting on a link.',
    'Commercial programs and our business model can change. When they do, we update this page and adjust page-level notices where necessary. The current policy applies to PetMetricus editorial content unless a page states a more specific relationship.'
  ] }
]

const readerFaq = [
  { question: 'Does PetMetricus earn money from every retailer link?', answer: 'No. Some links may be ordinary references, some merchants may not offer an affiliate program, and not every click or purchase qualifies for a commission.' },
  { question: 'Can a brand pay to be included in Best Picks?', answer: 'No. Inclusion and ordering are editorial decisions. If paid placements are ever introduced elsewhere, they will be clearly labeled and will not be part of Best Picks or our scoring.' },
  { question: 'Do free products automatically receive a review?', answer: 'No. A sample does not guarantee publication, and it does not guarantee a positive result. Any evaluation must disclose the source of the unit and its scope.' },
  { question: 'Why link to retailers at all?', answer: 'Retailer links help readers verify the current listing and complete a purchase if they choose. They can also fund the publication, but the editorial decision is made independently of that revenue opportunity.' }
]

useSeoMeta({ title: 'How PetMetricus makes money — Commercial disclosure', description: 'How PetMetricus handles affiliate links, sponsorships, product samples, retailer relationships, and editorial independence.' })
</script>

<template>
  <div>
    <DesignHero variant="disclosure" eyebrow="Commercial Disclosure" title="How PetMetricus makes money" subtitle="Commercial relationships should be understandable before you click or buy. Here is what may generate revenue, what does not, and the boundaries protecting our editorial work." :breadcrumb="[{label:'Home',to:'/'},{label:'Disclosure'}]" />
    <section class="disclosure-summary">
      <div class="container">
        <div class="disclosure-summary-copy"><p class="design-section-label">The short version</p><h2 class="display">We may earn from eligible purchases. We do not sell rankings.</h2><p>Affiliate revenue can support PetMetricus when a reader chooses to use an eligible link. It does not buy inclusion, position, a score, a verdict, or the removal of a supported criticism.</p></div>
        <div class="disclosure-flow" aria-label="How an affiliate commission works"><span>You follow an eligible link</span><AppIcon name="arrow" :size="14" /><span>The retailer handles your purchase</span><AppIcon name="arrow" :size="14" /><span>PetMetricus may receive a commission</span></div>
      </div>
    </section>
    <section class="rich-content-section">
      <div class="container">
        <div class="rich-section-heading rich-section-heading--compact"><div><p class="design-section-label">Revenue at a glance</p><h2 class="display">What currently applies to PetMetricus.</h2></div><p>These summaries are intentionally direct. The detailed policy below explains how each relationship is handled.</p></div>
        <div class="disclosure-type-grid"><article v-for="item in revenueTypes" :key="item.label"><div><AppIcon :name="item.icon as any" :size="20" /><span>{{ item.status }}</span></div><h3>{{ item.label }}</h3><p>{{ item.body }}</p></article></div>
      </div>
    </section>
    <div class="disclosure-page">
      <div class="disclosure-sections">
        <div class="rich-section-heading rich-section-heading--compact"><div><p class="design-section-label">Full policy</p><h2 class="display">The details behind the disclosure.</h2></div><p>We use plain language here so the practical effect of each relationship is clear to readers, brands, and retailers.</p></div>
        <section v-for="(section, index) in sections" :key="section.title">
          <span class="disclosure-section-number">0{{ index + 1 }}</span>
          <div><h2>{{ section.title }}</h2><p v-for="paragraph in section.body" :key="paragraph">{{ paragraph }}</p><div v-if="section.important" class="disclosure-important"><strong>Editorial boundary:</strong> {{ section.important }}</div></div>
        </section>
      </div>
    </div>
    <section class="rich-content-section rich-content-section--muted">
      <div class="container rich-faq-layout"><div><p class="design-section-label">Disclosure FAQ</p><h2 class="display">Common questions about commercial relationships.</h2><p>If a relationship on a particular page is still unclear, send us the URL and your question.</p></div><div class="rich-faq-list"><details v-for="item in readerFaq" :key="item.question"><summary>{{ item.question }}</summary><p>{{ item.answer }}</p></details></div></div>
    </section>
    <section class="disclosure-contact"><div class="container"><div><p class="design-section-label">Ask us directly</p><h2 class="display">Questions about a link, sample, or partnership?</h2><p>Contact PetMetricus and include the page URL. If a disclosure is missing or unclear, we want to fix it.</p></div><NuxtLink class="btn btn--accent" to="/contact/">Contact us <AppIcon name="arrow" :size="14" /></NuxtLink></div></section>
  </div>
</template>
