import fs from 'fs'
import path from 'path'
import pool from './client'

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const migrationsDir = path.join(__dirname, '../../../../migrations')
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const { rows } = await pool.query(
      'SELECT id FROM _migrations WHERE filename = $1', [file]
    )
    if (rows.length > 0) {
      console.log(`  skip  ${file}`)
      continue
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    await pool.query(sql)
    await pool.query('INSERT INTO _migrations (filename) VALUES ($1)', [file])
    console.log(`  ran   ${file}`)
  }

  console.log('Migrations complete.')
  await pool.end()
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})