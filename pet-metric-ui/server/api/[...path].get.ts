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
function productRow(row: AnyRecord) {
  const price = row.price == null ? null : Number(row.price)
  return { ...row, id: String(row.id), price, priceDisplay: row.priceDisplay || (price == null ? null : `$${price.toFixed(2)}`), merchantName: row.merchantName || 'Amazon.com', merchantUrl: row.merchantUrl || null, img: row.img || null, imageKey: row.imageKey || '', alt: row.alt || row.name, tags: Array.isArray(row.tags) ? row.tags : [], specs: Array.isArray(row.specs) ? row.specs : [], specDetails: Array.isArray(row.specDetails) ? row.specDetails : [], filterSpecs: row.filterSpecs || {}, priceStatus: row.priceStatus || (price == null ? 'unavailable' : row.commerceCheckedAt ? 'verified' : 'stale'), categorySlug: row.categorySlug || row.category_slug }
}
function researchRow(row: AnyRecord, kind: string) {
  const section = kind === 'Comparison' ? 'comparisons' : kind === 'Best pick' ? 'best-picks' : kind === 'Guide' ? 'guides' : 'troubleshooting'
  const category = categoryFor(row.categorySlug)
  return { ...row, type: kind, category: row.category || category?.name || 'Products', desc: row.desc || row.excerpt || row.description || '', excerpt: row.excerpt || row.desc || row.description || '', readTime: row.readTime || '—', updated: row.updated || row.checkedAt || '—', checkedAt: row.checkedAt || row.updated || null, href: `/${section}/${row.slug}/`, content: row.content || (kind === 'Best pick' ? { ...row } : { sections: [] }) }
}
export default defineEventHandler(async (event) => {
  const db = env(event).DB
  const parts = String(event.context.params?.path || '').split('/').filter(Boolean)
  const query = getQuery(event)
  const limit = Math.min(Math.max(Number(query.limit || 100), 1), 100)
  try {
    if (parts[0] === 'categories') {
      if (parts.length > 1) { const c = categoryFor(parts[1]); if (!c) jsonError(404, 'Category not found'); const count = (rich.products || []).filter((p: AnyRecord) => p.categorySlug === parts[1]).length; if (parts[2] === 'products') return { data: (rich.products || []).filter((p: AnyRecord) => p.categorySlug === parts[1]).slice(0, limit).map(productRow) }; return { data: { ...c, ...categoryMeta[parts[1]], title: c.title || c.name, shortName: c.shortName || c.title || c.name, count, productCount: count } } }
      return { data: (rich.categories || []).map((c: AnyRecord) => { const count = (rich.products || []).filter((p: AnyRecord) => p.categorySlug === c.slug).length; return { ...c, ...categoryMeta[c.slug], title: c.title || c.name, shortName: c.shortName || c.title || c.name, count, productCount: count } }) }
    }
    if (parts[0] === 'products') { const items = (rich.products || []).map(productRow); if (parts[1]) { const item = items.find((p: AnyRecord) => p.slug === parts[1]); if (!item) jsonError(404, 'Product not found'); return { data: item } } return { data: items.slice(0, limit) } }
    const typeMap: Record<string, string> = { comparisons: 'Comparison', 'best-picks': 'Best pick', guides: 'Guide', troubleshooting: 'Troubleshooting' }
    if (typeMap[parts[0]]) { const kind = typeMap[parts[0]]; let items = (rich.research || []).filter((r: AnyRecord) => r.type === kind).map((r: AnyRecord) => researchRow(r, kind)); if (typeof query.category === 'string' && query.category) { const needle = String(query.category).toLowerCase(); items = items.filter((r: AnyRecord) => r.categorySlug === needle || `${r.category} ${r.categorySlug}`.toLowerCase().includes(needle.replaceAll('-', ' '))) } if (parts[1]) { const item = items.find((r: AnyRecord) => r.slug === parts[1]); if (!item) jsonError(404, 'Research item not found'); return { data: item } } return { data: items.slice(0, limit) } }
    if (parts[0] === 'home') { const products = (rich.products || []).length; const categories = (rich.categories || []).length; const comparisons = (rich.research || []).filter((r: AnyRecord) => r.type === 'Comparison').length; const guides = (rich.research || []).filter((r: AnyRecord) => r.type === 'Guide').length; return { data: { categories: rich.categories || [], stats: { productsResearched: String(products), productCategories: String(categories), comparisonsPublished: String(comparisons), guidesPublished: String(guides) }, productsResearched: String(products), productCategories: String(categories), comparisonsPublished: String(comparisons), guidesPublished: String(guides) } } }
    if (parts[0] === 'pages' && hasDb(db)) { const row = await db.prepare('SELECT slug,title,content_json FROM content_pages WHERE slug = ?').bind(parts[1] || '').first<any>(); if (row) return { data: { ...row, content: row.content_json ? JSON.parse(row.content_json) : {} } } }
    return { data: null }
  } catch (error: any) { if (error?.statusCode) throw error; jsonError(500, 'Content query failed') }
})
