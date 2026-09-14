type AnyRecord = Record<string, any>

const categoryMeta: Record<string, AnyRecord> = {
  'automatic-litter-boxes': { eyebrow: 'Product database', subtitle: 'Automatic litter boxes compared on fit, cleaning workflow, safety, and ongoing cost.', criteria: ['Cat entry and weight fit', 'Litter compatibility', 'Safety sensors and cleaning workflow', 'Consumables and app costs'] },
  'smart-pet-feeders': { eyebrow: 'Product database', subtitle: 'Smart feeders compared on portion accuracy, food compatibility, connectivity, and backup power.', criteria: ['Portion repeatability', 'Food and kibble compatibility', 'Jam recovery and cleaning', 'Schedule storage and backup power'] },
  'gps-pet-trackers': { eyebrow: 'Product database', subtitle: 'GPS trackers compared on coverage, alert speed, battery, fit, and subscription terms.', criteria: ['Network coverage', 'Live refresh and escape alerts', 'Battery and charging', 'Collar fit and membership cost'] },
  'pet-cameras': { eyebrow: 'Product database', subtitle: 'Pet cameras compared on useful alerts, two-way audio, privacy, and recurring fees.', criteria: ['Field of view and night vision', 'Alert quality', 'Local versus cloud storage', 'Subscription and privacy controls'] }
}

function env(event: any) { return event.context.cloudflare?.env || {} }
function hasDb(db: any): db is D1Database { return Boolean(db && typeof db.prepare === 'function') }
function jsonError(status: number, message: string) { throw createError({ statusCode: status, statusMessage: message }) }
function productRow(row: AnyRecord) {
  return { ...row, categorySlug: row.categorySlug || row.category_slug, price: row.priceCents == null ? null : Number(row.priceCents) / 100, priceDisplay: row.priceCents == null ? null : `$${(Number(row.priceCents) / 100).toFixed(2)}`, score: row.score == null ? null : Number(row.score), updated: row.updatedAt || row.updated_at, bestFor: row.bestFor || row.best_for, merchantName: 'Amazon.com', merchantUrl: null, img: null, imageKey: '', tags: [], specs: [] }
}

export default defineEventHandler(async (event) => {
  const db = env(event).DB
  if (!hasDb(db)) jsonError(503, 'Database binding unavailable')
  const parts = String(event.context.params?.path || '').split('/').filter(Boolean)
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit || 100), 100)
  try {
    if (parts[0] === 'categories') {
      if (parts.length === 1) {
        const result = await db.prepare('SELECT slug,name,description,icon,product_count AS productCount,updated_at AS updatedAt FROM categories ORDER BY name').all()
        return { data: (result.results || []).map((c: any) => ({ ...c, title: c.name, shortName: c.name, count: c.productCount, ...categoryMeta[c.slug] })) }
      }
      const slug = parts[1]
      const category = await db.prepare('SELECT slug,name,description,icon,product_count AS productCount,updated_at AS updatedAt FROM categories WHERE slug = ?').bind(slug).first()
      if (!category) jsonError(404, 'Category not found')
      if (parts[2] === 'products') {
        const rows = await db.prepare('SELECT slug,category_slug AS categorySlug,name,brand,price_cents AS priceCents,subscription,score,verdict,best_for AS bestFor,updated_at AS updatedAt FROM products WHERE category_slug = ? ORDER BY score DESC LIMIT ?').bind(slug, limit).all()
        return { data: (rows.results || []).map(productRow) }
      }
      const c: any = category
      return { data: { ...c, title: c.name, shortName: c.name, count: c.productCount, reviewedCount: 0, comparisons: 0, ...categoryMeta[slug] } }
    }
    if (parts[0] === 'products') {
      const base = 'SELECT slug,category_slug AS categorySlug,name,brand,price_cents AS priceCents,subscription,score,verdict,best_for AS bestFor,updated_at AS updatedAt FROM products'
      const rows = parts[1] ? await db.prepare(`${base} WHERE slug = ?`).bind(parts[1]).all() : await db.prepare(`${base} ORDER BY score DESC LIMIT ?`).bind(limit).all()
      if (parts[1] && !rows.results?.length) jsonError(404, 'Product not found')
      return { data: parts[1] ? productRow(rows.results[0]) : (rows.results || []).map(productRow) }
    }
    if (['comparisons', 'best-picks', 'troubleshooting', 'guides'].includes(parts[0])) {
      const typeMap: Record<string, string> = { comparisons: 'Comparison', 'best-picks': 'Best pick', troubleshooting: 'Troubleshooting', guides: 'Guide' }
      const type = typeMap[parts[0]]
      let sql = 'SELECT slug,title,excerpt,type,category,read_time AS readTime,checked_at AS checkedAt,accent FROM research_items WHERE type = ?'
      const values: any[] = [type]
      if (typeof query.category === 'string' && query.category) { sql += ' AND lower(replace(category, \' \', \'-\')) LIKE ?'; values.push(`%${String(query.category).toLowerCase()}%`) }
      sql += ' ORDER BY checkedAt DESC LIMIT ?'; values.push(limit)
      const rows = await db.prepare(sql).bind(...values).all()
      const items = (rows.results || []).map((r: any) => ({ ...r, categorySlug: String(r.category || '').toLowerCase().replaceAll(' ', '-'), desc: r.excerpt, readTime: r.readTime, updated: r.checkedAt, href: `/${parts[0]}/${r.slug}/`, content: { sections: [] }, alternatives: [] }))
      if (parts[1]) {
        const item = items.find((x: any) => x.slug === parts[1])
        if (!item) jsonError(404, 'Research item not found')
        return { data: item }
      }
      return { data: items }
    }
    if (parts[0] === 'home') {
      const [categories, products, research] = await Promise.all([
        db.prepare('SELECT slug,name,description,product_count AS productCount,updated_at AS updatedAt FROM categories ORDER BY name').all(),
        db.prepare('SELECT COUNT(*) AS count FROM products').first<any>(),
        db.prepare('SELECT COUNT(*) AS count FROM research_items WHERE type = \'Comparison\'').first<any>()
      ])
      return { data: { categories: categories.results || [], stats: { productsResearched: String(products?.count || 0), productCategories: String((categories.results || []).length), comparisonsPublished: String(research?.count || 0), guidesPublished: '0' }, productsResearched: String(products?.count || 0), productCategories: String((categories.results || []).length), comparisonsPublished: String(research?.count || 0), guidesPublished: '0' } }
    }
    return { data: null }
  } catch (error: any) {
    if (error?.statusCode) throw error
    jsonError(500, 'Content query failed')
  }
})
