import type { Pool, RowDataPacket } from 'mysql2/promise'
import type { ListQuery } from '../lib/query.js'
import { parseJson } from '../lib/query.js'

type DbRow = RowDataPacket & Record<string, unknown>
type ListResult<T> = { items: T[]; total: number }
type EvidenceStatus = 'explicit' | 'claim' | 'unclear' | 'unsupported' | 'conflict'

function idsPlaceholder(ids: number[]) {
  return ids.map(() => '?').join(',')
}

function isoDate(value: unknown) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(String(value))
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10)
}

function amazonUsUrl(externalId: unknown, fallback: unknown = null) {
  const asin = String(externalId ?? '').trim()
  return /^B[A-Z0-9]{9}$/.test(asin) ? `https://www.amazon.com/dp/${asin}` : (fallback ? String(fallback) : null)
}

function categoryDto(row: DbRow) {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    eyebrow: String(row.eyebrow),
    description: String(row.description),
    subtitle: String(row.subtitle),
    count: Number(row.product_count),
    reviewedCount: Number(row.reviewed_count ?? 0),
    comparisons: String(row.comparison_count),
    priceRange: row.price_range,
    topPick: row.top_pick,
    score: row.top_score === null ? null : Number(row.top_score),
    img: row.image_url,
    imageKey: row.image_key,
    alt: row.alt_text,
    updated: String(row.computed_updated ?? row.updated_label ?? ''),
    criteria: [] as Array<{ title: string; description: string; icon: string | null }>
  }
}

function productDto(row: DbRow) {
  const externalId = row.external_id === null ? null : String(row.external_id)
  const amazonUsListing = amazonUsUrl(externalId, row.merchant_url)
  const amazonVerified = Boolean(externalId?.match(/^B[A-Z0-9]{9}$/)) && Boolean(amazonUsListing?.includes('amazon.com/dp/'))
  // Older imports stored source facts as an object while the current DTO uses
  // a normalized label/value array. Accept both shapes so one malformed row
  // cannot take down an entire category or product endpoint.
  const rawSourceFacts = parseJson<unknown>(row.source_facts_json, [])
  const sourceFacts: Array<{ label: string; value: string }> = Array.isArray(rawSourceFacts)
    ? rawSourceFacts.map((fact: any) => ({ label: String(fact?.label ?? ''), value: String(fact?.value ?? '') }))
    : rawSourceFacts && typeof rawSourceFacts === 'object'
      ? Object.entries(rawSourceFacts as Record<string, unknown>).map(([label, value]) => ({ label, value: String(value ?? '') }))
      : []
  const sourceFactDetails: Array<{ key: string | null; label: string | null; value: string }> = sourceFacts.map((fact) => ({ key: null, label: fact.label, value: fact.value }))
  return {
    id: externalId ?? String(row.id),
    databaseId: Number(row.id),
    categorySlug: String(row.category_slug),
    name: String(row.name),
    brand: String(row.brand),
    slug: String(row.slug),
    price: row.price === null ? null : Number(row.price),
    priceDisplay: row.price_display,
    priceStatus: row.price === null ? 'unavailable' : (row.commerce_checked_at ? 'verified' : 'stale'),
    subscription: row.subscription,
    score: row.score === null ? null : Number(row.score),
    amazonRating: row.amazon_rating === null ? null : Number(row.amazon_rating),
    amazonReviewCount: row.amazon_review_count === null ? null : Number(row.amazon_review_count),
    availability: row.amazon_availability,
    commerceCheckedAt: row.commerce_checked_at,
    sourceStatus: amazonVerified ? 'verified' : 'unavailable',
    verdict: String(row.verdict),
    bestFor: String(row.best_for),
    img: row.image_url,
    imageKey: row.image_key,
    alt: row.alt_text,
    merchantName: amazonVerified ? 'Amazon.com' : row.merchant_name,
    merchantUrl: amazonVerified ? amazonUsListing : row.merchant_url,
    marketplaceDomain: amazonVerified ? 'amazon.com' : null,
    deliveryCountryCode: amazonVerified ? 'US' : null,
    updated: String(row.updated_label),
    rank: Number(row.rank_order),
    featured: Boolean(row.is_featured),
    amazonVerified,
    sourceFacts,
    tags: [] as string[],
    specs: sourceFacts.map((fact) => fact.value),
    specDetails: sourceFactDetails,
    filterSpecs: {} as Record<string, string>
  }
}

function comparisonDto(row: DbRow) {
  const content = parseJson<Record<string, unknown>>(row.content_json, {})
  const comparisonType = String(content.comparisonType ?? content.matchLabel ?? 'Direct alternative')
  const whyCompare = String(content.whyCompare ?? '')
  const scope = String(content.scope ?? '')
  const controversy = String(content.controversy ?? '')
  const decisionRule = String(content.decisionRule ?? '')
  return {
    id: Number(row.id),
    categoryId: Number(row.category_id),
    slug: String(row.slug),
    category: String(row.category_title),
    categorySlug: String(row.category_slug),
    a: String(row.product_a_name),
    b: String(row.product_b_name),
    productAId: row.product_a_id === null ? null : Number(row.product_a_id),
    productBId: row.product_b_id === null ? null : Number(row.product_b_id),
    verdict: String(row.verdict),
    homeVerdict: row.home_verdict,
    views: Number(row.views_count).toLocaleString('en-US'),
    viewsCount: Number(row.views_count),
    readTime: row.read_time,
    updated: String(row.updated_label),
    href: `/comparisons/${String(row.slug)}/`,
    featured: Boolean(row.is_featured),
    decisionQuestion: String(content.decisionQuestion ?? 'Which product better fits your pet, household, and ownership priorities?'),
    comparisonType,
    matchType: content.matchType ? String(content.matchType) : null,
    matchLabel: content.matchLabel ? String(content.matchLabel) : comparisonType,
    whyCompare,
    scope,
    controversy,
    decisionRule,
    bestFor: [] as Array<{ pick: string; who: string }>,
    listingFacts: [] as Array<{ label: string; aVal: string; bVal: string; aStatus: EvidenceStatus; bStatus: EvidenceStatus; aSourceUrl?: string | null; bSourceUrl?: string | null }>,
    productAttributes: [] as Array<{ key: string; label: string; aVal: string; bVal: string; aStatus: EvidenceStatus; bStatus: EvidenceStatus; aSourceUrl?: string | null; bSourceUrl?: string | null; note?: string }>,
    criteria: [] as Array<{ group?: string; label: string; aVal: string; bVal: string; aStatus?: EvidenceStatus; bStatus?: EvidenceStatus; aSourceUrl?: string | null; bSourceUrl?: string | null; winner: 'a' | 'b' | 'tie' | 'unknown'; edgeLabel: string; helpText?: string }>,
    checkedAt: null as string | null,
    evidenceConfidence: 'Limited' as 'Limited' | 'Moderate',
    marketplace: 'Amazon.com',
    deliveryCountry: 'United States',
    currency: 'USD',
    scopeNote: scope || whyCompare || 'Amazon.com listing facts checked with delivery set to the United States. Product fit, safety, reliability, and long-term ownership have not yet been independently verified.',
    decisionGaps: [] as string[],
    products: [] as Array<{ side: 'a' | 'b'; name: string; brand: string; asin: string | null; variant: string; img: unknown; merchantUrl: unknown; structure: string; dimensions: string; weight: string; capacity: string }>,
    userReviewSummaries: [] as Array<{ side: 'a' | 'b'; productName: string; rating: number | null; reviewCount: number | null; visibleReviewCount: number; sampleMethod: string | null; sampleTargetCount: number | null; sampleNewestReviewAt: string | null; sampleOldestReviewAt: string | null; checkedAt: string | null; sourceName: string; sourceUrl: string; ratingDistribution: Record<string, number>; summary: string; positives: string[]; concerns: string[]; themes: Array<{ label: string; mentions: number; kind: 'positive' | 'mixed' | 'concern'; detail: string }>; sampleNote: string }>,
    userFeedback: { status: 'not_researched', summary: 'User feedback has not yet been systematically coded by core function. Amazon ratings are shown separately and are not treated as functional evidence.', sampleLimit: 'No review-level sample has been verified for this comparison.' },
    researchConclusion: { coreFunctionLeader: 'Not established from the currently verified evidence.', practicalChoice: 'No overall practical choice has been verified.', developerLessons: [] as string[], marketOpportunities: [] as string[] },
    content
  }
}

function bestPickDto(row: DbRow) {
  const linkedAmazonProduct = Boolean(String(row.product_external_id ?? '').match(/^B[A-Z0-9]{9}$/))
  const amazonUrl = linkedAmazonProduct ? amazonUsUrl(row.product_external_id, row.product_merchant_url) : null
  const reviewCount = row.product_amazon_review_count === null ? null : Number(row.product_amazon_review_count)
  const authoredContent = parseJson<Record<string, unknown>>(row.content_json, {})
  // Keep the editorial scenario guidance intact. Marketplace verification is
  // supporting context, not a replacement for the reasons this pick exists.
  const verifiedContent = linkedAmazonProduct ? {
    ...authoredContent,
    evidenceNote: `${String(row.pick_name)} is linked to the checked Amazon listing${isoDate(row.product_commerce_checked_at) ? ` (checked ${isoDate(row.product_commerce_checked_at)})` : ''}. Confirm current fit, price, stock, seller, and regional compatibility before buying.`,
    why: authoredContent.why || String(row.tradeoff),
    notFor: authoredContent.notFor || 'Choose another option if the live listing does not meet your household requirements or budget.'
  } : authoredContent
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    category: String(row.category_label),
    categorySlug: String(row.category_slug),
    pick: String(row.pick_name),
    productSlug: row.product_slug,
    budget: linkedAmazonProduct ? String(row.product_price_display ?? 'See current price on Amazon') : String(row.budget),
    tradeoff: linkedAmazonProduct
      ? `Amazon rating: ${row.product_amazon_rating === null ? 'not available' : `${Number(row.product_amazon_rating).toFixed(1)} / 5${reviewCount === null ? ' (review count not captured)' : ` (${reviewCount.toLocaleString('en-US')} reviews)`}`}. Availability: ${String(row.product_amazon_availability ?? 'check listing')}.`
      : String(row.tradeoff),
    img: row.image_url,
    imageKey: linkedAmazonProduct ? null : row.image_key,
    updated: row.updated_at instanceof Date
      ? row.updated_at.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
      : String(row.updated_at ?? ''),
    href: `/best-picks/${String(row.slug)}/`,
    product: linkedAmazonProduct ? {
      asin: String(row.product_external_id),
      slug: row.product_slug === null ? null : String(row.product_slug),
      brand: row.product_brand === null ? null : String(row.product_brand),
      merchantUrl: amazonUrl,
      rating: row.product_amazon_rating === null ? null : Number(row.product_amazon_rating),
      reviewCount,
      availability: row.product_amazon_availability === null ? null : String(row.product_amazon_availability),
      priceDisplay: String(row.product_price_display ?? 'See current price on Amazon'),
      priceStatus: row.product_price === null ? 'unavailable' : (row.product_commerce_checked_at ? 'verified' : 'stale'),
      sourceStatus: 'verified',
      verdict: row.product_verdict === null ? null : String(row.product_verdict),
      bestFor: row.product_best_for === null ? null : String(row.product_best_for),
      commerceCheckedAt: isoDate(row.product_commerce_checked_at),
      amazonVerified: true
    } : null,
    content: verifiedContent
  }
}

function guideDto(row: DbRow) {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    category: String(row.category_label),
    categorySlug: String(row.category_slug),
    title: String(row.title),
    desc: String(row.description),
    readTime: String(row.read_time),
    updated: String(row.updated_label),
    img: row.image_url,
    imageKey: row.image_key,
    href: `/guides/${String(row.slug)}/`,
    content: parseJson(row.content_json, {})
  }
}

function troubleDto(row: DbRow) {
  const content = parseJson<Record<string, unknown>>(row.content_json, {})
  const productAsin = String(row.product_external_id ?? '')
  const productUrl = amazonUsUrl(productAsin, row.product_merchant_url)
  if ((!Array.isArray(content.sources) || content.sources.length === 0) && productUrl) {
    content.sources = [{ label: `${String(row.product_name)} — checked Amazon.com listing`, url: productUrl }]
  }
  return {
    id: Number(row.id),
    slug: String(row.slug),
    product: String(row.product_name),
    productSlug: row.product_slug,
    problem: String(row.problem),
    title: String(row.title),
    description: String(row.description),
    category: String(row.category_title),
    categorySlug: String(row.category_slug),
    difficulty: String(row.difficulty),
    time: String(row.estimated_time),
    views: Number(row.views_count).toLocaleString('en-US'),
    viewsCount: Number(row.views_count),
    updated: String(row.updated_label),
    href: `/troubleshooting/${String(row.slug)}/`,
    steps: [] as string[],
    content
  }
}

export class ContentRepository {
  constructor(private readonly db: Pool) {}

  private readonly categorySelect = `
    SELECT c.*,
      (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_published = TRUE) AS product_count,
      (SELECT COUNT(*) FROM product_reviews pr JOIN products p ON p.id = pr.product_id WHERE p.category_id = c.id AND p.is_published = TRUE AND pr.is_published = TRUE) AS reviewed_count,
      (SELECT COUNT(*) FROM comparisons x WHERE x.category_id = c.id AND x.is_published = TRUE) AS comparison_count,
      COALESCE(
        (SELECT CASE WHEN COUNT(*) = 0 THEN NULL ELSE CONCAT('$', CAST(ROUND(MIN(p.price), 0) AS UNSIGNED), '–$', CAST(ROUND(MAX(p.price), 0) AS UNSIGNED)) END
           FROM products p WHERE p.category_id = c.id AND p.is_published = TRUE AND p.price IS NOT NULL),
        c.price_range,
        'Prices vary; check Amazon listing'
      ) AS price_range,
      (SELECT p.name FROM products p WHERE p.category_id = c.id AND p.is_published = TRUE ORDER BY p.rank_order, p.id LIMIT 1) AS top_pick,
      (SELECT p.score FROM products p WHERE p.category_id = c.id AND p.is_published = TRUE ORDER BY p.rank_order, p.id LIMIT 1) AS top_score
      ,(SELECT DATE_FORMAT(MAX(p.updated_at), '%b %Y') FROM products p WHERE p.category_id = c.id AND p.is_published = TRUE) AS computed_updated
    FROM categories c`

  async ping() {
    await this.db.query('SELECT 1')
  }

  async listCategories() {
    const [rows] = await this.db.query<DbRow[]>(
      `${this.categorySelect} WHERE c.is_published = TRUE ORDER BY c.sort_order, c.id`
    )
    const categories = rows.map(categoryDto)
    await this.attachCategoryCriteria(categories)
    return categories
  }

  async getCategory(slug: string) {
    const [rows] = await this.db.execute<DbRow[]>(
      `${this.categorySelect} WHERE c.slug = ? AND c.is_published = TRUE LIMIT 1`,
      [slug]
    )
    if (!rows[0]) return null
    const category = categoryDto(rows[0])
    await this.attachCategoryCriteria([category])
    return category
  }

  private async attachCategoryCriteria(categories: ReturnType<typeof categoryDto>[]) {
    if (!categories.length) return
    const ids = categories.map((item) => item.id)
    const [rows] = await this.db.query<DbRow[]>(
      `SELECT category_id, title, description, icon FROM category_criteria
       WHERE category_id IN (${idsPlaceholder(ids)}) ORDER BY category_id, sort_order, id`,
      ids
    )
    const byId = new Map(categories.map((item) => [item.id, item]))
    for (const row of rows) {
      byId.get(Number(row.category_id))?.criteria.push({
        title: String(row.title),
        description: String(row.description),
        icon: row.icon === null ? null : String(row.icon)
      })
    }
  }

  async listProducts(query: ListQuery): Promise<ListResult<ReturnType<typeof productDto>>> {
    const where = ['p.is_published = TRUE']
    const params: unknown[] = []
    if (query.category) {
      where.push('c.slug = ?')
      params.push(query.category)
    }
    if (query.search) {
      where.push('(p.name LIKE ? OR p.brand LIKE ? OR p.verdict LIKE ? OR p.best_for LIKE ?)')
      const value = `%${query.search}%`
      params.push(value, value, value, value)
    }
    if (query.maxPrice !== undefined) {
      where.push('p.price <= ?')
      params.push(query.maxPrice)
    }
    for (const [key, value] of [['cat_count', query.catCount], ['litter_type', query.litterType], ['app', query.app]] as const) {
      if (!value) continue
      where.push('EXISTS (SELECT 1 FROM product_specs psf WHERE psf.product_id = p.id AND psf.spec_key = ? AND psf.value = ?)')
      params.push(key, value)
    }
    if (query.featured !== undefined) {
      where.push('p.is_featured = ?')
      params.push(query.featured)
    }
    const orderBy = {
      rank: 'c.sort_order, p.rank_order, p.id',
      price_asc: 'p.price IS NULL, p.price ASC, p.rank_order',
      price_desc: 'p.price DESC, p.rank_order',
      score_desc: 'p.score DESC, p.rank_order',
      popular: 'p.is_featured DESC, p.rank_order',
      newest: 'p.updated_at DESC, p.id DESC'
    }[query.sort]
    const offset = (query.page - 1) * query.limit
    const baseFrom = `FROM products p JOIN categories c ON c.id = p.category_id WHERE ${where.join(' AND ')}`
    const [countRows] = await this.db.query<DbRow[]>(`SELECT COUNT(*) AS total ${baseFrom}`, params)
    const [rows] = await this.db.query<DbRow[]>(
      `SELECT p.*, c.slug AS category_slug,
        (SELECT facts_json FROM product_source_facts sf WHERE sf.product_id=p.id AND sf.source_name='Amazon' LIMIT 1) AS source_facts_json
       ${baseFrom} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, query.limit, offset]
    )
    const products = rows.map(productDto)
    await this.attachProductDetails(products)
    return { items: products, total: Number(countRows[0]?.total ?? 0) }
  }

  async getProduct(slug: string) {
    const [rows] = await this.db.execute<DbRow[]>(
      `SELECT p.*, c.slug AS category_slug,
        (SELECT facts_json FROM product_source_facts sf WHERE sf.product_id=p.id AND sf.source_name='Amazon' LIMIT 1) AS source_facts_json
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.slug = ? AND p.is_published = TRUE LIMIT 1`,
      [slug]
    )
    if (!rows[0]) return null
    const product = productDto(rows[0])
    await this.attachProductDetails([product])
    const [reviewRows] = await this.db.execute<DbRow[]>(
      `SELECT * FROM product_reviews WHERE product_id = ? AND is_published = TRUE LIMIT 1`,
      [product.databaseId]
    )
    const [feedbackRows] = await this.db.execute<DbRow[]>(
      `SELECT source_name, source_url, checked_at, rating, review_count, visible_review_count,
              sample_method, sample_newest_review_at, sample_oldest_review_at,
              summary, positives_json, concerns_json, themes_json, sample_note
       FROM product_user_review_summaries WHERE product_id = ? LIMIT 1`,
      [product.databaseId]
    )
    const review = reviewRows[0]
    const checkedDate = isoDate(product.commerceCheckedAt) ?? isoDate(review?.price_checked_date)
    const verifiedReview = product.amazonVerified ? {
      summary: `Amazon.com listing ${product.id} was checked${checkedDate ? ` on ${checkedDate}` : ''} with delivery set to the United States. Use the live listing for current price, seller, stock, and delivery.`,
      gallery: product.img ? [product.img] : [],
      quickSpecs: [
        ...product.specDetails.map((item) => ({ label: item.label ?? 'Amazon listing fact', value: item.value })),
        { label: 'Price at last check', value: product.priceDisplay ?? 'See current price on Amazon' },
        { label: 'Amazon.com rating', value: product.amazonRating === null ? 'Not available' : `${product.amazonRating.toFixed(1)} / 5 (${(product.amazonReviewCount ?? 0).toLocaleString('en-US')} reviews)` },
        { label: 'US availability', value: product.availability ?? 'Check Amazon.com listing' },
        { label: 'Subscription', value: product.subscription ?? 'Not stated on the listing' }
      ],
      strengths: [],
      limitations: [],
      sections: [
        { title: 'Verified product identity', body: `${product.name} is linked to Amazon ASIN ${product.id}.` },
        { title: 'Marketplace scope', body: 'Commerce information is taken from Amazon.com with delivery set to the United States and prices shown in USD.' },
        { title: 'Dynamic information', body: 'Amazon.com price, availability, seller, delivery, and customer rating can change. Check the linked US listing before purchase.' }
      ],
      researchDate: checkedDate,
      priceCheckedDate: checkedDate,
      nextReview: 'Recheck before purchase',
      sourceCount: 1
    } : null
    const editorialReview = review ? {
      summary: review.summary,
      gallery: parseJson(review.gallery_json, []),
      quickSpecs: parseJson(review.quick_specs_json, []),
      strengths: parseJson(review.strengths_json, []),
      limitations: parseJson(review.limitations_json, []),
      sections: parseJson(review.sections_json, []),
      researchDate: review.research_date,
      priceCheckedDate: review.price_checked_date,
      nextReview: review.next_review_label,
      sourceCount: review.source_count === null ? null : Number(review.source_count)
    } : null
    const mergedReview = product.amazonVerified && editorialReview ? {
      ...verifiedReview,
      summary: editorialReview.summary || verifiedReview?.summary,
      gallery: product.img ? [product.img] : editorialReview.gallery,
      quickSpecs: [
        ...(Array.isArray(verifiedReview?.quickSpecs) ? verifiedReview.quickSpecs : []),
        ...(Array.isArray(editorialReview.quickSpecs)
          ? editorialReview.quickSpecs
          : editorialReview.quickSpecs && typeof editorialReview.quickSpecs === 'object'
            ? Object.entries(editorialReview.quickSpecs as Record<string, unknown>).map(([label, value]) => ({ label, value }))
            : [])
      ],
      strengths: editorialReview.strengths,
      limitations: editorialReview.limitations,
      sections: [
        ...(Array.isArray(verifiedReview?.sections) ? verifiedReview.sections : []),
        ...(Array.isArray(editorialReview.sections) ? editorialReview.sections : [])
      ],
      researchDate: editorialReview.researchDate ?? verifiedReview?.researchDate,
      priceCheckedDate: editorialReview.priceCheckedDate ?? verifiedReview?.priceCheckedDate,
      nextReview: editorialReview.nextReview ?? verifiedReview?.nextReview,
      sourceCount: editorialReview.sourceCount ?? verifiedReview?.sourceCount
    } : (editorialReview ?? verifiedReview)
    return {
      ...product,
      // Prefer the curated review when available. Amazon verification still
      // supplies identity and commerce facts, but must not replace the
      // detailed editorial content on a product page.
      review: mergedReview,
      userReviewSummary: feedbackRows[0] ? {
        sourceName: String(feedbackRows[0].source_name),
        sourceUrl: String(feedbackRows[0].source_url),
        checkedAt: isoDate(feedbackRows[0].checked_at),
        rating: feedbackRows[0].rating === null ? null : Number(feedbackRows[0].rating),
        reviewCount: feedbackRows[0].review_count === null ? null : Number(feedbackRows[0].review_count),
        visibleReviewCount: Number(feedbackRows[0].visible_review_count ?? 0),
        sampleMethod: feedbackRows[0].sample_method === null ? null : String(feedbackRows[0].sample_method),
        sampleNewestReviewAt: isoDate(feedbackRows[0].sample_newest_review_at),
        sampleOldestReviewAt: isoDate(feedbackRows[0].sample_oldest_review_at),
        summary: String(feedbackRows[0].summary || ''),
        positives: parseJson<string[]>(feedbackRows[0].positives_json, []),
        concerns: parseJson<string[]>(feedbackRows[0].concerns_json, []),
        themes: parseJson<any[]>(feedbackRows[0].themes_json, []),
        sampleNote: String(feedbackRows[0].sample_note || '')
      } : null
    }
  }

  private async attachProductDetails(products: ReturnType<typeof productDto>[]) {
    if (!products.length) return
    const ids = products.map((item) => item.databaseId)
    const placeholders = idsPlaceholder(ids)
    const [tagRows, specRows] = await Promise.all([
      this.db.query<DbRow[]>(
        `SELECT product_id, tag FROM product_tags WHERE product_id IN (${placeholders}) ORDER BY product_id, sort_order, tag`,
        ids
      ),
      this.db.query<DbRow[]>(
        `SELECT product_id, spec_key, label, value FROM product_specs WHERE product_id IN (${placeholders}) ORDER BY product_id, sort_order, id`,
        ids
      )
    ])
    const byId = new Map(products.map((item) => [item.databaseId, item]))
    for (const row of tagRows[0]) {
      const product = byId.get(Number(row.product_id))
      if (product && !product.amazonVerified) product.tags.push(String(row.tag))
    }
    for (const row of specRows[0]) {
      const product = byId.get(Number(row.product_id))
      if (!product) continue
      const key = row.spec_key === null ? null : String(row.spec_key)
      if (key) product.filterSpecs[key] = String(row.value)
      if (product.amazonVerified) continue
      product.specs.push(String(row.value))
      product.specDetails.push({
        key,
        label: row.label === null ? null : String(row.label),
        value: String(row.value)
      })
    }
  }

  async listComparisons(query: ListQuery): Promise<ListResult<ReturnType<typeof comparisonDto>>> {
    const where = ['x.is_published = TRUE']
    const params: unknown[] = []
    if (query.category) { where.push('c.slug = ?'); params.push(query.category) }
    if (query.featured !== undefined) { where.push('x.is_featured = ?'); params.push(query.featured) }
    const order = query.sort === 'popular' ? 'x.views_count DESC' : query.sort === 'newest' ? 'x.updated_at DESC' : 'x.sort_order, x.id'
    const from = `FROM comparisons x
      JOIN categories c ON c.id = x.category_id
      LEFT JOIN products pa ON pa.id=x.product_a_id
      LEFT JOIN products pb ON pb.id=x.product_b_id
      WHERE ${where.join(' AND ')}`
    const [countRows] = await this.db.query<DbRow[]>(`SELECT COUNT(*) total ${from}`, params)
    const [rows] = await this.db.query<DbRow[]>(
      `SELECT x.*, c.slug category_slug, c.title category_title,
        COALESCE(pa.name, x.product_a_name) product_a_name,
        COALESCE(pb.name, x.product_b_name) product_b_name
       ${from} ORDER BY ${order} LIMIT ? OFFSET ?`,
      [...params, query.limit, (query.page - 1) * query.limit]
    )
    const items = rows.map(comparisonDto)
    await this.attachComparisonDetails(items)
    return { items, total: Number(countRows[0]?.total ?? 0) }
  }

  async getComparison(slug: string) {
    const [rows] = await this.db.execute<DbRow[]>(
      `SELECT x.*, c.slug category_slug, c.title category_title,
        COALESCE(pa.name, x.product_a_name) product_a_name,
        COALESCE(pb.name, x.product_b_name) product_b_name
       FROM comparisons x
       JOIN categories c ON c.id = x.category_id
       LEFT JOIN products pa ON pa.id=x.product_a_id
       LEFT JOIN products pb ON pb.id=x.product_b_id
       WHERE x.slug = ? AND x.is_published = TRUE LIMIT 1`,
      [slug]
    )
    if (!rows[0]) return null
    const item = comparisonDto(rows[0])
    await this.attachComparisonDetails([item])
    return item
  }

  private async attachComparisonDetails(items: ReturnType<typeof comparisonDto>[]) {
    if (!items.length) return
    const ids = items.map((item) => item.id)
    const placeholders = idsPlaceholder(ids)
    const [bestRows, criteriaRows] = await Promise.all([
      this.db.query<DbRow[]>(`SELECT comparison_id, pick_name, audience FROM comparison_best_for WHERE comparison_id IN (${placeholders}) ORDER BY comparison_id, sort_order, id`, ids),
      this.db.query<DbRow[]>(`SELECT comparison_id, label, product_a_value, product_b_value, winner FROM comparison_criteria WHERE comparison_id IN (${placeholders}) ORDER BY comparison_id, sort_order, id`, ids)
    ])
    const byId = new Map(items.map((item) => [item.id, item]))
    for (const row of bestRows[0]) byId.get(Number(row.comparison_id))?.bestFor.push({ pick: String(row.pick_name), who: String(row.audience) })
    for (const row of criteriaRows[0]) byId.get(Number(row.comparison_id))?.criteria.push({ label: String(row.label), aVal: String(row.product_a_value), bVal: String(row.product_b_value), winner: row.winner as 'a' | 'b' | 'tie', edgeLabel: row.winner === 'tie' ? 'No difference recorded' : 'Recorded edge' })

    // Keep dynamic Amazon price/rating rows aligned with the linked products.
    // Other editorial criteria stay unchanged until independently re-verified.
    const productIds = items.flatMap((item) => [item.productAId, item.productBId]).filter((id): id is number => id !== null)
    if (productIds.length) {
      const [productRows] = await this.db.query<DbRow[]>(
        `SELECT id, external_id, name, brand, image_url, merchant_url, price, price_display, amazon_rating, amazon_review_count, amazon_availability, subscription, commerce_checked_at
         FROM products WHERE id IN (${idsPlaceholder(productIds)})`,
        productIds
      )
      const products = new Map(productRows.map((row) => [Number(row.id), row]))
      const categoryIds = [...new Set(items.map((item) => item.categoryId))]
      const [metricResult, attributeResult, reviewSummaryResult] = await Promise.all([
        this.db.query<DbRow[]>(
          `SELECT m.category_id, m.id metric_definition_id, m.metric_key, m.label, m.help_text,
                  m.comparison_rule, m.sort_order, m.is_published, v.product_id, v.display_value, v.numeric_value,
                  v.source_url, v.checked_at, v.confidence, v.evidence_status
           FROM comparison_metric_definitions m
           LEFT JOIN product_metric_values v
             ON v.metric_definition_id=m.id AND v.product_id IN (${idsPlaceholder(productIds)})
           WHERE m.category_id IN (${idsPlaceholder(categoryIds)})
           ORDER BY m.category_id, m.sort_order, m.id`,
          [...productIds, ...categoryIds]
        ),
        this.db.query<DbRow[]>(
          `SELECT p.id product_id, ps.spec_key, ps.label, ps.value
           FROM products p
           LEFT JOIN product_specs ps ON ps.product_id=p.id
           WHERE p.id IN (${idsPlaceholder(productIds)})
           ORDER BY p.id, ps.sort_order, ps.id`,
          productIds
        ),
        this.db.query<DbRow[]>(
          `SELECT product_id, source_name, source_url, checked_at, rating, review_count, visible_review_count,
                  sample_method, sample_target_count, sample_newest_review_at, sample_oldest_review_at,
                  rating_distribution_json, summary, positives_json, concerns_json, themes_json, sample_note
           FROM product_user_review_summaries
           WHERE product_id IN (${idsPlaceholder(productIds)})`,
          productIds
        )
      ])
      const metricRows = metricResult[0]
      const attributeRows = attributeResult[0]
      const reviewSummaryRows = reviewSummaryResult[0]
      for (const item of items) {
        const a = products.get(item.productAId ?? -1)
        const b = products.get(item.productBId ?? -1)
        if (!a || !b) continue
        const value = (row: DbRow, key: string, fallback = 'Check Amazon listing') => row[key] === null || row[key] === undefined || row[key] === '' ? fallback : String(row[key])
        const rating = (row: DbRow) => row.amazon_rating === null
          ? 'Not available'
          : `${Number(row.amazon_rating).toFixed(1)} / 5 (${Number(row.amazon_review_count ?? 0).toLocaleString('en-US')} reviews)`
        const aName = String(a.name)
        const bName = String(b.name)
        const sourceA = amazonUsUrl(a.external_id, a.merchant_url)
        const sourceB = amazonUsUrl(b.external_id, b.merchant_url)
        const attributeAliases: Record<string, string> = {
          dimension: 'dimensions',
          product_dimensions: 'dimensions',
          package_dimensions: 'dimensions',
          item_dimensions: 'dimensions',
          item_weight: 'weight',
          product_weight: 'weight',
          net_weight: 'weight',
          colour: 'color',
          model_number: 'model',
          model_name: 'model',
          amazon_best_sellers_rank: 'amazon_bestsellers_rank',
          best_sellers_rank: 'amazon_bestsellers_rank'
        }
        const normalizedKey = (row: DbRow) => {
          const key = String(row.spec_key || row.label || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
          return attributeAliases[key] ?? key
        }
        const attributesFor = (productId: number) => new Map(
          attributeRows
            .filter((row) => Number(row.product_id) === productId && (row.spec_key || row.label))
            .map((row) => [normalizedKey(row), { label: String(row.label || row.spec_key), value: String(row.value) }])
        )
        const aAttributes = attributesFor(Number(a.id))
        const bAttributes = attributesFor(Number(b.id))
        const configurationsDiffer = /bundle|pack|kit/i.test(aName) !== /bundle|pack|kit/i.test(bName)
        const availabilityA = value(a, 'amazon_availability', 'Not verified')
        const availabilityB = value(b, 'amazon_availability', 'Not verified')
        const subscriptionA = value(a, 'subscription', 'Not verified')
        const subscriptionB = value(b, 'subscription', 'Not verified')
        const productIdentity = (side: 'a' | 'b', row: DbRow) => {
          const facts = metricRows.filter((metric) => Number(metric.product_id) === Number(row.id))
          const metricValue = (key: string) => facts.find((fact) => String(fact.metric_key) === key)?.display_value
          const specs = attributeRows.filter((spec) => Number(spec.product_id) === Number(row.id) && (spec.spec_key || spec.label))
          const specValue = (key: string) => specs.find((spec) => String(spec.spec_key ?? '').toLowerCase() === key)?.value
          const structureKeys = item.categorySlug === 'automatic-litter-boxes'
            ? ['design','cleaning_system']
            : item.categorySlug === 'gps-pet-trackers'
              ? ['tracking_mode']
              : item.categorySlug === 'smart-pet-feeders'
                ? ['portion_control','connectivity']
                : item.categorySlug === 'smart-water-fountains'
                  ? ['water_delivery','filtration']
                  : ['coverage','resolution']
          return {
            side,
            name: String(row.name),
            brand: String(row.brand),
            // Only expose a value as ASIN when it is an actual Amazon ASIN.
            // Editorial expansion rows use internal external_id keys (for
            // example `health-whistle-health`); showing those as ASINs makes
            // the comparison table look like a verified marketplace record.
            asin: /^B[A-Z0-9]{9}$/.test(String(row.external_id ?? '')) ? String(row.external_id) : null,
            variant: String(specValue('variant') ?? (/bundle|pack|kit/i.test(String(row.name)) ? 'Bundle / kit listing' : 'Configuration shown on linked listing')),
            img: row.image_url,
            merchantUrl: amazonUsUrl(row.external_id, row.merchant_url),
            price: row.price === null ? null : Number(row.price),
            priceDisplay: row.price_display === null ? null : String(row.price_display),
            priceStatus: row.price === null ? 'unavailable' : (row.commerce_checked_at ? 'verified' : 'stale'),
            sourceStatus: /^B[A-Z0-9]{9}$/.test(String(row.external_id ?? '')) ? 'verified' : 'unavailable',
            checkedAt: isoDate(row.commerce_checked_at),
            structure: structureKeys.map(metricValue).filter(Boolean).join(' · ') || 'Not verified',
            dimensions: String(specValue('dimensions') ?? 'Not verified'),
            weight: item.categorySlug === 'gps-pet-trackers'
              ? String(metricValue('pet_fit') ?? specValue('weight') ?? 'Not verified')
              : item.categorySlug === 'automatic-litter-boxes'
                ? [specValue('weight'), metricValue('minimum_cat_weight')].filter(Boolean).join(' · ') || 'Not verified'
                : String(specValue('weight') ?? 'Not verified'),
            capacity: ['smart-pet-feeders', 'smart-water-fountains'].includes(item.categorySlug)
              ? String(metricValue('capacity') ?? 'Not verified')
              : item.categorySlug === 'automatic-litter-boxes'
                ? String(metricValue('waste_capacity') ?? 'Not verified')
                : 'Not applicable / not verified'
          }
        }
        item.products = [productIdentity('a', a), productIdentity('b', b)]
        const reviewSummaryFor = (side: 'a' | 'b', product: DbRow) => {
          const snapshot = reviewSummaryRows.find((row) => Number(row.product_id) === Number(product.id))
          if (!snapshot) return null
          return {
            side,
            productName: String(product.name),
            rating: snapshot.rating === null ? null : Number(snapshot.rating),
            reviewCount: snapshot.review_count === null ? null : Number(snapshot.review_count),
            visibleReviewCount: Number(snapshot.visible_review_count ?? 0),
            sampleMethod: snapshot.sample_method === null ? null : String(snapshot.sample_method),
            sampleTargetCount: snapshot.sample_target_count === null ? null : Number(snapshot.sample_target_count),
            sampleNewestReviewAt: isoDate(snapshot.sample_newest_review_at),
            sampleOldestReviewAt: isoDate(snapshot.sample_oldest_review_at),
            checkedAt: isoDate(snapshot.checked_at),
            sourceName: String(snapshot.source_name),
            sourceUrl: String(snapshot.source_url),
            ratingDistribution: parseJson<Record<string, number>>(snapshot.rating_distribution_json, {}),
            summary: String(snapshot.summary),
            positives: parseJson<string[]>(snapshot.positives_json, []),
            concerns: parseJson<string[]>(snapshot.concerns_json, []),
            themes: parseJson<Array<{ label: string; mentions: number; kind: 'positive' | 'mixed' | 'concern'; detail: string }>>(snapshot.themes_json, []),
            sampleNote: String(snapshot.sample_note)
          }
        }
        item.userReviewSummaries = [reviewSummaryFor('a', a), reviewSummaryFor('b', b)].filter((summary): summary is NonNullable<typeof summary> => summary !== null)
        if (item.userReviewSummaries.length) {
          const visibleTotal = item.userReviewSummaries.reduce((total, summary) => total + summary.visibleReviewCount, 0)
          const latestSamples = item.userReviewSummaries.filter((summary) => summary.sampleMethod === 'latest_desc')
          item.userFeedback = {
            status: 'researched',
            summary: latestSamples.length === item.userReviewSummaries.length
              ? `Customer-review themes were coded from ${visibleTotal} newest-first Amazon reviews across the two products, using up to 50 reviews per product. They are ownership signals to investigate, not PetMetricus performance-test results.`
              : `Customer-review themes were coded from ${visibleTotal} reviews available in the linked Amazon snapshots. They are ownership signals to investigate, not PetMetricus performance-test results.`,
            sampleLimit: latestSamples.length === item.userReviewSummaries.length
              ? 'Each product uses its latest 50 readable reviews, or every readable review when Amazon reports fewer than 50. A listing may combine multiple variants.'
              : 'Amazon may select which reviews are visible, and a listing may combine multiple variants. Theme presence does not show how common an experience is across all ratings.'
          }
        }
        item.checkedAt = isoDate(a.commerce_checked_at) === isoDate(b.commerce_checked_at) ? isoDate(a.commerce_checked_at) : null
        if (!item.whyCompare) {
          item.whyCompare = item.comparisonType === 'Workflow comparison'
            ? `${aName} and ${bName} solve adjacent parts of the ownership routine. This comparison clarifies which job each product performs; they are not interchangeable substitutes.`
            : `${aName} and ${bName} address the same core buying decision with different product, fit, maintenance, and ownership-cost trade-offs.`
        }
        item.scopeNote = item.scope || (configurationsDiffer
          ? 'The current Amazon.com US listings may use different configurations (for example, a supply bundle versus a device listing). Listed USD prices are shown for reference and are not treated as a fair value comparison.'
          : 'This quick comparison uses Amazon.com listing facts with delivery set to the United States. Pet fit, safety, reliability, cleaning effort, and long-term ownership still require independent verification.')
        const categoryGaps: Record<string, string[]> = {
          'automatic-litter-boxes': ['Minimum cat weight and kitten safety', 'Interior space and large-cat fit', 'Sensor reliability and anti-pinch design', 'Litter compatibility, noise, cleaning effort, and annual consumable cost'],
          'gps-pet-trackers': ['Coverage in the owner’s actual area', 'Live-mode battery life and location refresh interval', 'Collar fit, device weight, waterproofing, and escape risk', 'Required plan and full first-year cost'],
          'smart-pet-feeders': ['Portion accuracy with the household’s kibble', 'Jam detection and backup power behavior', 'Food-contact cleaning and bowl suitability', 'Offline schedules, app reliability, and pet access control'],
          'pet-cameras': ['Field of view and night image quality', 'Pet response to two-way audio and treat sounds', 'Privacy controls and local/cloud storage', 'Feature limits and full subscription cost'],
          'smart-water-fountains': ['Bowl and water-path cleaning effort', 'Filter or wastewater-system running cost', 'Pump reliability and safe low-water behavior', 'Noise, pet acceptance, and actual hydration tracking accuracy']
        }
        item.decisionGaps = categoryGaps[item.categorySlug] ?? ['Pet fit and safety', 'Reliability', 'Long-term ownership cost']
        const opportunities: Record<string, string[]> = {
          'automatic-litter-boxes': ['Independent, model-specific safety and anti-pinch certification', 'Comparable noise, cleaning-effort, and usable-interior tests', 'A standard way to publish annual litter, liner, filter, and deodorizer cost'],
          'gps-pet-trackers': ['Independent coverage, location-latency, and live-mode battery benchmarks', 'A common fit and attachment-safety standard for pet size and activity level', 'Comparable first-year and renewal pricing across tracking plans'],
          'smart-pet-feeders': ['Independent portion-accuracy and jam-rate tests across standardized kibble sizes', 'A common way to report offline reliability and backup-power duration', 'Comparable annual ownership cost including desiccants, batteries, and replacement parts'],
          'pet-cameras': ['Independent pet-detection accuracy and false-alert benchmarks', 'A standard privacy label for local storage, cloud retention, sharing, and deletion', 'Published evidence on whether audio and treat interaction helps or stresses pets'],
          'smart-water-fountains': ['Independent hygiene, biofilm, pump-life, and hydration-sensor testing', 'A standard annual-cost label for filters, pumps, and replacement parts', 'Comparable cleaning-time and water-path accessibility measurements']
        }
        const developerLessons: Record<string, string[]> = {
          'automatic-litter-boxes': [
            'Combine a cat-friendly entrance and usable interior with dependable waste separation and containment.',
            'Add health signals only when cameras and sensors do not make daily cleaning or privacy controls harder.',
            'Use modular, removable parts so the liner, drawer, odor system, and sensors can be serviced independently.'
          ],
          'gps-pet-trackers': [
            'Balance fast live tracking with a lightweight, snag-resistant attachment and predictable battery use.',
            'Guide owners through a clear recovery workflow that adapts between normal and weak-signal conditions.',
            'Keep escape alerts and last-known location understandable even when connectivity degrades.'
          ],
          'smart-pet-feeders': [
            'Pair precise dispensing with sensor-led jam recovery instead of relying on scheduling alone.',
            'Keep the feeding plan running offline and make power or food-delivery failures visible at a glance.',
            'Separate the hopper, rotor, chute, and bowl so every food-contact surface can be washed.'
          ],
          'pet-cameras': [
            'Use an obvious physical privacy state so owners can tell when video and audio capture is possible.',
            'Prioritize actionable pet alerts and household-specific tuning over a larger list of AI labels.',
            'Design treat and audio interactions with quiet failure states that do not startle an unattended pet.'
          ],
          'smart-water-fountains': [
            'Make the entire water path visible and removable so smart sensing does not add hidden cleaning traps.',
            'Provide a safe low-water fallback and keep basic water access available when power or connectivity fails.',
            'Turn hydration data into simple trend changes and maintenance actions rather than raw app statistics.'
          ]
        }
        const defaultDeveloperLessons = [
          'Publish measurable performance and safety limits for the exact product variant.',
          'Design routine cleaning, setup, and maintenance around real household use.',
          'Make required accessories, subscriptions, and long-term ownership costs explicit.'
        ]
        const defaultOpportunities = [
          'Comparable independent testing for the category’s core functions',
          'Clearer model-specific safety, fit, and reliability documentation',
          'Transparent long-term ownership and consumable costs'
        ]
        item.researchConclusion = {
          coreFunctionLeader: 'Not established from the currently verified evidence.',
          practicalChoice: 'Use the verified functional rows to shortlist products, then confirm the unresolved pet-fit and safety items before purchase.',
          developerLessons: developerLessons[item.categorySlug] ?? defaultDeveloperLessons,
          marketOpportunities: opportunities[item.categorySlug] ?? defaultOpportunities
        }
        type MetricValue = { display: string; numeric: number | null; evidenceStatus: EvidenceStatus; sourceUrl: string | null }
        const categoryMetrics = new Map<string, { key: string; label: string; helpText: string; rule: string; sortOrder: number; values: Map<number, MetricValue> }>()
        const allMetricValues = new Map<string, MetricValue>()
        for (const row of metricRows.filter((metric) => Number(metric.category_id) === item.categoryId)) {
          const key = String(row.metric_key)
          if (row.product_id !== null) allMetricValues.set(`${Number(row.product_id)}:${key}`, {
            display: String(row.display_value),
            numeric: row.numeric_value === null ? null : Number(row.numeric_value),
            evidenceStatus: String(row.evidence_status ?? 'unclear') as EvidenceStatus,
            sourceUrl: row.source_url ? String(row.source_url) : null
          })
          if (Number(row.is_published) !== 1) continue
          if (!categoryMetrics.has(key)) categoryMetrics.set(key, {
            key,
            label: String(row.label),
            helpText: String(row.help_text ?? ''),
            rule: String(row.comparison_rule),
            sortOrder: Number(row.sort_order),
            values: new Map()
          })
          if (row.product_id !== null) categoryMetrics.get(key)?.values.set(Number(row.product_id), {
            display: String(row.display_value),
            numeric: row.numeric_value === null ? null : Number(row.numeric_value),
            evidenceStatus: String(row.evidence_status ?? 'unclear') as EvidenceStatus,
            sourceUrl: row.source_url ? String(row.source_url) : null
          })
        }
        const metricSpecAliases: Record<string, Record<string, string[]>> = {
          'automatic-litter-boxes': {
            automatic_cleaning: ['cleaning_system'],
            litter_compatibility: ['litter_type']
          },
          'gps-pet-trackers': {
            tracking_mode: ['tracking'],
            battery_claim: ['battery'],
            waterproofing: ['waterproof'],
            coverage: ['coverage', 'network']
          },
          'smart-pet-feeders': {
            capacity: ['capacity'],
            meal_schedule: ['schedule'],
            camera: ['camera'],
            portion_control: ['accuracy'],
            backup_power: ['power']
          },
          'pet-cameras': {
            resolution: ['resolution'],
            coverage: ['field_of_view'],
            night_vision: ['night_vision'],
            treat_interaction: ['treat_range', 'treats'],
            storage_privacy: ['storage']
          },
          'smart-water-fountains': {
            capacity: ['capacity'],
            hydration_tracking: ['connectivity'],
            water_delivery: ['water_flow'],
            filtration: ['filtration'],
            cordless_runtime: ['power'],
            material: ['material'],
            maintenance: ['maintenance'],
            noise: ['noise'],
            warranty: ['warranty'],
            ongoing_consumables: ['consumables']
          }
        }
        const fallbackMetric = (productId: number, metricKey: string, specs: Map<string, { label: string; value: string }>, sourceUrl: string | null): MetricValue | undefined => {
          const aliases = metricSpecAliases[item.categorySlug]?.[metricKey] ?? []
          for (const alias of aliases) {
            const legacyMetric = allMetricValues.get(`${productId}:${alias}`)
            if (legacyMetric) return legacyMetric
          }
          const matched = aliases.map((alias) => specs.get(alias)).filter((fact): fact is { label: string; value: string } => Boolean(fact))
          if (!matched.length) return undefined
          const needsLabels = matched.length > 1 || ['portion_control', 'treat_interaction'].includes(metricKey)
          return {
            display: matched.map((fact) => needsLabels ? `${fact.label}: ${fact.value}` : fact.value).join(' · '),
            numeric: null,
            evidenceStatus: 'claim',
            sourceUrl
          }
        }
        for (const metric of categoryMetrics.values()) {
          if (!metric.values.has(Number(a.id))) {
            const fallback = fallbackMetric(Number(a.id), metric.key, aAttributes, sourceA)
            if (fallback) metric.values.set(Number(a.id), fallback)
          }
          if (!metric.values.has(Number(b.id))) {
            const fallback = fallbackMetric(Number(b.id), metric.key, bAttributes, sourceB)
            if (fallback) metric.values.set(Number(b.id), fallback)
          }
        }
        const categoryCriteria = [...categoryMetrics.values()].sort((left, right) => left.sortOrder - right.sortOrder).map((metric) => {
          const aMetric = metric.values.get(item.productAId ?? -1)
          const bMetric = metric.values.get(item.productBId ?? -1)
          let winner: 'a' | 'b' | 'tie' | 'unknown' = 'unknown'
          let edgeLabel = !aMetric && !bMetric ? 'Not yet verified' : !aMetric || !bMetric ? 'Only one listing verified' : 'Compare for your pet'
          if (aMetric && bMetric && metric.rule !== 'contextual' && aMetric.numeric !== null && bMetric.numeric !== null) {
            if (aMetric.numeric === bMetric.numeric) { winner = 'tie'; edgeLabel = 'Same verified value' }
            else {
              const aWins = metric.rule === 'higher' ? aMetric.numeric > bMetric.numeric : aMetric.numeric < bMetric.numeric
              winner = aWins ? 'a' : 'b'
              edgeLabel = `${aWins ? aName : bName}: ${metric.rule === 'higher' ? 'higher' : 'lower'} value`
            }
          }
          return { group: `${item.category} criteria`, label: metric.label, helpText: metric.helpText, aVal: aMetric?.display ?? 'Not verified', bVal: bMetric?.display ?? 'Not verified', aStatus: aMetric?.evidenceStatus ?? 'unclear', bStatus: bMetric?.evidenceStatus ?? 'unclear', aSourceUrl: aMetric?.sourceUrl ?? null, bSourceUrl: bMetric?.sourceUrl ?? null, winner, edgeLabel }
        }).filter((metric) => metric.aStatus !== 'unclear' || metric.bStatus !== 'unclear')
        const bilaterallyDocumented = categoryCriteria.filter((metric) => metric.aStatus !== 'unclear' && metric.bStatus !== 'unclear').length
        const evidenceRatio = bilaterallyDocumented / Math.max(categoryCriteria.length, 1)
        item.evidenceConfidence = bilaterallyDocumented >= 5 || (bilaterallyDocumented >= 3 && evidenceRatio >= 0.5) ? 'Moderate' : 'Limited'
        const listingFacts: typeof item.listingFacts = [
          { label: 'Amazon.com US price at last check', aVal: value(a, 'price_display'), bVal: value(b, 'price_display'), aStatus: a.price === null ? 'unclear' : 'explicit', bStatus: b.price === null ? 'unclear' : 'explicit', aSourceUrl: sourceA, bSourceUrl: sourceB },
          { label: 'Amazon.com customer rating', aVal: rating(a), bVal: rating(b), aStatus: a.amazon_rating === null ? 'unclear' : 'explicit', bStatus: b.amazon_rating === null ? 'unclear' : 'explicit', aSourceUrl: sourceA, bSourceUrl: sourceB },
          { label: 'US availability at last check', aVal: availabilityA, bVal: availabilityB, aStatus: availabilityA === 'Not verified' ? 'unclear' : 'explicit', bStatus: availabilityB === 'Not verified' ? 'unclear' : 'explicit', aSourceUrl: sourceA, bSourceUrl: sourceB },
          { label: 'Subscription', aVal: subscriptionA, bVal: subscriptionB, aStatus: subscriptionA === 'Not verified' ? 'unclear' : 'explicit', bStatus: subscriptionB === 'Not verified' ? 'unclear' : 'explicit', aSourceUrl: sourceA, bSourceUrl: sourceB }
        ]
        item.listingFacts = listingFacts.filter((row) => row.aStatus !== 'unclear' || row.bStatus !== 'unclear')
        const unknown = 'Not clearly stated on the checked material'
        const attributeStatus = (fieldValue: unknown): EvidenceStatus => {
          if (fieldValue === null || fieldValue === undefined || fieldValue === '') return 'unclear'
          return /\b(conflict|contradict|inconsistent)\b/i.test(String(fieldValue)) ? 'conflict' : 'explicit'
        }
        const attribute = (key: string, label: string, aVal: unknown, bVal: unknown, note?: string) => ({
          key, label,
          aVal: aVal === null || aVal === undefined || aVal === '' ? unknown : String(aVal),
          bVal: bVal === null || bVal === undefined || bVal === '' ? unknown : String(bVal),
          aStatus: attributeStatus(aVal),
          bStatus: attributeStatus(bVal),
          aSourceUrl: sourceA, bSourceUrl: sourceB,
          ...(note ? { note } : {})
        })
        const standardKeys = new Set(['color','material','dimensions','weight','model','variant','amazon_bestsellers_rank'])
        const dynamicKeys = [...new Set([...aAttributes.keys(), ...bAttributes.keys()])].filter((key) => !standardKeys.has(key))
        item.productAttributes = [
          attribute('brand', 'Brand', a.brand, b.brand),
          attribute('asin', 'ASIN', /^B[A-Z0-9]{9}$/.test(String(a.external_id ?? '')) ? a.external_id : null, /^B[A-Z0-9]{9}$/.test(String(b.external_id ?? '')) ? b.external_id : null),
          attribute('variant', 'Selected variant', aAttributes.get('variant')?.value ?? aName, bAttributes.get('variant')?.value ?? bName),
          attribute('model', 'Model', aAttributes.get('model')?.value, bAttributes.get('model')?.value),
          attribute('color', 'Color', aAttributes.get('color')?.value, bAttributes.get('color')?.value),
          attribute('material', 'Material', aAttributes.get('material')?.value, bAttributes.get('material')?.value),
          attribute('dimensions', 'Product dimensions', aAttributes.get('dimensions')?.value, bAttributes.get('dimensions')?.value),
          attribute('weight', 'Item weight', aAttributes.get('weight')?.value, bAttributes.get('weight')?.value),
          attribute('price', 'Amazon.com US price at last check', a.price === null ? null : a.price_display, b.price === null ? null : b.price_display, configurationsDiffer ? 'Current listings may be different configurations; price is not used to declare a functional winner.' : 'Price is a dated snapshot for delivery to the United States.'),
          attribute('rating', 'Amazon.com customer rating', a.amazon_rating === null ? null : `${Number(a.amazon_rating).toFixed(1)} / 5`, b.amazon_rating === null ? null : `${Number(b.amazon_rating).toFixed(1)} / 5`, 'Amazon.com customer rating, not a PetMetricus editor score.'),
          attribute('review_count', 'Amazon.com review count', a.amazon_rating === null ? null : Number(a.amazon_review_count ?? 0).toLocaleString('en-US'), b.amazon_rating === null ? null : Number(b.amazon_review_count ?? 0).toLocaleString('en-US'), 'Review volume is context only and is not treated as proof of a function.'),
          attribute('availability', 'US availability at last check', availabilityA === 'Not verified' ? null : availabilityA, availabilityB === 'Not verified' ? null : availabilityB, 'Availability is a dated Amazon.com snapshot for delivery to the United States.'),
          attribute('subscription', 'Required subscription', subscriptionA === 'Not verified' ? null : subscriptionA, subscriptionB === 'Not verified' ? null : subscriptionB, 'Optional consumables and service plans may still add ongoing cost.'),
          attribute('amazon_rank', 'Amazon.com Best Sellers Rank', aAttributes.get('amazon_bestsellers_rank')?.value, bAttributes.get('amazon_bestsellers_rank')?.value, 'Rankings are only comparable when the Amazon.com date and category level match.'),
          ...dynamicKeys.map((key) => attribute(key, aAttributes.get(key)?.label ?? bAttributes.get(key)?.label ?? key, aAttributes.get(key)?.value, bAttributes.get(key)?.value))
        ].filter((row) => row.aStatus !== 'unclear' || row.bStatus !== 'unclear')
        item.criteria = categoryCriteria
        const criterionIsExplicitForBoth = (label: string) => {
          const criterion = categoryCriteria.find((row) => row.label === label)
          return criterion?.aStatus === 'explicit' && criterion?.bStatus === 'explicit'
        }
        if (item.categorySlug === 'automatic-litter-boxes' && criterionIsExplicitForBoth('Minimum cat weight')) {
          item.decisionGaps = item.decisionGaps.filter((gap) => gap !== 'Minimum cat weight and kitten safety')
        }
        const documented = (metric: typeof categoryCriteria[number], side: 'a' | 'b') => ['explicit', 'claim'].includes(side === 'a' ? metric.aStatus : metric.bStatus)
        const aDistinct = categoryCriteria.filter((metric) => documented(metric, 'a') && !documented(metric, 'b')).slice(0, 3).map((metric) => metric.label)
        const bDistinct = categoryCriteria.filter((metric) => documented(metric, 'b') && !documented(metric, 'a')).slice(0, 3).map((metric) => metric.label)
        const mainProposition = categoryCriteria.find((metric) => metric.label === 'Main proposition')
        const verifiedDifferences = categoryCriteria.filter((metric) => documented(metric, 'a') && documented(metric, 'b') && metric.aVal !== metric.bVal && metric.label !== 'Main proposition')
        const sentenceLead = (value: string) => /^[A-Z]{2}/.test(value) ? value : `${value.charAt(0).toLowerCase()}${value.slice(1)}`
        const fitReason = (side: 'a' | 'b', distinctive: string[]) => {
          const proposition = side === 'a' ? mainProposition?.aVal : mainProposition?.bVal
          if (proposition && documented(mainProposition!, side)) return `you prioritize ${sentenceLead(proposition)}`
          if (distinctive.length) return `you prioritize ${distinctive.join(', ')}, which ${distinctive.length === 1 ? 'is' : 'are'} more clearly documented for this product`
          const implementationRows = verifiedDifferences.slice(0, 2).map((metric) => metric.label)
          if (implementationRows.length) return `the way it implements ${implementationRows.join(' and ')} better matches your household`
          return 'you have verified its fit, safety, and ownership requirements independently'
        }
        item.bestFor.splice(0, item.bestFor.length,
          { pick: aName, who: `Best fit if ${fitReason('a', aDistinct)}` },
          { pick: bName, who: `Best fit if ${fitReason('b', bDistinct)}` }
        )
        const distinction = [
          aDistinct.length ? `${aName} is more clearly documented for ${aDistinct.join(', ')}` : '',
          bDistinct.length ? `${bName} is more clearly documented for ${bDistinct.join(', ')}` : ''
        ].filter(Boolean).join('; ')
        const positioningDifference = mainProposition && documented(mainProposition, 'a') && documented(mainProposition, 'b')
          ? `${aName} emphasizes ${sentenceLead(mainProposition.aVal)}, while ${bName} emphasizes ${sentenceLead(mainProposition.bVal)}`
          : ''
        item.verdict = positioningDifference
          ? `${positioningDifference}. Choose by the workflow that matters to your household.`
          : distinction
            ? `${distinction}. An unclear item means the checked material did not say enough; it does not prove the product lacks that function.`
          : 'The currently checked material does not establish a meaningful core-function difference. An unclear item does not mean the function is unsupported.'
        item.homeVerdict = item.verdict
        item.researchConclusion = {
          coreFunctionLeader: positioningDifference
            ? `No universal leader is declared. ${positioningDifference}.`
            : distinction || 'Not established from the currently verified evidence.',
          practicalChoice: `Choose ${aName} if ${fitReason('a', aDistinct)}. Choose ${bName} if ${fitReason('b', bDistinct)}. Confirm the unresolved pet-fit and safety checks before purchase.`,
          developerLessons: developerLessons[item.categorySlug] ?? defaultDeveloperLessons,
          marketOpportunities: opportunities[item.categorySlug] ?? defaultOpportunities
        }
      }
    }
  }

  async listBestPicks(query: ListQuery): Promise<ListResult<ReturnType<typeof bestPickDto>>> {
    return this.listSimpleContent('best_picks', bestPickDto, query,
      `SELECT x.*, c.slug category_slug, p.slug product_slug,
        COALESCE(p.name, x.pick_name) pick_name,
        p.image_url image_url,
        x.image_key image_key,
        p.external_id product_external_id, p.brand product_brand, p.merchant_url product_merchant_url,
        p.verdict product_verdict, p.best_for product_best_for, p.price_display product_price_display,
        p.price product_price, p.amazon_rating product_amazon_rating, p.amazon_review_count product_amazon_review_count,
        p.amazon_availability product_amazon_availability, p.commerce_checked_at product_commerce_checked_at
       FROM best_picks x JOIN categories c ON c.id=x.category_id LEFT JOIN products p ON p.id=x.pick_product_id`)
  }

  async getBestPick(slug: string) {
    return this.getSimpleContent('best_picks', bestPickDto, slug,
      `SELECT x.*, c.slug category_slug, p.slug product_slug,
        COALESCE(p.name, x.pick_name) pick_name,
        p.image_url image_url,
        x.image_key image_key,
        p.external_id product_external_id, p.brand product_brand, p.merchant_url product_merchant_url,
        p.verdict product_verdict, p.best_for product_best_for, p.price_display product_price_display,
        p.price product_price, p.amazon_rating product_amazon_rating, p.amazon_review_count product_amazon_review_count,
        p.amazon_availability product_amazon_availability, p.commerce_checked_at product_commerce_checked_at
       FROM best_picks x JOIN categories c ON c.id=x.category_id LEFT JOIN products p ON p.id=x.pick_product_id`)
  }

  async listGuides(query: ListQuery): Promise<ListResult<ReturnType<typeof guideDto>>> {
    return this.listSimpleContent('guides', guideDto, query,
      `SELECT x.*, c.slug category_slug FROM guides x JOIN categories c ON c.id=x.category_id`)
  }

  async getGuide(slug: string) {
    return this.getSimpleContent('guides', guideDto, slug,
      `SELECT x.*, c.slug category_slug FROM guides x JOIN categories c ON c.id=x.category_id`)
  }

  async listTroubleshooting(query: ListQuery): Promise<ListResult<ReturnType<typeof troubleDto>>> {
    const where = ['x.is_published = TRUE']
    const params: unknown[] = []
    if (query.category) { where.push('c.slug = ?'); params.push(query.category) }
    if (query.search) {
      const value = `%${query.search}%`
      where.push('(x.product_name LIKE ? OR x.problem LIKE ? OR x.title LIKE ?)')
      params.push(value, value, value)
    }
    const from = `FROM troubleshooting_guides x JOIN categories c ON c.id=x.category_id LEFT JOIN products p ON p.id=x.product_id WHERE ${where.join(' AND ')}`
    const [countRows] = await this.db.query<DbRow[]>(`SELECT COUNT(*) total ${from}`, params)
    const [rows] = await this.db.query<DbRow[]>(
      `SELECT x.*, c.slug category_slug, c.title category_title, p.slug product_slug,
              p.external_id product_external_id, p.merchant_url product_merchant_url
       ${from} ORDER BY ${query.sort === 'popular' ? 'x.views_count DESC' : 'x.sort_order, x.id'} LIMIT ? OFFSET ?`,
      [...params, query.limit, (query.page - 1) * query.limit]
    )
    const items = rows.map(troubleDto)
    await this.attachTroubleSteps(items)
    return { items, total: Number(countRows[0]?.total ?? 0) }
  }

  async getTroubleshooting(slug: string) {
    const [rows] = await this.db.execute<DbRow[]>(
      `SELECT x.*, c.slug category_slug, c.title category_title, p.slug product_slug,
              p.external_id product_external_id, p.merchant_url product_merchant_url
       FROM troubleshooting_guides x JOIN categories c ON c.id=x.category_id LEFT JOIN products p ON p.id=x.product_id
       WHERE x.slug=? AND x.is_published=TRUE LIMIT 1`, [slug]
    )
    if (!rows[0]) return null
    const item = troubleDto(rows[0])
    await this.attachTroubleSteps([item])
    return item
  }

  private async attachTroubleSteps(items: ReturnType<typeof troubleDto>[]) {
    if (!items.length) return
    const ids = items.map((item) => item.id)
    const [rows] = await this.db.query<DbRow[]>(
      `SELECT guide_id, instruction FROM troubleshooting_steps WHERE guide_id IN (${idsPlaceholder(ids)}) ORDER BY guide_id, sort_order, id`, ids
    )
    const byId = new Map(items.map((item) => [item.id, item]))
    for (const row of rows) byId.get(Number(row.guide_id))?.steps.push(String(row.instruction))

    // Rich troubleshooting articles carry the editorial, fully ordered
    // sequence in content_json.detailedSteps. Keep the list preview and the
    // full guide on that same canonical sequence when it is available.
    for (const item of items) {
      const detailed = (item.content as { detailedSteps?: Array<{ instruction?: unknown }> })?.detailedSteps
      if (Array.isArray(detailed) && detailed.length > item.steps.length) {
        item.steps = detailed
          .map(step => String(step?.instruction ?? ''))
          .filter(Boolean)
      }
    }
  }

  private async listSimpleContent<T>(table: string, mapper: (row: DbRow) => T, query: ListQuery, select: string): Promise<ListResult<T>> {
    const where = ['x.is_published = TRUE']
    const params: unknown[] = []
    if (query.category) { where.push('c.slug=?'); params.push(query.category) }
    if (query.search && (table === 'guides' || table === 'best_picks')) {
      where.push(table === 'guides'
        ? '(x.title LIKE ? OR x.description LIKE ?)'
        : '(x.title LIKE ? OR x.pick_name LIKE ?)')
      const value = `%${query.search}%`
      params.push(value, value)
    }
    const suffix = ` WHERE ${where.join(' AND ')}`
    const [countRows] = await this.db.query<DbRow[]>(`SELECT COUNT(*) total FROM ${table} x JOIN categories c ON c.id=x.category_id${suffix}`, params)
    const [rows] = await this.db.query<DbRow[]>(`${select}${suffix} ORDER BY x.sort_order, x.id LIMIT ? OFFSET ?`, [...params, query.limit, (query.page - 1) * query.limit])
    return { items: rows.map(mapper), total: Number(countRows[0]?.total ?? 0) }
  }

  private async getSimpleContent<T>(_table: string, mapper: (row: DbRow) => T, slug: string, select: string): Promise<T | null> {
    const [rows] = await this.db.execute<DbRow[]>(`${select} WHERE x.slug=? AND x.is_published=TRUE LIMIT 1`, [slug])
    return rows[0] ? mapper(rows[0]) : null
  }

  async getPage(slug: string) {
    const [rows] = await this.db.execute<DbRow[]>(
      `SELECT slug, title, description, content_json, updated_at FROM content_pages WHERE slug=? AND is_published=TRUE LIMIT 1`, [slug]
    )
    if (!rows[0]) return null
    return { slug: rows[0].slug, title: rows[0].title, description: rows[0].description, content: parseJson(rows[0].content_json, {}), updatedAt: rows[0].updated_at }
  }

  async getHome() {
    const [categories, comparisons, bestPicks, troubleshooting, settings, statsRows] = await Promise.all([
      this.listCategories(),
      this.listComparisons({ page: 1, limit: 3, sort: 'rank' }),
      this.listBestPicks({ page: 1, limit: 8, sort: 'rank' }),
      this.listTroubleshooting({ page: 1, limit: 3, sort: 'popular' }),
      this.db.query<DbRow[]>(`SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('home','methodology')`),
      this.db.query<DbRow[]>(`
        SELECT
          (SELECT COUNT(*) FROM products WHERE is_published = TRUE) AS products_researched,
          (SELECT COUNT(*) FROM categories WHERE is_published = TRUE) AS product_categories,
          (SELECT COUNT(*) FROM comparisons WHERE is_published = TRUE) AS comparisons_published,
          (SELECT COUNT(*) FROM guides WHERE is_published = TRUE) AS guides_published
      `)
    ])
    const settingMap = Object.fromEntries(settings[0].map((row) => [String(row.setting_key), parseJson(row.setting_value, {})]))
    const stats = statsRows[0][0]
    return {
      hero: settingMap.home ?? {},
      stats: {
        productsResearched: Number(stats?.products_researched ?? 0),
        productCategories: Number(stats?.product_categories ?? 0),
        comparisonsPublished: Number(stats?.comparisons_published ?? 0),
        guidesPublished: Number(stats?.guides_published ?? 0)
      },
      methodology: settingMap.methodology ?? [],
      categories,
      comparisons: comparisons.items,
      bestPicks: bestPicks.items,
      troubleshooting: troubleshooting.items
    }
  }
}
