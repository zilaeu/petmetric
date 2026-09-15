import { readFile, writeFile } from 'node:fs/promises'

const baseUrl = String(process.env.PETMETRIC_CONTENT_API || 'http://localhost:4000/api/v1').replace(/\/$/, '')
const outputUrl = new URL('../server/data/content.json', import.meta.url)

async function request(path) {
  const response = await fetch(`${baseUrl}${path}`)
  if (!response.ok) throw new Error(`${path} returned ${response.status}`)
  const body = await response.json()
  return body.data
}

async function list(path) {
  const data = await request(`${path}?limit=100`)
  if (!Array.isArray(data)) throw new Error(`${path} did not return a list`)
  return data
}

const previous = JSON.parse(await readFile(outputUrl, 'utf8'))
const previousResearch = new Map((previous.research || []).map(item => [item.slug, item]))

const [categories, productList, comparisons, bestPicks, guides, troubleshooting, pages] = await Promise.all([
  list('/categories'),
  list('/products'),
  list('/comparisons'),
  list('/best-picks'),
  list('/guides'),
  list('/troubleshooting'),
  Promise.all(['about', 'contact', 'privacy'].map(slug => request(`/pages/${slug}`)))
])

const products = await Promise.all(productList.map(product => request(`/products/${product.slug}`)))
const productsBySlug = new Map(products.map(product => [product.slug, product]))

for (const product of products) {
  const asin = /^B[A-Z0-9]{9}$/.test(String(product.id || '')) ? String(product.id) : null
  product.asin = asin
  product.externalId = asin
  product.amazonVerified = Boolean(product.amazonVerified && asin && product.merchantUrl === `https://www.amazon.com/dp/${asin}`)
  product.sourceFacts = [
    ...(asin ? [{ key: 'asin', label: 'ASIN', value: asin }] : []),
    ...(product.merchantUrl ? [{ key: 'source_url', label: 'Amazon.com listing', value: product.merchantUrl }] : []),
    ...(product.commerceCheckedAt ? [{ key: 'checked_at', label: 'Listing checked', value: String(product.commerceCheckedAt) }] : []),
    ...(product.specDetails || []).map(fact => ({ key: fact.key || null, label: fact.label || 'Listing fact', value: String(fact.value || '') })).filter(fact => fact.value)
  ]
  product.availabilityStatus = product.availability ? 'captured' : 'not-captured'
}

function comparisonItem(item) {
  const authored = item.content && typeof item.content === 'object' ? item.content : {}
  const previousItem = previousResearch.get(item.slug) || {}
  const previousAuthored = previousItem.content && typeof previousItem.content === 'object' ? previousItem.content : {}
  const comparisonType = authored.comparisonType || authored.matchLabel || previousItem.comparisonType || previousItem.matchLabel || item.comparisonType || 'Direct alternative'
  return {
    ...item,
    type: 'Comparison',
    comparisonType,
    matchType: authored.matchType || previousItem.matchType || null,
    matchLabel: authored.matchLabel || previousItem.matchLabel || comparisonType,
    whyCompare: authored.whyCompare || item.whyCompare || previousItem.whyCompare || '',
    scope: authored.scope || previousAuthored.scope || previousItem.scope || '',
    controversy: authored.controversy || previousAuthored.controversy || previousItem.controversy || '',
    decisionRule: authored.decisionRule || previousAuthored.decisionRule || previousItem.decisionRule || '',
    scopeNote: authored.scope || previousAuthored.scope || item.scopeNote || authored.whyCompare || previousItem.whyCompare || '',
    content: { ...previousAuthored, ...authored }
  }
}

function troubleshootingItem(item) {
  const product = productsBySlug.get(item.productSlug)
  const content = item.content && typeof item.content === 'object' ? { ...item.content } : {}
  if ((!Array.isArray(content.sources) || content.sources.length === 0) && product?.merchantUrl) {
    content.sources = [{ label: `${product.name} — checked Amazon.com listing`, url: product.merchantUrl }]
  }
  return { ...item, type: 'Troubleshooting', content }
}

const output = {
  categories,
  products,
  research: [
    ...comparisons.map(comparisonItem),
    ...bestPicks.map(item => ({ ...item, type: 'Best pick' })),
    ...guides.map(item => ({ ...item, type: 'Guide' })),
    ...troubleshooting.map(troubleshootingItem)
  ],
  pages: Object.fromEntries(pages.map(page => [page.slug, page]))
}

await writeFile(outputUrl, JSON.stringify(output))
console.log(`Synced ${categories.length} categories, ${products.length} products, ${output.research.length} research items, and ${pages.length} pages.`)
