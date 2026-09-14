import mysql, { type Pool } from 'mysql2/promise'
import { env } from '../config/env.js'

let pool: Pool | undefined

export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: env.MYSQL_HOST,
      port: env.MYSQL_PORT,
      database: env.MYSQL_DATABASE,
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      connectionLimit: env.MYSQL_CONNECTION_LIMIT,
      waitForConnections: true,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      decimalNumbers: true,
      timezone: 'Z',
      charset: 'utf8mb4'
    })
  }

  return pool
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = undefined
  }
}
