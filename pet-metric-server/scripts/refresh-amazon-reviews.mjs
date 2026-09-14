import 'dotenv/config'
import mysql from 'mysql2/promise'

const CDP_URL = process.env.CHROME_CDP_URL || 'http://127.0.0.1:9223'
const SAMPLE_TARGET = 50
const MAX_PAGES = 10

const topicDefinitions = {
  'automatic-litter-boxes': [
    ['Cleaning and daily upkeep', /clean|wash|wipe|drawer|waste|scoop|maintenance/i],
    ['Odor control', /odor|odour|smell|stink/i],
    ['Cat fit and acceptance', /cat|kitten|large|small|fit|space|enter|use it/i],
    ['Safety and sensors', /safe|sensor|pinch|stop|detect|weight/i],
    ['Noise', /noise|noisy|quiet|loud|sound/i],
    ['Reliability', /reliable|broke|broken|fail|stuck|jam|error|month|year/i],
    ['App and connectivity', /app|wifi|wi-fi|connect|notification|alert/i],
    ['Litter compatibility and tracking', /litter|track|scatter|clump/i]
  ],
  'gps-pet-trackers': [
    ['Location accuracy and recovery', /gps|location|track|accur|live|find|escape/i],
    ['Coverage and connectivity', /signal|coverage|cell|connect|network|rural|offline/i],
    ['Battery life and charging', /battery|charge|charging|days|power/i],
    ['Collar fit and attachment', /collar|clip|attach|fit|weight|heavy|small|large/i],
    ['Alerts and app experience', /app|alert|notification|fence|zone/i],
    ['Subscription and value', /subscription|plan|fee|cost|price|expensive|value/i],
    ['Durability and water resistance', /durable|broke|lost|water|waterproof|rain|swim/i]
  ],
  'smart-pet-feeders': [
    ['Scheduling and routine', /schedule|meal|time|routine|morning|automatic/i],
    ['Portion control', /portion|amount|serving|cup|overfeed|underfeed/i],
    ['Dispensing and jams', /dispens|jam|stuck|kibble|food|clog/i],
    ['App and Wi-Fi', /app|wifi|wi-fi|connect|notification|remote/i],
    ['Cleaning and bowl design', /clean|wash|bowl|stainless|dish/i],
    ['Noise and voice', /noise|noisy|quiet|loud|voice|speaker|sound/i],
    ['Power and backup', /battery|power|outage|cord|backup/i],
    ['Pet-proof storage', /lid|lock|secure|break in|tip|paw|hopper/i],
    ['Reliability', /reliable|broke|broken|fail|motor|month|year/i]
  ],
  'pet-cameras': [
    ['Video and night vision', /video|image|picture|camera|resolution|night vision|clear/i],
    ['Alerts and detection', /alert|detect|motion|tracking|notification|ai/i],
    ['Connection reliability', /wifi|wi-fi|connect|offline|disconnect|lag|network/i],
    ['App and setup', /app|setup|install|pair|interface/i],
    ['Audio and treat features', /audio|speaker|talk|voice|treat|dispens/i],
    ['Subscription and storage', /subscription|plan|cloud|storage|sd card|fee|cost/i],
    ['Privacy and security', /privacy|secure|security|hack|account/i],
    ['Reliability', /reliable|broke|broken|fail|month|year/i]
  ],
  'smart-water-fountains': [
    ['Cleaning and hygiene', /clean|wash|slime|mold|hygiene|dishwasher/i],
    ['Noise and pump sound', /noise|noisy|quiet|loud|pump|sound/i],
    ['Filters and ongoing cost', /filter|replace|replacement|cost|price/i],
    ['Capacity and refilling', /capacity|water|refill|empty|tank|level/i],
    ['Pet acceptance', /cat|dog|pet|drink|accept|use it/i],
    ['App and hydration tracking', /app|wifi|wi-fi|track|notification|hydration|drink/i],
    ['Battery and cordless use', /battery|charge|cord|cordless|power/i],
    ['Reliability and leaks', /reliable|broke|broken|fail|leak|month|year/i]
  ]
}

function parseDate(text) {
  const match = String(text || '').match(/\bon\s+([A-Z][a-z]+\s+\d{1,2},\s+\d{4})/)
  if (!match) return null
  const date = new Date(`${match[1]} 12:00:00 UTC`)
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10)
}

function classifyReviews(categorySlug, reviews) {
  const definitions = topicDefinitions[categorySlug] || []
  const topics = definitions.map(([label, pattern]) => ({ label, pattern, positive: 0, neutral: 0, concern: 0, total: 0 }))
  for (const review of reviews) {
    const text = `${review.title || ''} ${review.body || ''}`
    for (const topic of topics) {
      if (!topic.pattern.test(text)) continue
      topic.total += 1
      if (review.rating >= 4) topic.positive += 1
      else if (review.rating <= 2) topic.concern += 1
      else topic.neutral += 1
    }
  }
  return topics
}

function buildSummary(product, reviews, capturedDate) {
  const positiveRatings = reviews.filter((review) => review.rating >= 4).length
  const neutralRatings = reviews.filter((review) => review.rating === 3).length
  const lowRatings = reviews.filter((review) => review.rating > 0 && review.rating <= 2).length
  const topics = classifyReviews(product.category_slug, reviews)
  const positiveTopics = [...topics].filter((topic) => topic.positive > 0).sort((a, b) => b.positive - a.positive || b.total - a.total).slice(0, 3)
  const concernTopics = [...topics].filter((topic) => topic.concern > 0).sort((a, b) => b.concern - a.concern || b.total - a.total).slice(0, 3)
  const themes = [
    ...positiveTopics.map((topic) => ({
      label: topic.label,
      mentions: topic.positive,
      kind: 'positive',
      detail: `${topic.positive} of ${reviews.length} recent reviews mention this area in a 4–5 star experience${topic.concern ? `; ${topic.concern} lower-rated ${topic.concern === 1 ? 'review describes' : 'reviews describe'} friction in the same area` : ''}.`
    })),
    ...concernTopics.map((topic) => ({
      label: topic.label,
      mentions: topic.concern,
      kind: 'concern',
      detail: `${topic.concern} of ${reviews.length} recent reviews mention this area in a 1–2 star experience${topic.positive ? `, while ${topic.positive} positive ${topic.positive === 1 ? 'review reports' : 'reviews report'} a better result` : ''}.`
    }))
  ]
  if (!positiveTopics.length && positiveRatings) themes.unshift({
    label: 'Positive recent ratings', mentions: positiveRatings, kind: 'positive',
    detail: `${positiveRatings} of ${reviews.length} recent reviews give the product 4 or 5 stars, without one category-specific topic recurring enough to lead the sample.`
  })
  if (!concernTopics.length && lowRatings) themes.push({
    label: 'Lower-rated recent experiences', mentions: lowRatings, kind: 'concern',
    detail: `${lowRatings} of ${reviews.length} recent reviews give the product 1 or 2 stars; read the linked source for product- and variant-specific context.`
  })
  const positiveFocus = positiveTopics.map((topic) => topic.label.toLowerCase()).join(', ') || 'the overall ownership experience'
  const concernFocus = concernTopics.map((topic) => topic.label.toLowerCase()).join(', ') || 'no single recurring category-specific issue'
  const summary = `Across the latest ${reviews.length} Amazon customer reviews, ${positiveRatings} are 4–5 star, ${neutralRatings} are 3-star, and ${lowRatings} are 1–2 star. Positive feedback most often touches on ${positiveFocus}; lower-rated feedback most often touches on ${concernFocus}.`
  const dates = reviews.map((review) => review.reviewedAt).filter(Boolean).sort()
  const newest = dates.at(-1) || null
  const oldest = dates[0] || null
  const complete = reviews.length < SAMPLE_TARGET
  const sampleNote = complete
    ? `Based on all ${reviews.length} reviews available through Amazon.com's newest-first review pages on ${capturedDate}, because fewer than ${SAMPLE_TARGET} were available.${newest && oldest ? ` The visible sample spans ${oldest} to ${newest}.` : ''} Listings may combine variants, so confirm the variant named in individual reviews.`
    : `Based on the latest ${SAMPLE_TARGET} reviews on Amazon.com, ordered newest first and captured on ${capturedDate}.${newest && oldest ? ` The sample spans ${oldest} to ${newest}.` : ''} Listings may combine variants, so confirm the variant named in individual reviews.`
  return {
    summary,
    positives: positiveTopics.map((topic) => `${topic.positive} recent positive ${topic.positive === 1 ? 'review mentions' : 'reviews mention'} ${topic.label.toLowerCase()}.`),
    concerns: concernTopics.map((topic) => `${topic.concern} recent 1–2 star ${topic.concern === 1 ? 'review mentions' : 'reviews mention'} ${topic.label.toLowerCase()}.`),
    themes,
    sampleNote,
    newest,
    oldest
  }
}

async function connectCdp() {
  const targets = await (await fetch(`${CDP_URL}/json/list`)).json()
  const page = targets.find((target) => target.type === 'page')
  if (!page) throw new Error('No Chrome page target is available through CDP')
  const socket = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
  let nextId = 1
  const pending = new Map()
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (!message.id || !pending.has(message.id)) return
    const handler = pending.get(message.id)
    pending.delete(message.id)
    message.error ? handler.reject(new Error(JSON.stringify(message.error))) : handler.resolve(message.result)
  }
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = nextId++
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
  await send('Page.enable')
  return { socket, send }
}

async function waitForReviews(send) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const result = await send('Runtime.evaluate', {
      expression: `JSON.stringify({ready:document.readyState, count:document.querySelectorAll('[data-hook="review"]').length, title:document.title})`,
      returnByValue: true
    })
    const state = JSON.parse(result.result.value || '{}')
    if (state.ready === 'complete' && (state.count > 0 || /sign in/i.test(state.title))) return state
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  return { ready: false, count: 0 }
}

async function scrapePage(send, url) {
  await send('Page.navigate', { url })
  await waitForReviews(send)
  const result = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      title: document.title,
      hasNext: Boolean(document.querySelector('li.a-last:not(.a-disabled) a')),
      overallRating: Number((document.querySelector('[data-hook="rating-out-of-text"]')?.textContent || '').match(/[0-9.]+/)?.[0] || 0) || null,
      totalReviewCount: Number((document.querySelector('[data-hook="total-review-count"]')?.textContent || '').replace(/[^0-9]/g, '')) || null,
      reviews: [...document.querySelectorAll('[data-hook="review"]')].map((node) => ({
        id: node.id || node.getAttribute('data-review-id'),
        ratingText: node.querySelector('[data-hook="review-star-rating"], [data-hook="cmps-review-star-rating"]')?.textContent?.trim() || '',
        title: node.querySelector('[data-hook="review-title"] span:not(.a-icon-alt)')?.textContent?.trim() || '',
        dateText: node.querySelector('[data-hook="review-date"]')?.textContent?.trim() || '',
        body: node.querySelector('[data-hook="review-body"]')?.textContent?.trim() || '',
        variant: node.querySelector('[data-hook="format-strip"]')?.textContent?.trim() || '',
        verified: Boolean(node.querySelector('[data-hook="avp-badge"]'))
      }))
    })`,
    returnByValue: true
  })
  return JSON.parse(result.result.value || '{}')
}

const db = await mysql.createConnection({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  database: process.env.MYSQL_DATABASE || 'pet_metric',
  user: process.env.MYSQL_USER || 'pet_metric',
  password: process.env.MYSQL_PASSWORD || '',
  charset: 'utf8mb4'
})
const { socket, send } = await connectCdp()
const capturedDate = new Date().toISOString().slice(0, 10)

try {
  const [products] = await db.query(`
    SELECT DISTINCT p.id, p.slug, p.name, p.external_id, c.slug category_slug
    FROM products p
    JOIN categories c ON c.id=p.category_id
    JOIN (
      SELECT product_a_id product_id FROM comparisons WHERE is_published=TRUE
      UNION
      SELECT product_b_id product_id FROM comparisons WHERE is_published=TRUE
    ) compared ON compared.product_id=p.id
    WHERE p.external_id REGEXP '^B[A-Z0-9]{9}$'
    ORDER BY p.id
  `)

  for (const product of products) {
    const seen = new Set()
    const reviews = []
    let listingRating = null
    let listingReviewCount = null
    const sourceUrl = `https://www.amazon.com/product-reviews/${product.external_id}/?sortBy=recent&reviewerType=all_reviews&pageNumber=1`

    for (let page = 1; page <= MAX_PAGES && reviews.length < SAMPLE_TARGET; page += 1) {
      const url = `https://www.amazon.com/product-reviews/${product.external_id}/?sortBy=recent&reviewerType=all_reviews&pageNumber=${page}`
      const snapshot = await scrapePage(send, url)
      if (/sign in/i.test(snapshot.title || '')) throw new Error(`Amazon requested sign-in for ${product.slug}`)
      listingRating ||= snapshot.overallRating
      listingReviewCount ||= snapshot.totalReviewCount
      let added = 0
      for (const item of snapshot.reviews || []) {
        const key = item.id || `${item.dateText}|${item.title}|${item.body}`
        if (!key || seen.has(key) || !item.body) continue
        seen.add(key)
        reviews.push({
          id: key,
          rating: Number(String(item.ratingText).match(/[0-9.]+/)?.[0] || 0) || null,
          title: item.title || null,
          body: item.body,
          reviewedAt: parseDate(item.dateText),
          variant: item.variant || null,
          verified: Boolean(item.verified),
          sourceUrl: url
        })
        added += 1
        if (reviews.length >= SAMPLE_TARGET) break
      }
      // Amazon's current review page can ignore pageNumber and repeat the
      // same featured set. Keep requesting pages until we either reach the
      // target or prove that pagination is not returning new review IDs.
      if (added === 0) break
    }

    const datedReviews = reviews.filter((review) => review.reviewedAt)
    const newestFirst = datedReviews.every((review, index) => index === 0 || String(datedReviews[index - 1].reviewedAt) >= String(review.reviewedAt))
    const allAvailable = listingReviewCount !== null && listingReviewCount <= reviews.length
    if ((!allAvailable && reviews.length < SAMPLE_TARGET) || !newestFirst) {
      console.warn(`${product.slug}: Amazon did not expose a verifiable newest-first sample (received ${reviews.length}; listing count ${listingReviewCount ?? 'unknown'}); existing summary left unchanged`)
      continue
    }
    reviews.sort((a, b) => String(b.reviewedAt || '').localeCompare(String(a.reviewedAt || '')))
    const selected = reviews.slice(0, SAMPLE_TARGET)
    if (!selected.length) {
      console.warn(`${product.slug}: no readable recent reviews; existing summary left unchanged`)
      continue
    }
    const generated = buildSummary(product, selected, capturedDate)
    await db.beginTransaction()
    try {
      await db.execute('DELETE FROM product_user_reviews WHERE product_id=?', [product.id])
      for (const review of selected) {
        await db.execute(`
          INSERT INTO product_user_reviews
            (product_id,source_name,source_review_id,source_url,rating,title,body,reviewed_at,variant,verified_purchase,captured_at)
          VALUES (?,'Amazon.com',?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)
        `, [product.id, review.id, review.sourceUrl, review.rating, review.title, review.body, review.reviewedAt, review.variant, review.verified])
      }
      await db.execute(`
        INSERT INTO product_user_review_summaries
          (product_id,source_name,source_url,checked_at,rating,review_count,visible_review_count,
           sample_method,sample_target_count,sample_newest_review_at,sample_oldest_review_at,generated_at,
           rating_distribution_json,summary,positives_json,concerns_json,themes_json,sample_note)
        VALUES (?,'Amazon.com',?,?,?,?,?,'latest_desc',?,?,?,?,NULL,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          source_name=VALUES(source_name),source_url=VALUES(source_url),checked_at=VALUES(checked_at),
          rating=VALUES(rating),review_count=VALUES(review_count),visible_review_count=VALUES(visible_review_count),
          sample_method=VALUES(sample_method),sample_target_count=VALUES(sample_target_count),
          sample_newest_review_at=VALUES(sample_newest_review_at),sample_oldest_review_at=VALUES(sample_oldest_review_at),
          generated_at=VALUES(generated_at),rating_distribution_json=VALUES(rating_distribution_json),
          summary=VALUES(summary),positives_json=VALUES(positives_json),concerns_json=VALUES(concerns_json),
          themes_json=VALUES(themes_json),sample_note=VALUES(sample_note)
      `, [
        product.id, sourceUrl, capturedDate, listingRating, listingReviewCount, selected.length,
        SAMPLE_TARGET, generated.newest, generated.oldest, new Date(), generated.summary,
        JSON.stringify(generated.positives), JSON.stringify(generated.concerns), JSON.stringify(generated.themes), generated.sampleNote
      ])
      await db.commit()
      console.log(`${product.slug}: saved ${selected.length} newest reviews (${generated.oldest || 'unknown'} to ${generated.newest || 'unknown'})`)
    } catch (error) {
      await db.rollback()
      throw error
    }
  }
} finally {
  socket.close()
  await db.end()
}
