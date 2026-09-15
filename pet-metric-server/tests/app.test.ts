import { describe, expect, it, vi } from 'vitest'
import { buildApp, type ContentRepositoryLike } from '../src/app.js'

function repository(): ContentRepositoryLike {
  return {
    ping: vi.fn(async () => undefined),
    getHome: vi.fn(async () => ({
      hero: {},
      stats: { productsResearched: 0, productCategories: 0, comparisonsPublished: 0, guidesPublished: 0 },
      methodology: {},
      categories: [],
      comparisons: [],
      bestPicks: [],
      troubleshooting: []
    })),
    listCategories: vi.fn(async () => [{ slug: 'pet-cameras', title: 'Pet Cameras' }] as never),
    getCategory: vi.fn(async (slug: string) => slug === 'pet-cameras' ? ({ slug } as never) : null),
    listProducts: vi.fn(async () => ({ items: [{ slug: 'furbo-360' }] as never, total: 1 })),
    getProduct: vi.fn(async () => null),
    listComparisons: vi.fn(async () => ({ items: [] as never, total: 0 })),
    getComparison: vi.fn(async () => null),
    listBestPicks: vi.fn(async () => ({ items: [] as never, total: 0 })),
    getBestPick: vi.fn(async () => null),
    listGuides: vi.fn(async () => ({ items: [] as never, total: 0 })),
    getGuide: vi.fn(async () => null),
    listTroubleshooting: vi.fn(async () => ({ items: [] as never, total: 0 })),
    getTroubleshooting: vi.fn(async () => null),
    getPage: vi.fn(async () => null)
  }
}

describe('PetMetricus API', () => {
  it('returns database health', async () => {
    const app = await buildApp({ repository: repository(), logger: false })
    const response = await app.inject({ method: 'GET', url: '/health' })
    expect(response.statusCode).toBe(200)
    expect(response.json().data.database).toBe('up')
    await app.close()
  })

  it('returns pagination metadata', async () => {
    const app = await buildApp({ repository: repository(), logger: false })
    const response = await app.inject({ method: 'GET', url: '/api/v1/products?page=1&limit=12' })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({ meta: { page: 1, limit: 12, total: 1, totalPages: 1 } })
    await app.close()
  })

  it('rejects invalid pagination', async () => {
    const app = await buildApp({ repository: repository(), logger: false })
    const response = await app.inject({ method: 'GET', url: '/api/v1/products?page=0' })
    expect(response.statusCode).toBe(400)
    expect(response.json().error.code).toBe('VALIDATION_ERROR')
    await app.close()
  })

  it('returns a stable 404 envelope', async () => {
    const app = await buildApp({ repository: repository(), logger: false })
    const response = await app.inject({ method: 'GET', url: '/api/v1/products/does-not-exist' })
    expect(response.statusCode).toBe(404)
    expect(response.json().error).toMatchObject({ code: 'NOT_FOUND', message: 'Product not found' })
    await app.close()
  })
})
