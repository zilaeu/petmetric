export default defineEventHandler(async (event) => {
  const env = getRuntimeEnv(event)
  const db = env.DB
  const query = getQuery(event)
  const category = typeof query.category === 'string' ? query.category : null
  const search = typeof query.q === 'string' ? query.q.trim() : ''
  if (!hasBinding(db)) return { source: 'unavailable', categories: [], products: [] }
  try {
    const where: string[] = []
    const values: string[] = []
    if (category) { where.push('category_slug = ?'); values.push(category) }
    if (search) { where.push('(name LIKE ? OR brand LIKE ? OR best_for LIKE ?)'); values.push(`%${search}%`, `%${search}%`, `%${search}%`) }
    const sql = `SELECT slug, category_slug AS categorySlug, name, brand, price_cents AS priceCents, subscription, score, verdict, best_for AS bestFor, updated_at AS updatedAt FROM products ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY score DESC`
    const result = await db.prepare(sql).bind(...values).all()
    return { source: 'd1', products: result.results || [] }
  } catch {
    return { source: 'unavailable', products: [] }
  }
})
