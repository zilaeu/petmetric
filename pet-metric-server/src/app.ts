import Fastify, { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { ZodError, z } from 'zod'
import { env } from './config/env.js'
import { getPool } from './db/pool.js'
import { HttpError, NotFoundError } from './lib/http-error.js'
import { listQuerySchema, pageMeta } from './lib/query.js'
import { ContentRepository } from './repositories/content-repository.js'
import { AdminRepository } from './repositories/admin-repository.js'

const slugParamsSchema = z.object({ slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180) })

export type ContentRepositoryLike = Pick<ContentRepository,
  'ping' | 'getHome' | 'listCategories' | 'getCategory' | 'listProducts' | 'getProduct' |
  'listComparisons' | 'getComparison' | 'listBestPicks' | 'getBestPick' | 'listGuides' |
  'getGuide' | 'listTroubleshooting' | 'getTroubleshooting' | 'getPage'
>

export interface BuildAppOptions {
  repository?: ContentRepositoryLike
  logger?: boolean
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const loggerEnabled = options.logger ?? env.NODE_ENV !== 'test'
  const app = Fastify({
    logger: loggerEnabled ? { level: env.LOG_LEVEL } : false,
    trustProxy: true,
    requestIdHeader: 'x-request-id'
  })
  const repository = options.repository ?? new ContentRepository(getPool())
  const adminRepository = new AdminRepository(getPool())
  const requireAdmin = async (request: { headers: Record<string, unknown> }, reply: { status: (code: number) => { send: (payload: unknown) => unknown } }) => {
    if (request.headers.authorization === `Bearer ${env.ADMIN_TOKEN}`) return
    return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'A valid admin token is required' } })
  }

  await app.register(helmet, { contentSecurityPolicy: false })
  await app.register(cors, {
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true)
      callback(new Error('Origin is not allowed by CORS'), false)
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    maxAge: 86400
  })

  app.addHook('onSend', async (request, reply) => {
    reply.header('Cache-Control', request.url.startsWith('/api/v1/admin/')
      ? 'no-store'
      : 'public, max-age=60, stale-while-revalidate=300')
  })

  app.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      error: { code: 'ROUTE_NOT_FOUND', message: `Route ${request.method} ${request.url} not found`, requestId: request.id }
    })
  })

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: { code: 'VALIDATION_ERROR', message: 'Invalid request parameters', details: error.flatten(), requestId: request.id }
      })
    }
    if (error instanceof HttpError) {
      return reply.status(error.statusCode).send({
        error: { code: error.code, message: error.message, details: error.details, requestId: request.id }
      })
    }
    if (typeof error === 'object' && error !== null && 'statusCode' in error && typeof error.statusCode === 'number' && error.statusCode >= 400 && error.statusCode < 500) {
      return reply.status(error.statusCode).send({
        error: { code: 'BAD_REQUEST', message: 'message' in error ? String(error.message) : 'Invalid request', requestId: request.id }
      })
    }
    request.log.error({ err: error }, 'Unhandled request error')
    return reply.status(500).send({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred', requestId: request.id }
    })
  })

  app.get('/health', async (_request, reply) => {
    reply.header('Cache-Control', 'no-store')
    try {
      await repository.ping()
      return { data: { status: 'ok', database: 'up', timestamp: new Date().toISOString() } }
    } catch (error) {
      app.log.error({ err: error }, 'Database health check failed')
      return reply.status(503).send({ data: { status: 'degraded', database: 'down', timestamp: new Date().toISOString() } })
    }
  })

  app.get('/api/v1/home', async () => ({ data: await repository.getHome() }))

  app.get('/api/v1/categories', async () => ({ data: await repository.listCategories() }))
  app.get('/api/v1/categories/:slug', async (request) => {
    const { slug } = slugParamsSchema.parse(request.params)
    const item = await repository.getCategory(slug)
    if (!item) throw new NotFoundError('Category')
    return { data: item }
  })

  app.get('/api/v1/products', async (request) => {
    const query = listQuerySchema.parse(request.query)
    const result = await repository.listProducts(query)
    return { data: result.items, meta: pageMeta(result.total, query.page, query.limit) }
  })
  app.get('/api/v1/categories/:slug/products', async (request) => {
    const { slug } = slugParamsSchema.parse(request.params)
    if (!await repository.getCategory(slug)) throw new NotFoundError('Category')
    const query = listQuerySchema.parse({ ...(request.query as object), category: slug })
    const result = await repository.listProducts(query)
    return { data: result.items, meta: pageMeta(result.total, query.page, query.limit) }
  })
  app.get('/api/v1/products/:slug', async (request) => {
    const { slug } = slugParamsSchema.parse(request.params)
    const item = await repository.getProduct(slug)
    if (!item) throw new NotFoundError('Product')
    return { data: item }
  })

  app.get('/api/v1/comparisons', async (request) => {
    const query = listQuerySchema.parse(request.query)
    const result = await repository.listComparisons(query)
    return { data: result.items, meta: pageMeta(result.total, query.page, query.limit) }
  })
  app.get('/api/v1/comparisons/:slug', async (request) => {
    const { slug } = slugParamsSchema.parse(request.params)
    const item = await repository.getComparison(slug)
    if (!item) throw new NotFoundError('Comparison')
    return { data: item }
  })

  app.get('/api/v1/best-picks', async (request) => {
    const query = listQuerySchema.parse(request.query)
    const result = await repository.listBestPicks(query)
    return { data: result.items, meta: pageMeta(result.total, query.page, query.limit) }
  })
  app.get('/api/v1/best-picks/:slug', async (request) => {
    const { slug } = slugParamsSchema.parse(request.params)
    const item = await repository.getBestPick(slug)
    if (!item) throw new NotFoundError('Best pick')
    return { data: item }
  })

  app.get('/api/v1/guides', async (request) => {
    const query = listQuerySchema.parse(request.query)
    const result = await repository.listGuides(query)
    return { data: result.items, meta: pageMeta(result.total, query.page, query.limit) }
  })
  app.get('/api/v1/guides/:slug', async (request) => {
    const { slug } = slugParamsSchema.parse(request.params)
    const item = await repository.getGuide(slug)
    if (!item) throw new NotFoundError('Guide')
    return { data: item }
  })

  app.get('/api/v1/troubleshooting', async (request) => {
    const query = listQuerySchema.parse(request.query)
    const result = await repository.listTroubleshooting(query)
    return { data: result.items, meta: pageMeta(result.total, query.page, query.limit) }
  })
  app.get('/api/v1/troubleshooting/:slug', async (request) => {
    const { slug } = slugParamsSchema.parse(request.params)
    const item = await repository.getTroubleshooting(slug)
    if (!item) throw new NotFoundError('Troubleshooting guide')
    return { data: item }
  })

  app.get('/api/v1/pages/:slug', async (request) => {
    const { slug } = slugParamsSchema.parse(request.params)
    const item = await repository.getPage(slug)
    if (!item) throw new NotFoundError('Page')
    return { data: item }
  })

  const adminResourceSchema = z.object({ resource: z.enum(['categories','category-criteria','products','product-specs','reviews','comparisons','comparison-audiences','comparison-criteria','best-picks','guides','troubleshooting','troubleshooting-steps','pages','settings']) })
  const adminItemSchema = z.object({ resource: adminResourceSchema.shape.resource, id: z.string().min(1).max(180) })
  const adminBodySchema = z.record(z.unknown())

  app.get('/api/v1/admin/resources', { preHandler: requireAdmin }, async () => ({ data: adminRepository.getResources() }))
  app.get('/api/v1/admin/overview', { preHandler: requireAdmin }, async () => ({ data: await adminRepository.overview() }))
  app.get('/api/v1/admin/options', { preHandler: requireAdmin }, async () => ({ data: await adminRepository.options() }))
  app.get('/api/v1/admin/:resource', { preHandler: requireAdmin }, async (request) => {
    const { resource } = adminResourceSchema.parse(request.params)
    const search = z.object({ search: z.string().max(120).optional() }).parse(request.query).search ?? ''
    return { data: await adminRepository.list(resource, search) }
  })
  app.post('/api/v1/admin/:resource', { preHandler: requireAdmin }, async (request, reply) => {
    const { resource } = adminResourceSchema.parse(request.params)
    const item = await adminRepository.create(resource, adminBodySchema.parse(request.body))
    return reply.status(201).send({ data: item })
  })
  app.put('/api/v1/admin/:resource/:id', { preHandler: requireAdmin }, async (request) => {
    const { resource, id } = adminItemSchema.parse(request.params)
    return { data: await adminRepository.update(resource, id, adminBodySchema.parse(request.body)) }
  })
  app.delete('/api/v1/admin/:resource/:id', { preHandler: requireAdmin }, async (request) => {
    const { resource, id } = adminItemSchema.parse(request.params)
    return { data: await adminRepository.archive(resource, id) }
  })

  return app
}
