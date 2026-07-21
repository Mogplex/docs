import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const withMDX = createMDX();

const legacyApiRedirects = [
  { source: '/web/api', legacyPage: null },
  { source: '/web/api/quickstart', legacyPage: 'quickstart' },
  { source: '/web/api/authentication', legacyPage: 'authentication' },
  { source: '/web/api/errors', legacyPage: 'errors' },
  { source: '/web/api/models', legacyPage: 'models' },
  { source: '/web/api/runs', legacyPage: 'runs' },
  { source: '/web/api/repos', legacyPage: 'repos' },
  { source: '/web/api/sandboxes', legacyPage: 'sandboxes' },
  { source: '/web/api/mcp-servers', legacyPage: 'mcp-servers' },
  { source: '/web/api/mcp', legacyPage: 'mcp' },
  { source: '/web/api/working-requests', legacyPage: 'working-requests' },
  { source: '/web/api/route-families', legacyPage: 'route-families' },
];

function includeRawMarkdownRedirect({ source, legacyPage }) {
  const destination = legacyPage
    ? `/reference/api?legacyApi=${legacyPage}`
    : '/reference/api';

  return [
    { source, destination, permanent: true },
    {
      source: `${source}.md`,
      destination: '/reference/api.md',
      permanent: true,
    },
  ];
}

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Dev-only: allow local smoke checks to access the dev server via 127.0.0.1.
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: '/extend/mcp-server',
        destination: '/mcp',
        permanent: true,
      },
      {
        source: '/extend/mcp-server.md',
        destination: '/mcp.md',
        permanent: true,
      },
      ...legacyApiRedirects.flatMap(includeRawMarkdownRedirect),
    ];
  },
  async rewrites() {
    // Agent-friendly: `curl https://docs/<slug>.md` returns raw markdown.
    return [
      { source: '/index.md', destination: '/llms.mdx/docs/content.md' },
      { source: '/:path*.md', destination: '/llms.mdx/docs/:path*/content.md' },
    ];
  },
};

export default withMDX(config);
