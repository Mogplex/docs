import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const withMDX = createMDX();

const legacyApiRedirects = [
  { source: '/web/api', destination: '/reference/api' },
  { source: '/web/api/quickstart', destination: '/reference/api#quickstart' },
  {
    source: '/web/api/authentication',
    destination: '/reference/api#authentication',
  },
  { source: '/web/api/errors', destination: '/reference/api#errors' },
  { source: '/web/api/models', destination: '/reference/api#models' },
  { source: '/web/api/runs', destination: '/reference/api#agent-runs' },
  { source: '/web/api/repos', destination: '/reference/api#repositories' },
  { source: '/web/api/sandboxes', destination: '/reference/api#sandboxes' },
  {
    source: '/web/api/mcp-servers',
    destination: '/reference/api#external-mcp-servers',
  },
  { source: '/web/api/mcp', destination: '/reference/api#mcp-transport' },
  {
    source: '/web/api/working-requests',
    destination: '/reference/api#quickstart',
  },
  {
    source: '/web/api/route-families',
    destination: '/reference/api#endpoint-index',
  },
];

function includeRawMarkdownRedirect({ source, destination }) {
  const [destinationPath, fragment] = destination.split('#');
  return [
    { source, destination, permanent: true },
    {
      source: `${source}.md`,
      destination: `${destinationPath}.md${fragment ? `#${fragment}` : ''}`,
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
