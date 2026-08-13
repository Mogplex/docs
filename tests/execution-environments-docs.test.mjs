import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

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

test('execution environment links across public docs resolve to existing routes', async () => {
  const docsRoot = new URL('../content/docs/', import.meta.url);
  const entries = await readdir(docsRoot, { recursive: true });
  const pages = entries
    .filter((entry) => entry.endsWith('.mdx'))
    .map((entry) => `content/docs/${entry}`);
  const executionRoutes = new Set([
    '/guides/control-execution-environments',
    '/web/worktrees',
  ]);

  for (const page of pages) {
    const content = await read(page);
    const routes = [...content.matchAll(/\]\((\/[^)#]+)(?:#[^)]+)?\)/g)]
      .map((match) => match[1])
      .filter((route) => executionRoutes.has(route));

    for (const route of routes) {
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
  }
});
