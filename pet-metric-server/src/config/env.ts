import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001'),
  MYSQL_HOST: z.string().min(1).default('127.0.0.1'),
  MYSQL_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
  MYSQL_DATABASE: z.string().min(1).default('pet_metric'),
  MYSQL_USER: z.string().min(1).default('pet_metric'),
  MYSQL_PASSWORD: z.string().default(''),
  MYSQL_CONNECTION_LIMIT: z.coerce.number().int().min(1).max(100).default(10),
  ADMIN_TOKEN: z.string().min(16).default('petmetric-local-admin')
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
}
