import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const docsRoutes = (content) => [
  ...[...content.matchAll(/\]\((\/[^)#]+)(?:#[^)]+)?\)/g)].map(
    (match) => match[1],
  ),
  ...[...content.matchAll(/href=(["'])(\/[^"'#]+)(?:#[^"']+)?\1/g)].map(
    (match) => match[2],
  ),
];

const nonDocsRoutes = new Set(['/llms-full.txt', '/llms.txt']);

async function assertDocsRouteExists(route, page) {
  const slug = route.replace(/^\//, '');
  const candidates = [
    `content/docs/${slug}.mdx`,
    `content/docs/${slug}/index.mdx`,
  ];
  const found = await Promise.any(
    candidates.map(async (candidate) => {
      await access(new URL(`../${candidate}`, import.meta.url));
      return candidate;
    }),
  ).catch(() => null);

  assert.ok(found, `${page} links to missing docs route ${route}`);
}

test('documents Sandboxes and Worktrees as separate bound resources', async () => {
  const [glossary, worktrees, guide, objectModel] = await Promise.all([
    read('content/docs/reference/glossary.mdx'),
    read('content/docs/web/worktrees.mdx'),
    read('content/docs/guides/control-execution-environments.mdx'),
    read('content/docs/platform/how-mogplex-fits-together.mdx'),
  ]);

  assert.match(glossary, /^## Worktree$/m);
  assert.match(worktrees, /task.*branch.*checkout/is);
  assert.match(worktrees, /sandbox binding/i);
  assert.match(worktrees, /diff/i);
  assert.match(worktrees, /rebase/i);
  assert.match(worktrees, /archive/i);
  assert.match(worktrees, /prune/i);
  assert.match(worktrees, /failure recovery/i);

  for (const action of [
    'Preview or runtime',
    'Shell command',
    'Single isolated coding task',
    'Parallel coding tasks',
    'Stop compute',
    'Archive a checkout',
    'Prune a checkout',
    'Delete a runtime record',
  ]) {
    assert.match(guide, new RegExp(action, 'i'));
  }

  assert.match(objectModel, /mission.*task.*worktree.*sandbox/is);
  assert.match(objectModel, /sandbox.*multiple.*worktrees/is);
});

test('cross-links the execution environment guide from public owning surfaces', async () => {
  const requiredLinks = [
    'content/docs/web/sandboxes.mdx',
    'content/docs/web/spaces.mdx',
    'content/docs/guides/how-to-work-with-mogplex.mdx',
    'content/docs/guides/troubleshooting.mdx',
    'content/docs/web/observability.mdx',
    'content/docs/reference/api.mdx',
    'content/docs/mcp/tools.mdx',
  ];

  for (const path of requiredLinks) {
    const content = await read(path);
    assert.match(
      content,
      /\]\(\/guides\/control-execution-environments\)/,
      `${path} must link to the Control execution environments guide`,
    );
  }
});

test('does not advertise internal Worktree tools as public MCP tools', async () => {
  const tools = await read('content/docs/mcp/tools.mdx');

  for (const internalTool of [
    'spawn_worktree',
    'archive_worktree',
    'prune_worktree',
    'spawn_subagent',
  ]) {
    assert.equal(
      tools.includes(`| \`${internalTool}\` |`),
      false,
      `${internalTool} must not appear in the public MCP tool table`,
    );
  }
});

test('publishes the new pages in navigation and search metadata', async () => {
  const [webMeta, guidesMeta, worktrees, guide] = await Promise.all([
    read('content/docs/web/meta.json').then(JSON.parse),
    read('content/docs/guides/meta.json').then(JSON.parse),
    read('content/docs/web/worktrees.mdx'),
    read('content/docs/guides/control-execution-environments.mdx'),
  ]);

  assert.ok(webMeta.pages.includes('worktrees'));
  assert.ok(guidesMeta.pages.includes('control-execution-environments'));
  assert.match(worktrees, /^title: Worktrees$/m);
  assert.match(worktrees, /^description: .+$/m);
  assert.match(guide, /^title: Control Execution Environments$/m);
  assert.match(guide, /^description: .+$/m);
});

test('internal links across public docs resolve to existing routes', async () => {
  const docsRoot = new URL('../content/docs/', import.meta.url);
  const entries = await readdir(docsRoot, { recursive: true });
  const pages = entries
    .filter((entry) => entry.endsWith('.mdx'))
    .map((entry) => `content/docs/${entry}`);
  assert.ok(pages.length > 0, 'expected to find MDX pages under content/docs');
  let checkedRoutes = 0;

  for (const page of pages) {
    const content = await read(page);
    for (const route of docsRoutes(content)) {
      if (nonDocsRoutes.has(route)) continue;
      await assertDocsRouteExists(route, page);
      checkedRoutes += 1;
    }
  }

  assert.ok(checkedRoutes > 0, 'expected to check internal docs routes');
});

test('new execution environment pages only link to existing docs routes', async () => {
  const pages = [
    'content/docs/web/worktrees.mdx',
    'content/docs/guides/control-execution-environments.mdx',
  ];

  for (const page of pages) {
    const content = await read(page);
    for (const route of docsRoutes(content)) {
      await assertDocsRouteExists(route, page);
    }
  }
});
