import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise'

type DbRow = RowDataPacket & Record<string, unknown>
type ResourceConfig = {
  table: string
  title: string
  labelColumn: string
  search: string[]
  columns: string[]
  json?: string[]
  boolean?: string[]
  order?: string
}

const resources: Record<string, ResourceConfig> = {
  categories: { table: 'categories', title: 'Categories', labelColumn: 'title', search: ['title', 'slug'], columns: ['slug','title','eyebrow','description','subtitle','image_url','image_key','alt_text','updated_label','sort_order','is_published'], boolean: ['is_published'], order: 'sort_order, id' },
  'category-criteria': { table: 'category_criteria', title: 'Category Criteria', labelColumn: 'title', search: ['title','description'], columns: ['category_id','title','description','icon','sort_order'], order: 'category_id, sort_order, id' },
  products: { table: 'products', title: 'Products', labelColumn: 'name', search: ['name','brand','slug'], columns: ['category_id','slug','name','brand','price','price_display','subscription','score','amazon_rating','amazon_review_count','amazon_availability','commerce_checked_at','verdict','best_for','image_url','image_key','alt_text','merchant_name','merchant_url','marketplace_domain','delivery_country_code','updated_label','rank_order','is_featured','is_published'], boolean: ['is_featured','is_published'], order: 'rank_order, id' },
  'product-specs': { table: 'product_specs', title: 'Product Specs', labelColumn: 'label', search: ['label','value','spec_key'], columns: ['product_id','spec_key','label','value','sort_order'], order: 'product_id, sort_order, id' },
  reviews: { table: 'product_reviews', title: 'Reviews', labelColumn: 'summary', search: ['summary'], columns: ['product_id','summary','gallery_json','quick_specs_json','strengths_json','limitations_json','sections_json','research_date','price_checked_date','next_review_label','source_count','is_published'], json: ['gallery_json','quick_specs_json','strengths_json','limitations_json','sections_json'], boolean: ['is_published'], order: 'id DESC' },
  comparisons: { table: 'comparisons', title: 'Comparisons', labelColumn: 'slug', search: ['slug','product_a_name','product_b_name'], columns: ['slug','category_id','product_a_id','product_b_id','product_a_name','product_b_name','verdict','home_verdict','views_count','read_time','updated_label','content_json','sort_order','is_featured','is_published'], json: ['content_json'], boolean: ['is_featured','is_published'], order: 'sort_order, id' },
  'comparison-audiences': { table: 'comparison_best_for', title: 'Comparison Audiences', labelColumn: 'pick_name', search: ['pick_name','audience'], columns: ['comparison_id','pick_name','audience','sort_order'], order: 'comparison_id, sort_order, id' },
  'comparison-criteria': { table: 'comparison_criteria', title: 'Comparison Criteria', labelColumn: 'label', search: ['label','product_a_value','product_b_value'], columns: ['comparison_id','label','product_a_value','product_b_value','winner','sort_order'], order: 'comparison_id, sort_order, id' },
  'comparison-metrics': { table: 'comparison_metric_definitions', title: 'Category Comparison Metrics', labelColumn: 'label', search: ['label','metric_key','help_text'], columns: ['category_id','metric_key','label','help_text','comparison_rule','sort_order','is_published'], boolean: ['is_published'], order: 'category_id, sort_order, id' },
  'product-metric-values': { table: 'product_metric_values', title: 'Product Metric Values', labelColumn: 'display_value', search: ['display_value'], columns: ['product_id','metric_definition_id','display_value','numeric_value','source_url','marketplace_domain','delivery_country_code','checked_at','confidence','evidence_status'], order: 'product_id, metric_definition_id, id' },
  'best-picks': { table: 'best_picks', title: 'Best Picks', labelColumn: 'title', search: ['title','pick_name','slug'], columns: ['slug','category_id','category_label','title','pick_product_id','pick_name','budget','tradeoff','image_url','image_key','content_json','sort_order','is_published'], json: ['content_json'], boolean: ['is_published'], order: 'sort_order, id' },
  guides: { table: 'guides', title: 'Guides', labelColumn: 'title', search: ['title','description','slug'], columns: ['slug','category_id','category_label','title','description','read_time','updated_label','image_url','image_key','content_json','sort_order','is_published'], json: ['content_json'], boolean: ['is_published'], order: 'sort_order, id' },
  troubleshooting: { table: 'troubleshooting_guides', title: 'Troubleshooting', labelColumn: 'title', search: ['title','product_name','problem','slug'], columns: ['slug','category_id','product_id','product_name','problem','title','description','difficulty','estimated_time','views_count','updated_label','content_json','sort_order','is_published'], json: ['content_json'], boolean: ['is_published'], order: 'sort_order, id' },
  'troubleshooting-steps': { table: 'troubleshooting_steps', title: 'Troubleshooting Steps', labelColumn: 'instruction', search: ['instruction'], columns: ['guide_id','instruction','sort_order'], order: 'guide_id, sort_order, id' },
  pages: { table: 'content_pages', title: 'Pages', labelColumn: 'title', search: ['title','slug'], columns: ['slug','title','description','content_json','is_published'], json: ['content_json'], boolean: ['is_published'], order: 'id' },
  settings: { table: 'site_settings', title: 'Settings', labelColumn: 'setting_key', search: ['setting_key'], columns: ['setting_key','setting_value'], json: ['setting_value'], order: 'setting_key' }
}

export type AdminResource = keyof typeof resources

function configFor(resource: string): ResourceConfig {
  const config = resources[resource as AdminResource]
  if (!config) throw new Error('Unknown admin resource')
  return config
}

function parseRows(rows: DbRow[], config: ResourceConfig) {
  return rows.map((row) => {
    const item = { ...row }
    for (const key of config.json ?? []) {
      if (typeof item[key] === 'string') {
        try { item[key] = JSON.parse(item[key] as string) } catch { item[key] = null }
      }
    }
    for (const key of config.boolean ?? []) item[key] = Boolean(item[key])
    return item
  })
}

function valuesFor(payload: Record<string, unknown>, config: ResourceConfig) {
  const columns = config.columns.filter((column) => Object.prototype.hasOwnProperty.call(payload, column))
  const values = columns.map((column) => {
    const value = payload[column]
    if (config.json?.includes(column)) return value == null || value === '' ? null : JSON.stringify(value)
    if (config.boolean?.includes(column)) return value ? 1 : 0
    return value === '' ? null : value
  })
  return { columns, values }
}

function applyCommerceScope(resource: string, payload: Record<string, unknown>) {
  if (resource !== 'products' && resource !== 'product-metric-values') return payload
  const next = { ...payload }
  const sourceField = resource === 'products' ? 'merchant_url' : 'source_url'
  const sourceUrl = String(next[sourceField] ?? '')
  if (/amazon\./i.test(sourceUrl) && !/^https:\/\/(?:www\.)?amazon\.com\/dp\/B[A-Z0-9]{9}(?:[/?#]|$)/i.test(sourceUrl)) {
    throw new Error('Amazon sources must use an Amazon.com US product-detail URL')
  }
  if (sourceUrl.includes('amazon.com/')) {
    next.marketplace_domain = 'amazon.com'
    next.delivery_country_code = 'US'
    if (resource === 'products') next.merchant_name = 'Amazon.com'
  }
  return next
}

export class AdminRepository {
  constructor(private readonly db: Pool) {}

  getResources() {
    return Object.entries(resources).map(([key, value]) => ({ key, title: value.title, columns: value.columns, json: value.json ?? [], boolean: value.boolean ?? [] }))
  }

  async overview() {
    const entries = await Promise.all(Object.entries(resources).map(async ([key, config]) => {
      const [rows] = await this.db.query<DbRow[]>(`SELECT COUNT(*) total FROM ${config.table}`)
      return [key, Number(rows[0]?.total ?? 0)] as const
    }))
    const [recent] = await this.db.query<DbRow[]>(`SELECT 'product' type, id, name title, updated_at FROM products UNION ALL SELECT 'page', id, title, updated_at FROM content_pages ORDER BY updated_at DESC LIMIT 8`)
    return { counts: Object.fromEntries(entries), recent }
  }

  async options() {
    const [categories, products, comparisons, troubleshooting, comparisonMetrics] = await Promise.all([
      this.db.query<DbRow[]>('SELECT id, title label, slug FROM categories ORDER BY sort_order, id'),
      this.db.query<DbRow[]>('SELECT id, name label, slug, category_id FROM products ORDER BY name'),
      this.db.query<DbRow[]>(`SELECT id, CONCAT(product_a_name, ' vs ', product_b_name) label, slug FROM comparisons ORDER BY sort_order, id`),
      this.db.query<DbRow[]>('SELECT id, title label, slug FROM troubleshooting_guides ORDER BY sort_order, id'),
      this.db.query<DbRow[]>(`SELECT m.id, CONCAT(c.title, ' · ', m.label) label, m.category_id FROM comparison_metric_definitions m JOIN categories c ON c.id=m.category_id ORDER BY c.sort_order, m.sort_order, m.id`)
    ])
    return { categories: categories[0], products: products[0], comparisons: comparisons[0], troubleshooting: troubleshooting[0], comparisonMetrics: comparisonMetrics[0] }
  }

  async list(resource: string, search = '') {
    const config = configFor(resource)
    const params: unknown[] = []
    let where = ''
    if (search && config.search.length) {
      where = ` WHERE ${config.search.map((column) => `${column} LIKE ?`).join(' OR ')}`
      params.push(...config.search.map(() => `%${search}%`))
    }
    const [rows] = await this.db.query<DbRow[]>(`SELECT * FROM ${config.table}${where} ORDER BY ${config.order ?? 'id DESC'} LIMIT 500`, params)
    return parseRows(rows, config)
  }

  async create(resource: string, payload: Record<string, unknown>) {
    const config = configFor(resource)
    const { columns, values } = valuesFor(applyCommerceScope(resource, payload), config)
    if (!columns.length) throw new Error('No editable fields supplied')
    const [result] = await this.db.execute<ResultSetHeader>(`INSERT INTO ${config.table} (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`, values as any[])
    return { id: result.insertId || payload.setting_key }
  }

  async update(resource: string, id: string, payload: Record<string, unknown>) {
    const config = configFor(resource)
    const { columns, values } = valuesFor(applyCommerceScope(resource, payload), config)
    if (!columns.length) throw new Error('No editable fields supplied')
    const key = resource === 'settings' ? 'setting_key' : 'id'
    await this.db.execute(`UPDATE ${config.table} SET ${columns.map((column) => `${column}=?`).join(',')} WHERE ${key}=?`, [...values, id] as any[])
    return { id }
  }

  async archive(resource: string, id: string) {
    const config = configFor(resource)
    if (!config.columns.includes('is_published')) throw new Error('This resource cannot be archived')
    await this.db.execute(`UPDATE ${config.table} SET is_published=FALSE WHERE id=?`, [id])
    // A product is the source of truth for every public product reference.
    // Archive dependent editorial rows at the same time so a stale product
    // can never remain visible through comparisons, picks, troubleshooting,
    // or its review page.
    if (resource === 'products') {
      await this.db.execute(
        `UPDATE comparisons SET is_published=FALSE
         WHERE product_a_id=? OR product_b_id=?`, [id, id]
      )
      await this.db.execute(
        `UPDATE best_picks SET is_published=FALSE WHERE pick_product_id=?`, [id]
      )
      await this.db.execute(
        `UPDATE troubleshooting_guides SET is_published=FALSE WHERE product_id=?`, [id]
      )
      await this.db.execute(
        `UPDATE product_reviews SET is_published=FALSE WHERE product_id=?`, [id]
      )
    }
    return { id, archived: true }
  }
}
