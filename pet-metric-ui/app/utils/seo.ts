export function seoDescription(value: unknown, fallback = 'Independent pet technology research from PetMetricus.', maxLength = 158) {
  const normalized = String(value || fallback).replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  const shortened = normalized.slice(0, maxLength - 1)
  const lastSpace = shortened.lastIndexOf(' ')
  return `${shortened.slice(0, lastSpace > 90 ? lastSpace : shortened.length).replace(/[,:;\s]+$/, '')}…`
}

export function seoDate(value: unknown) {
  if (!value) return undefined
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10)
}

export function articleJsonLd(options: {
  type?: 'Article' | 'TechArticle'
  title: string
  description: string
  url: string
  dateModified?: unknown
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': options.type || 'Article',
    headline: options.title,
    description: seoDescription(options.description),
    mainEntityOfPage: options.url,
    url: options.url,
    author: { '@type': 'Organization', name: 'PetMetricus', url: 'https://petmetricus.com/about/' },
    publisher: { '@type': 'Organization', name: 'PetMetricus', url: 'https://petmetricus.com/' },
    dateModified: seoDate(options.dateModified),
    image: options.image || undefined
  }
}
