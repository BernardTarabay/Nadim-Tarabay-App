import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { config } from '../config/env.js';

/**
 * One query interface over two Postgres engines: Neon (over HTTP, for Vercel) when DATABASE_URL is
 * set, otherwise an embedded PGlite database in .data/ so local development needs no setup.
 */
async function open() {
  if (config.databaseUrl) {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(config.databaseUrl);
    return { engine: 'neon', query: (text, params = []) => sql.query(text, params) };
  }
  if (config.hosted) return null;
  // A variable specifier keeps Vercel's bundler from shipping this dev-only engine.
  const pglite = '@electric-sql/pglite';
  const { PGlite } = await import(pglite);
  const dir = join(config.root, '.data', 'analytics');
  mkdirSync(dir, { recursive: true });
  const db = new PGlite(dir);
  return {
    engine: 'pglite',
    query: async (text, params = []) => (await db.query(text, params)).rows,
  };
}

let pending = null;

/** The shared database, or null on a host with no DATABASE_URL (analytics then switch off). */
export function getDb() {
  pending ??= open().catch((error) => {
    pending = null;
    throw error;
  });
  return pending;
}
