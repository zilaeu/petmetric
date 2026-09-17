const staticPaths = [
  '/', '/products/', '/comparisons/', '/best-picks/', '/troubleshooting/',
  '/guides/', '/about/', '/editorial-standards/', '/disclosure/', '/privacy/', '/contact/'
]
const seoReleaseDate = '2026-09-17'

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

const exactDate = (...values: unknown[]) => {
  for (const value of values) {
    const match = String(value || '').match(/^(\d{4}-\d{2}-\d{2})/)
    if (match) return match[1]
  }
  return seoReleaseDate
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const requestOrigin = getRequestURL(event).origin
  const configuredOrigin = String(config.public.siteUrl || '').replace(/\/$/, '')
  // Never publish local/dev hosts in a sitemap. Production is configured via
  // NUXT_PUBLIC_SITE_URL; the safe fallback keeps sitemap URLs indexable even
  // when that variable is missing during a preview build.
  const origin = configuredOrigin && !configuredOrigin.includes('localhost')
    ? configuredOrigin
    : (requestOrigin.includes('localhost') || requestOrigin.includes('127.0.0.1') ? 'https://petmetricus.com' : requestOrigin)
  const apiBase = String(config.public.apiBase || '')
  const paths = new Map(staticPaths.map(path => [path, seoReleaseDate]))

  const endpoints = ['categories', 'products?limit=100', 'comparisons?limit=100', 'best-picks?limit=100', 'troubleshooting?limit=100', 'guides?limit=100']
  const results = await Promise.allSettled(endpoints.map(endpoint => $fetch<any>(endpoint, {
    baseURL: apiBase,
    retry: 1,
    timeout: 5000
  })))

  const values = results.map(result => result.status === 'fulfilled' ? (result.value?.data || []) : [])
  for (const category of values[0]) if (category.slug) paths.set(`/products/${category.slug}/`, exactDate(category.updatedAt, category.checkedAt))
  for (const product of values[1]) if (product.slug) paths.set(`/reviews/${product.slug}/`, exactDate(product.review?.researchDate, product.commerceCheckedAt, product.updatedAt))
  for (const item of values[2]) if (item.href) paths.set(item.href, exactDate(item.checkedAt, item.updatedAt))
  for (const item of values[3]) if (item.href) paths.set(item.href, exactDate(item.checkedAt, item.updatedAt))
  for (const item of values[4]) if (item.href) paths.set(item.href, exactDate(item.checkedAt, item.updatedAt))
  for (const item of values[5]) if (item.href) paths.set(item.href, exactDate(item.checkedAt, item.updatedAt))

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...paths]
    .map(([path, lastmod]) => `  <url><loc>${escapeXml(new URL(path, `${origin}/`).toString())}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
})
