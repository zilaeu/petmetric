import catalog from '../data/content.json'

type AnyRecord = Record<string, any>
const rich = catalog as AnyRecord
const categoryMeta: Record<string, AnyRecord> = {
  'automatic-litter-boxes': { eyebrow: 'Product database', icon: 'litter', criteria: ['Cat entry and weight fit', 'Litter compatibility', 'Safety sensors and cleaning workflow', 'Consumables and app costs'] },
  'smart-pet-feeders': { eyebrow: 'Product database', icon: 'feeder', criteria: ['Portion repeatability', 'Food and kibble compatibility', 'Jam recovery and cleaning', 'Schedule storage and backup power'] },
  'gps-pet-trackers': { eyebrow: 'Product database', icon: 'tracker', criteria: ['Network coverage', 'Live refresh and escape alerts', 'Battery and charging', 'Collar fit and membership cost'] },
  'pet-cameras': { eyebrow: 'Product database', icon: 'camera', criteria: ['Field of view and night vision', 'Alert quality', 'Local versus cloud storage', 'Subscription and privacy controls'] },
  'smart-water-fountains': { eyebrow: 'Hydration technology', icon: 'feeder', criteria: ['Water delivery', 'Hygiene and cleaning', 'Noise and consumables'] },
  'pet-grooming-tools': { eyebrow: 'Daily care', icon: 'wrench', criteria: ['Noise and handling', 'Coat or nail fit', 'Cleaning and replacement parts'] },
  'pet-waste-cleanup': { eyebrow: 'Cleaner routines', icon: 'refresh', criteria: ['Leak and odor control', 'Capacity and refill cost', 'Daily cleanup effort'] },
  'pet-walking-safety': { eyebrow: 'Outdoors and travel', icon: 'shield', criteria: ['Fit and adjustment range', 'Escape resistance', 'Visibility and control'] }
}
function env(event: any) { return event.context.cloudflare?.env || {} }
function hasDb(db: any): db is D1Database { return Boolean(db && typeof db.prepare === 'function') }
function jsonError(status: number, message: string) { throw createError({ statusCode: status, statusMessage: message }) }
function categoryFor(slug: string) { return (rich.categories || []).find((c: AnyRecord) => c.slug === slug) }
function normalizeCriteria(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.map((criterion: any) => {
    if (typeof criterion === 'string') return { title: criterion, description: `Compare ${criterion.toLowerCase()} across the exact variants you are considering.` }
    if (Array.isArray(criterion)) return { title: String(criterion[0] || 'Decision criterion'), description: String(criterion[1] || '') }
    return { ...criterion, title: String(criterion?.title || 'Decision criterion'), description: String(criterion?.description || '') }
  })
}
function categoryRow(row: AnyRecord) {
  const fallback = categoryMeta[row.slug] || {}
  const products = (rich.products || []).filter((product: AnyRecord) => product.categorySlug === row.slug)
  const comparisons = (rich.research || []).filter((item: AnyRecord) => item.type === 'Comparison' && item.categorySlug === row.slug).length
  const reviewed = products.filter((product: AnyRecord) => product.review && (product.review.summary || product.review.sections?.length)).length
  return {
    ...fallback,
    ...row,
    title: row.title || row.name,
    shortName: row.shortName || row.title || row.name,
    subtitle: row.subtitle || row.description || 'Independent product research focused on fit, ownership trade-offs, and verifiable listing facts.',
    description: row.description || row.subtitle || '',
    count: products.length,
    productCount: products.length,
    reviewedCount: row.reviewedCount ?? reviewed,
    comparisons: row.comparisons ?? comparisons,
    criteria: normalizeCriteria(row.criteria?.length ? row.criteria : fallback.criteria)
  }
}
function productRow(row: AnyRecord) {
  const price = row.price == null ? null : Number(row.price)
  const asinCandidate = String(row.asin || row.externalId || row.external_id || row.id || '').trim()
  const asin = /^B[A-Z0-9]{9}$/.test(asinCandidate) ? asinCandidate : null
  const merchantUrl = asin ? `https://www.amazon.com/dp/${asin}` : (row.merchantUrl || row.merchant_url || null)
  const amazonVerified = Boolean(asin && merchantUrl === `https://www.amazon.com/dp/${asin}`)
  const specDetails = Array.isArray(row.specDetails) ? row.specDetails.filter((fact: AnyRecord) => fact?.value != null && String(fact.value).trim()) : []
  const sourceFacts = Array.isArray(row.sourceFacts) && row.sourceFacts.length
    ? row.sourceFacts
    : [
        ...(asin ? [{ key: 'asin', label: 'ASIN', value: asin }] : []),
        ...(merchantUrl ? [{ key: 'source_url', label: 'Amazon.com listing', value: merchantUrl }] : []),
        ...(row.commerceCheckedAt ? [{ key: 'checked_at', label: 'Listing checked', value: row.commerceCheckedAt }] : []),
        ...specDetails
      ]
  return {
    ...row,
    id: asin || String(row.id),
    databaseId: row.databaseId ?? (/^\d+$/.test(String(row.id || '')) ? Number(row.id) : null),
    asin,
    externalId: asin,
    amazonVerified,
    sourceStatus: amazonVerified ? 'verified' : 'unavailable',
    sourceFacts,
    price,
    priceDisplay: row.priceDisplay || row.price_display || (price == null ? null : `$${price.toFixed(2)}`),
    merchantName: amazonVerified ? 'Amazon.com' : (row.merchantName || row.merchant_name || null),
    merchantUrl,
    marketplaceDomain: amazonVerified ? 'amazon.com' : (row.marketplaceDomain || row.marketplace_domain || null),
    deliveryCountryCode: amazonVerified ? 'US' : (row.deliveryCountryCode || row.delivery_country_code || null),
    img: row.img || row.image_url || null,
    imageKey: row.imageKey || row.image_key || '',
    alt: row.alt || row.alt_text || row.name,
    tags: Array.isArray(row.tags) ? row.tags : [],
    specs: Array.isArray(row.specs) ? row.specs : specDetails.map((fact: AnyRecord) => fact.value),
    specDetails,
    filterSpecs: row.filterSpecs || {},
    priceStatus: row.priceStatus || (price == null ? 'unavailable' : row.commerceCheckedAt ? 'verified' : 'stale'),
    availabilityStatus: row.availability ? 'captured' : 'not-captured',
    categorySlug: row.categorySlug || row.category_slug
  }
}
function researchRow(row: AnyRecord, kind: string) {
  const section = kind === 'Comparison' ? 'comparisons' : kind === 'Best pick' ? 'best-picks' : kind === 'Guide' ? 'guides' : 'troubleshooting'
  const category = categoryFor(row.categorySlug)
  const content = row.content && typeof row.content === 'object' ? row.content : (kind === 'Best pick' ? { ...row } : { sections: [] })
  return {
    ...row,
    type: kind,
    category: row.category || category?.name || category?.title || 'Products',
    desc: row.desc || row.excerpt || row.description || '',
    description: row.description || row.desc || row.excerpt || '',
    excerpt: row.excerpt || row.desc || row.description || '',
    readTime: row.readTime || '—',
    updated: row.updated || row.checkedAt || '—',
    checkedAt: row.checkedAt || row.updated || null,
    href: `/${section}/${row.slug}/`,
    comparisonType: kind === 'Comparison' ? (row.comparisonType || content.comparisonType || content.matchLabel || row.matchLabel || 'Direct alternative') : row.comparisonType,
    whyCompare: row.whyCompare || content.whyCompare || '',
    scope: row.scope || content.scope || '',
    controversy: row.controversy || content.controversy || '',
    decisionRule: row.decisionRule || content.decisionRule || '',
    scopeNote: row.scopeNote || row.scope || content.scope || row.whyCompare || content.whyCompare || '',
    content
  }
}
export default defineEventHandler(async (event) => {
  const db = env(event).DB
  const parts = String(event.context.params?.path || '').split('/').filter(Boolean)
  const query = getQuery(event)
  const limit = Math.min(Math.max(Number(query.limit || 100), 1), 100)
  try {
    if (parts[0] === 'categories') {
      if (parts.length > 1) { const c = categoryFor(parts[1]); if (!c) jsonError(404, 'Category not found'); if (parts[2] === 'products') return { data: (rich.products || []).filter((p: AnyRecord) => p.categorySlug === parts[1]).slice(0, limit).map(productRow) }; return { data: categoryRow(c) } }
      return { data: (rich.categories || []).map(categoryRow) }
    }
    if (parts[0] === 'products') { const items = (rich.products || []).map(productRow); if (parts[1]) { const item = items.find((p: AnyRecord) => p.slug === parts[1]); if (!item) jsonError(404, 'Product not found'); return { data: item } } return { data: items.slice(0, limit) } }
    const typeMap: Record<string, string> = { comparisons: 'Comparison', 'best-picks': 'Best pick', guides: 'Guide', troubleshooting: 'Troubleshooting' }
    if (typeMap[parts[0]]) { const kind = typeMap[parts[0]]; let items = (rich.research || []).filter((r: AnyRecord) => r.type === kind).map((r: AnyRecord) => researchRow(r, kind)); if (typeof query.category === 'string' && query.category) { const needle = String(query.category).toLowerCase(); items = items.filter((r: AnyRecord) => r.categorySlug === needle || `${r.category} ${r.categorySlug}`.toLowerCase().includes(needle.replaceAll('-', ' '))) } if (parts[1]) { const item = items.find((r: AnyRecord) => r.slug === parts[1]); if (!item) jsonError(404, 'Research item not found'); return { data: item } } return { data: items.slice(0, limit) } }
    if (parts[0] === 'home') {
      const products = (rich.products || []).length
      const categories = (rich.categories || []).length
      const comparisons = (rich.research || []).filter((r: AnyRecord) => r.type === 'Comparison')
      const bestPicks = (rich.research || []).filter((r: AnyRecord) => r.type === 'Best pick')
      const troubleshooting = (rich.research || []).filter((r: AnyRecord) => r.type === 'Troubleshooting')
      const guides = (rich.research || []).filter((r: AnyRecord) => r.type === 'Guide').length
      return {
        data: {
          hero: {
            title: 'Pet tech research you can actually verify.',
            eyebrow: 'Independent research',
            description: 'Independent research on cat and dog products across smart home, feeding, hydration, litter, grooming, waste cleanup, walking, and safety with dated sources and clear commercial disclosures.'
          },
          categories: (rich.categories || []).map(categoryRow),
          comparisons: comparisons.slice(0, 3).map((r: AnyRecord) => researchRow(r, 'Comparison')),
          bestPicks: bestPicks.slice(0, 8).map((r: AnyRecord) => researchRow(r, 'Best pick')),
          troubleshooting: troubleshooting.slice(0, 3).map((r: AnyRecord) => researchRow(r, 'Troubleshooting')),
          methodology: [
            { body: 'Every research decision records the criteria, sources, and date.', icon: '🔬', title: 'Documented methods' },
            { body: 'Pages show a last-checked date and review schedule.', icon: '📅', title: 'Dated and updated' },
            { body: 'Readers can submit corrections for verification.', icon: '💬', title: 'Error correction' },
            { body: 'Every verdict explains who a product suits, the trade-offs that matter, and what to check before buying.', icon: '🎯', title: 'Practical conclusions' }
          ],
          stats: { productsResearched: products, productCategories: categories, comparisonsPublished: comparisons.length, guidesPublished: guides },
          productsResearched: products, productCategories: categories, comparisonsPublished: comparisons.length, guidesPublished: guides
        }
      }
    }
    if (parts[0] === 'pages') {
      const slug = parts[1] || ''
      if (hasDb(db)) {
        try {
          const row = await db.prepare('SELECT slug,title,description,content_json,updated_at FROM content_pages WHERE slug = ?').bind(slug).first<any>()
          if (row) return { data: { ...row, content: row.content_json ? JSON.parse(row.content_json) : {} } }
        } catch {
          // Older D1 databases may not have content_pages. The bundled copy is
          // the canonical fallback and keeps public page APIs healthy.
        }
      }
      const page = rich.pages?.[slug]
      if (page) return { data: page }
      jsonError(404, 'Page not found')
    }
    return { data: null }
  } catch (error: any) { if (error?.statusCode) throw error; jsonError(500, 'Content query failed') }
})
