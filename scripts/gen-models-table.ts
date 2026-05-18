/**
 * Regenerate src/data/ai-models.json from the Supabase ai_models catalog.
 *
 *   pnpm gen:models
 *
 * The output is consumed by src/components/ai-models-table.tsx and rendered
 * inside content/docs/web/models.mdx. Re-run when the catalog changes.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Run \`vercel env pull .env.local\` first.`);
    process.exit(1);
  }
  return value;
}

const SUPABASE_URL = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_ANON_KEY = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const OUTPUT = resolve(process.cwd(), 'src/data/ai-models.json');

const SELECT = [
  'id',
  'provider',
  'name',
  'context_length',
  'capabilities',
  'pricing_input',
  'pricing_output',
  'pricing_cache_read',
  'pricing_cache_write',
  'is_available',
  'is_hidden',
  'is_recommended',
  'recommendation_bucket',
].join(',');

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

async function main() {
  const url = new URL(`${SUPABASE_URL}/rest/v1/ai_models`);
  url.searchParams.set('select', SELECT);
  url.searchParams.set('is_hidden', 'eq.false');
  url.searchParams.set('is_available', 'eq.true');
  url.searchParams.set('order', 'provider.asc,name.asc');

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Supabase REST returned ${res.status} ${res.statusText}`);
  }

  const rows = (await res.json()) as Row[];

  const snapshot = {
    source: `${SUPABASE_URL}/rest/v1/ai_models`,
    fetched_at: new Date().toISOString(),
    count: rows.length,
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
