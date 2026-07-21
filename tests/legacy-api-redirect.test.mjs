import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import nextConfig from '../next.config.mjs';
import {
  legacyApiPages,
  resolveLegacyApiLocation,
} from '../src/lib/legacy-api-redirect.mjs';

const navigationCases = [
  {
    name: 'preserves a matching consolidated fragment',
    input:
      'https://docs.example.com/reference/api?legacyApi=authentication#scopes',
    anchor: 'scopes',
    href: '/reference/api#scopes',
  },
  {
    name: 'maps a removed run status fragment to the run type contract',
    input: 'https://docs.example.com/reference/api?legacyApi=runs#status-values',
    anchor: 'agent-runs',
    href: '/reference/api#agent-runs',
  },
  {
    name: 'maps removed polling guidance to run events',
    input:
      'https://docs.example.com/reference/api?legacyApi=runs#polling-for-terminal-status',
    anchor: 'list-run-events',
    href: '/reference/api#list-run-events',
  },
  {
    name: 'maps a repo query fragment to the list endpoint',
    input:
      'https://docs.example.com/reference/api?legacyApi=repos#query-parameters',
    anchor: 'list-repositories',
    href: '/reference/api#list-repositories',
  },
  {
    name: 'maps a removed MCP server scope fragment to its section',
    input:
      'https://docs.example.com/reference/api?legacyApi=mcp-servers#scope',
    anchor: 'external-mcp-servers',
    href: '/reference/api#external-mcp-servers',
  },
  {
    name: 'maps an MCP error fragment to the JSON-RPC contract',
    input: 'https://docs.example.com/reference/api?legacyApi=mcp#errors',
    anchor: 'mcp-errors',
    href: '/reference/api#mcp-errors',
  },
  {
    name: 'falls back to the page anchor for an unknown fragment',
    input:
      'https://docs.example.com/reference/api?legacyApi=sandboxes#removed-heading',
    anchor: 'sandboxes',
    href: '/reference/api#sandboxes',
  },
  {
    name: 'uses the page anchor when no fragment is supplied',
    input: 'https://docs.example.com/reference/api?legacyApi=runs',
    anchor: 'agent-runs',
    href: '/reference/api#agent-runs',
  },
];

for (const navigationCase of navigationCases) {
  test(navigationCase.name, () => {
    assert.deepEqual(resolveLegacyApiLocation(navigationCase.input), {
      anchor: navigationCase.anchor,
      href: navigationCase.href,
    });
  });
}

test('ignores unknown legacy API pages', () => {
  assert.equal(
    resolveLegacyApiLocation(
      'https://docs.example.com/reference/api?legacyApi=unknown#scopes',
    ),
    null,
  );
});

test('every configured destination exists on the consolidated page', () => {
  const apiReference = readFileSync(
    new URL('../content/docs/reference/api.mdx', import.meta.url),
    'utf8',
  );
  const currentAnchors = new Set(
    [...apiReference.matchAll(/^#{2,4}\s+(.+)$/gm)].map(([, heading]) =>
      heading
        .replaceAll('`', '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-'),
    ),
  );

  for (const [legacyPage, page] of Object.entries(legacyApiPages)) {
    assert.ok(
      currentAnchors.has(page.anchor),
      `${legacyPage} fallback points to missing #${page.anchor}`,
    );

    for (const [fragment, anchor] of Object.entries(page.fragments)) {
      assert.ok(
        currentAnchors.has(anchor),
        `${legacyPage}#${fragment} points to missing #${anchor}`,
      );
    }
  }
});

test('redirect configuration routes every legacy page through the resolver', async () => {
  const redirects = await nextConfig.redirects();
  const apiRedirects = redirects.filter(({ source }) =>
    source.startsWith('/web/api'),
  );

  for (const legacyPage of Object.keys(legacyApiPages)) {
    const source =
      legacyPage === 'index' ? '/web/api' : `/web/api/${legacyPage}`;

    assert.ok(
      apiRedirects.some(
        (redirect) =>
          redirect.source === source &&
          redirect.destination === `/reference/api?legacyApi=${legacyPage}` &&
          redirect.permanent,
      ),
      `missing HTML redirect for ${legacyPage}`,
    );
    assert.ok(
      apiRedirects.some(
        (redirect) =>
          redirect.source === `${source}.md` &&
          redirect.destination === '/reference/api.md' &&
          redirect.permanent,
      ),
      `missing raw Markdown redirect for ${legacyPage}`,
    );
  }

  assert.equal(
    apiRedirects.some(({ destination }) => destination.includes('#')),
    false,
  );
});
