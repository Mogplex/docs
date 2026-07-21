'use client';

import { useEffect } from 'react';

const legacyPageAnchors: Record<string, string> = {
  authentication: 'authentication',
  errors: 'errors',
  mcp: 'mcp-transport',
  'mcp-servers': 'external-mcp-servers',
  models: 'models',
  quickstart: 'quickstart',
  repos: 'repositories',
  'route-families': 'endpoint-index',
  runs: 'agent-runs',
  sandboxes: 'sandboxes',
  'working-requests': 'quickstart',
};

const legacyFragmentAnchors: Record<string, string> = {
  'mcp:errors': 'mcp-errors',
};

export function LegacyApiAnchor() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const legacyPage = url.searchParams.get('legacyApi');
    const fallbackAnchor = legacyPage ? legacyPageAnchors[legacyPage] : undefined;

    if (!legacyPage || !fallbackAnchor) return;

    const currentAnchor = url.hash.slice(1);
    const destinationAnchor =
      legacyFragmentAnchors[`${legacyPage}:${currentAnchor}`] ??
      (currentAnchor || fallbackAnchor);

    url.searchParams.delete('legacyApi');
    url.hash = destinationAnchor;

    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${url.search}${url.hash}`,
    );

    document.getElementById(destinationAnchor)?.scrollIntoView();
  }, []);

  return null;
}
