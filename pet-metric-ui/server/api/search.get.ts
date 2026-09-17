import catalog from '../data/content.json'

type AnyRecord = Record<string, any>

export default defineEventHandler((event) => {
  const query = String(getQuery(event).q || '').trim().toLocaleLowerCase('en-US')
  if (query.length < 2) return { data: [] }

  const includes = (...values: unknown[]) => values
    .flatMap(value => Array.isArray(value) ? value : [value])
    .some(value => String(value || '').toLocaleLowerCase('en-US').includes(query))

  const products = (catalog.products as AnyRecord[])
    .filter(item => includes(item.name, item.brand, item.categorySlug, item.specs))
    .slice(0, 4)
    .map(item => ({ type: 'Product', title: item.name, detail: item.brand || item.categorySlug, to: `/reviews/${item.slug}/` }))

  const comparisons = (catalog.research as AnyRecord[])
    .filter(item => item.type === 'Comparison' && includes(item.a, item.b, item.category, item.title))
    .slice(0, 4)
    .map(item => ({ type: 'Comparison', title: item.title || `${item.a} vs ${item.b}`, detail: item.category || '', to: `/comparisons/${item.slug}/` }))

  const troubleshooting = (catalog.research as AnyRecord[])
    .filter(item => item.type === 'Troubleshooting' && includes(item.product, item.problem, item.title, item.description))
    .slice(0, 4)
    .map(item => ({ type: 'Troubleshooting', title: item.problem || item.title, detail: item.product || '', to: `/troubleshooting/${item.slug}/` }))

  setHeader(event, 'cache-control', 'public, max-age=60, s-maxage=300')
  return { data: [...products, ...comparisons, ...troubleshooting] }
})
