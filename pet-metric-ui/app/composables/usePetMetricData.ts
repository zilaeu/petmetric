export type IconName = 'litter' | 'feeder' | 'tracker' | 'camera' | 'arrow' | 'external' | 'check' | 'search' | 'menu' | 'close' | 'shield' | 'source' | 'refresh' | 'wrench' | 'scale' | 'clock' | 'mail' | 'target'

export interface Category {
  slug: string
  name: string
  shortName: string
  description: string
  eyebrow: string
  icon: IconName
  count: number
  color: string
}

export interface ResearchItem {
  slug: string
  title: string
  excerpt: string
  type: 'Review' | 'Comparison' | 'Best pick' | 'Troubleshooting'
  category: string
  readTime: string
  checkedAt: string
  imageKey?: string
  accent: string
}

export function articleHref(item: ResearchItem) {
  if (item.type === 'Comparison') return `/comparisons/${item.slug}`
  if (item.type === 'Best pick') return `/best-picks/${item.slug}`
  if (item.type === 'Troubleshooting') return `/troubleshooting/${item.slug}`
  return `/reviews/${item.slug}`
}
