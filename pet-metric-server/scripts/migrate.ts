import 'dotenv/config'
import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import mysql from 'mysql2/promise'
import { env } from '../src/config/env.js'

const sqlDirectory = resolve(process.cwd(), 'sql')
const files = (await readdir(sqlDirectory)).filter((file) => file.endsWith('.sql')).sort()
const connection = await mysql.createConnection({
  host: env.MYSQL_HOST,
  port: env.MYSQL_PORT,
  database: env.MYSQL_DATABASE,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  charset: 'utf8mb4',
  multipleStatements: true
})

try {
  await connection.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)
  const [rows] = await connection.query<mysql.RowDataPacket[]>('SELECT filename FROM schema_migrations')
  const applied = new Set(rows.map((row) => String(row.filename)))

  for (const file of files) {
    if (applied.has(file)) continue
    const sql = await readFile(resolve(sqlDirectory, file), 'utf8')
    console.log(`Applying ${file}`)
    await connection.beginTransaction()
    try {
      await connection.query(sql)
      await connection.execute('INSERT INTO schema_migrations (filename) VALUES (?)', [file])
      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    }
  }
  console.log('Database is up to date')
} finally {
  await connection.end()
}
