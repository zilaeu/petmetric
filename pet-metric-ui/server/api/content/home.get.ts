export default defineEventHandler(async (event) => {
  const db = getRuntimeEnv(event).DB
  if (!hasBinding(db)) return { source: 'unavailable', categories: [], researchItems: [], trustStats: [] }
  try {
    const [cats, items] = await Promise.all([
      db.prepare('SELECT slug, name, description, icon, product_count AS count, updated_at FROM categories ORDER BY rowid').all(),
      db.prepare('SELECT slug, title, excerpt, type, category, read_time AS readTime, checked_at AS checkedAt, image_key AS imageKey, accent FROM research_items ORDER BY id DESC LIMIT 6').all()
    ])
    return { source: 'd1', categories: cats.results || [], researchItems: items.results || [], trustStats: [] }
  } catch {
    return { source: 'unavailable', categories: [], researchItems: [], trustStats: [] }
  }
})
