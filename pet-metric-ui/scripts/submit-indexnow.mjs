const siteOrigin = (process.env.SITE_ORIGIN || 'https://petmetricus.com').replace(/\/$/, '')
const key = process.env.INDEXNOW_KEY || '8e0063955785d458a7bf0026c5b42373'
const sitemapUrl = `${siteOrigin}/sitemap.xml`

const sitemapResponse = await fetch(sitemapUrl, {
  headers: { 'user-agent': 'PetMetricus-IndexNow/1.0' }
})

if (!sitemapResponse.ok) {
  throw new Error(`Unable to load sitemap: ${sitemapResponse.status} ${sitemapResponse.statusText}`)
}

const sitemap = await sitemapResponse.text()
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map(([, value]) => value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'"))
  .filter((value) => {
    try {
      return new URL(value).origin === siteOrigin
    } catch {
      return false
    }
  })

if (!urls.length) throw new Error('The sitemap did not contain any valid same-origin URLs')

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(siteOrigin).host,
    key,
    keyLocation: `${siteOrigin}/${key}.txt`,
    urlList: urls
  })
})

if (!response.ok) {
  const detail = await response.text()
  throw new Error(`IndexNow rejected the submission: ${response.status} ${detail}`)
}

console.log(`Submitted ${urls.length} URLs to IndexNow (${response.status})`)
