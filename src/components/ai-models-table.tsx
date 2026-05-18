'use client';

import { useMemo, useState } from 'react';
import snapshot from '@/data/ai-models.json';
import { cn } from '@/lib/cn';

type Model = {
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

type Snapshot = {
  fetched_at: string;
  count: number;
  models: Model[];
};

const DATA = snapshot as Snapshot;

function formatContext(value: number | null): string {
  if (value == null) return '—';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

function formatPrice(value: number | null): string {
  if (value == null) return '—';
  const perMtok = value * 1_000_000;
  if (perMtok === 0) return '$0';
  if (perMtok >= 1) return `$${perMtok.toFixed(2)}`;
  if (perMtok >= 0.001) {
    return `$${perMtok.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}`;
  }
  return `$${perMtok.toExponential(1)}`;
}

function formatFetched(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

export function AiModelsTable() {
  const [query, setQuery] = useState('');
  const [providers, setProviders] = useState<Set<string>>(new Set());
  const [capabilities, setCapabilities] = useState<Set<string>>(new Set());

  const allProviders = useMemo(
    () => Array.from(new Set(DATA.models.map((m) => m.provider))).sort(),
    [],
  );
  const allCapabilities = useMemo(() => {
    const caps = new Set<string>();
    for (const m of DATA.models) {
      for (const c of m.capabilities ?? []) caps.add(c);
    }
    return Array.from(caps).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA.models.filter((m) => {
      if (providers.size > 0 && !providers.has(m.provider)) return false;
      if (capabilities.size > 0) {
        const caps = new Set(m.capabilities ?? []);
        for (const c of capabilities) if (!caps.has(c)) return false;
      }
      if (q) {
        const hay = `${m.id} ${m.provider} ${m.name}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, providers, capabilities]);

  function toggle(set: Set<string>, value: string): Set<string> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  function clearAll() {
    setQuery('');
    setProviders(new Set());
    setCapabilities(new Set());
  }

  const hasFilters = query !== '' || providers.size > 0 || capabilities.size > 0;

  return (
    <div className="not-prose flex flex-col gap-4 my-6">
      <div className="flex flex-col gap-3 rounded-lg border border-fd-border bg-fd-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by model id, provider, or name…"
            className="flex-1 min-w-[12rem] rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-fd-ring"
          />
          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-md border border-fd-border px-2.5 py-1.5 text-xs font-medium hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              Clear
            </button>
          ) : null}
        </div>

        <FilterGroup
          label="Provider"
          options={allProviders}
          selected={providers}
          onToggle={(v) => setProviders((s) => toggle(s, v))}
        />

        <FilterGroup
          label="Capability"
          options={allCapabilities}
          selected={capabilities}
          onToggle={(v) => setCapabilities((s) => toggle(s, v))}
        />

        <p className="text-xs text-fd-muted-foreground">
          Showing {filtered.length} of {DATA.models.length} models. Snapshot fetched{' '}
          {formatFetched(DATA.fetched_at)}. Pricing is per million tokens.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-fd-border">
        <table className="w-full text-sm">
          <thead className="bg-fd-muted/40 text-left text-xs uppercase tracking-wide text-fd-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Model ID</th>
              <th className="px-3 py-2 font-medium">Provider</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium text-right">Context</th>
              <th className="px-3 py-2 font-medium">Capabilities</th>
              <th className="px-3 py-2 font-medium text-right">Input / Mtok</th>
              <th className="px-3 py-2 font-medium text-right">Output / Mtok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fd-border">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-6 text-center text-fd-muted-foreground"
                >
                  No models match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="hover:bg-fd-muted/30">
                  <td className="px-3 py-2 font-mono text-xs">{m.id}</td>
                  <td className="px-3 py-2">{m.provider}</td>
                  <td className="px-3 py-2">{m.name}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatContext(m.context_length)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {(m.capabilities ?? []).map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center rounded border border-fd-border bg-fd-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-fd-muted-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatPrice(m.pricing_input)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatPrice(m.pricing_output)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-fd-muted-foreground min-w-[5rem]">
        {label}
      </span>
      {options.map((opt) => {
        const active = selected.has(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
              active
                ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground'
                : 'border-fd-border bg-fd-background text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
            )}
            aria-pressed={active}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
