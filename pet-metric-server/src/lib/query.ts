import { z } from 'zod'

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().trim().min(1).max(100).optional(),
  search: z.string().trim().max(100).optional(),
  sort: z.enum(['rank', 'price_asc', 'price_desc', 'score_desc', 'popular', 'newest']).default('rank'),
  maxPrice: z.coerce.number().min(0).optional(),
  catCount: z.string().trim().min(1).max(100).optional(),
  litterType: z.string().trim().min(1).max(100).optional(),
  app: z.string().trim().min(1).max(100).optional(),
  featured: z.enum(['true', 'false']).transform((value) => value === 'true').optional()
})

export type ListQuery = z.infer<typeof listQuerySchema>

export function pageMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
}

export function parseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'object') return value as T
  try {
    return JSON.parse(String(value)) as T
  } catch {
    return fallback
  }
}
