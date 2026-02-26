import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const { Pool } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  console.error('Copy .env.example to .env and fill in your connection string.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

console.log('Running migrations...');

try {
  await pool.query(schema);
  console.log('Migrations complete.');
} catch (err) {
  console.error('Migration failed:', err.message);
  process.exit(1);
} finally {
  await pool.end();
}
