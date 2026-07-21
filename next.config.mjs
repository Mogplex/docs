import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { legacyApiPages } from './src/lib/legacy-api-redirect.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const withMDX = createMDX();

const legacyApiRedirects = Object.keys(legacyApiPages).map((legacyPage) => ({
  source: legacyPage === 'index' ? '/web/api' : `/web/api/${legacyPage}`,
  legacyPage,
}));

function includeRawMarkdownRedirect({ source, legacyPage }) {
  const destination = `/reference/api?legacyApi=${legacyPage}`;

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
