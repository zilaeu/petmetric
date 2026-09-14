export type EvidenceStatus = 'explicit' | 'claim' | 'unclear' | 'unsupported' | 'conflict'
export type ComparisonCriterion = { group?: string; label: string; aVal: string; bVal: string; aStatus?: EvidenceStatus; bStatus?: EvidenceStatus; aSourceUrl?: string | null; bSourceUrl?: string | null; winner: 'a' | 'b' | 'tie' | 'unknown'; edgeLabel?: string; helpText?: string }

export type DesignComparison = {
  a: string
  b: string
  category: string
  categorySlug: string
  verdict: string
  homeVerdict?: string
  bestFor: { who: string; pick: string }[]
  criteria: ComparisonCriterion[]
  productAttributes?: Array<{ key: string; label: string; aVal: string; bVal: string; aStatus?: EvidenceStatus; bStatus?: EvidenceStatus; aSourceUrl?: string | null; bSourceUrl?: string | null; note?: string }>
  views: string
  updated: string
  href: string
  featured?: boolean
  decisionQuestion?: string
  comparisonType?: string
  checkedAt?: string | null
  evidenceConfidence?: 'Limited' | 'Moderate'
  scopeNote?: string
  decisionGaps?: string[]
  products?: Array<{ side: 'a' | 'b'; name: string; brand: string; asin: string | null; variant: string; img: string | null; merchantUrl: string | null; structure: string; dimensions: string; weight: string; capacity: string }>
  userReviewSummaries?: Array<{ side: 'a' | 'b'; productName: string; rating: number | null; reviewCount: number | null; visibleReviewCount: number; checkedAt: string | null; sourceName: string; sourceUrl: string; ratingDistribution: Record<string, number>; summary: string; positives: string[]; concerns: string[]; themes: Array<{ label: string; mentions: number; kind: 'positive' | 'mixed' | 'concern'; detail: string }>; sampleNote: string }>
  userFeedback?: { status: string; summary: string; sampleLimit: string }
  researchConclusion?: { coreFunctionLeader: string; practicalChoice: string; developerLessons: string[]; marketOpportunities: string[] }
}

export type DesignProduct = {
  id: string
  name: string
  brand: string
  slug: string
  img: string
  imageKey: string
  alt: string
  price: number | null
  priceDisplay: string | null
  subscription: string | null
  score: number | null
  amazonRating?: number | null
  amazonReviewCount?: number | null
  availability?: string | null
  commerceCheckedAt?: string | null
  marketplaceDomain?: string | null
  deliveryCountryCode?: string | null
  verdict: string
  bestFor: string
  tags: string[]
  specs: string[]
  specDetails?: Array<{ key: string | null; label: string | null; value: string }>
  filterSpecs?: Record<string, string>
  updated: string
  merchantName: string | null
  merchantUrl: string | null
  featured?: boolean
  rank?: number
}
