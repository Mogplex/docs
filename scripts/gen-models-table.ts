/**
 * Regenerate src/data/ai-models.json from the Mogplex ai_models catalog in
 * Neon. Needs a read-capable DATABASE_URL in .env.local.
 *
 *   pnpm gen:models
 *
 * The output is consumed by src/components/ai-models-table.tsx and rendered
 * inside content/docs/web/models.mdx. Re-run when the catalog changes.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Client } from 'pg';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Add it to .env.local first.`);
    process.exit(1);
  }
  return value;
}

const DATABASE_URL = requireEnv('DATABASE_URL');

const OUTPUT = resolve(process.cwd(), 'src/data/ai-models.json');

// numeric columns are cast to float8 so node-pg returns JSON numbers, matching
// the snapshot shape the PostgREST export produced.
const QUERY = `
  select
    id,
    provider,
    name,
    context_length,
    capabilities,
    pricing_input::float8 as pricing_input,
    pricing_output::float8 as pricing_output,
    pricing_cache_read::float8 as pricing_cache_read,
    pricing_cache_write::float8 as pricing_cache_write,
    is_available,
    is_hidden,
    is_recommended,
    recommendation_bucket
  from public.ai_models
  where is_hidden = false and is_available = true
  order by provider asc, name asc
  limit $1
`;

type Row = {
  id: string;
  provider: string;
  name: string;
  context_length: number | null;
  capabilities: string[] | null;
  pricing_input: number | null;
  pricing_output: number | null;
  pricing_cache_read: number | null;
  pricing_cache_write: number | null;
  is_available: boolean;
  is_hidden: boolean;
  is_recommended: boolean;
  recommendation_bucket: string | null;
};

const PAGE_SIZE = 10_000;

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  let rows: Row[];
  try {
    rows = (await client.query<Row>(QUERY, [PAGE_SIZE])).rows;
  } finally {
    await client.end();
  }

  if (rows.length === 0) {
    throw new Error('No rows returned — check the filters and DATABASE_URL.');
  }
  if (rows.length >= PAGE_SIZE) {
    throw new Error(
      `Received ${rows.length} rows — at or above PAGE_SIZE (${PAGE_SIZE}). Snapshot may be truncated; raise PAGE_SIZE or add pagination.`,
    );
  }

  const snapshot = {
    fetched_at: new Date().toISOString(),
    models: rows,
  };

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${rows.length} models to ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
