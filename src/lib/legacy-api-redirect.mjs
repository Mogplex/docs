export const legacyApiPages = Object.freeze({
  index: {
    anchor: 'endpoint-index',
    fragments: {
      'read-this-section-in-order': 'quickstart',
      'start-with-safe-first-requests': 'quickstart',
      'how-to-read-this-api-correctly': 'request-conventions',
      'the-api-is-product-first': 'endpoint-index',
      'shared-auth-model': 'authentication',
      'important-auth-nuance': 'authentication',
      'web-and-cli-crossover': 'endpoint-index',
      'route-families': 'endpoint-index',
      'practical-guidance': 'quickstart',
    },
  },
  authentication: {
    anchor: 'authentication',
    fragments: {
      'auth-resolution-order': 'authentication',
      'mcp-oauth': 'authentication',
      'personal-access-tokens': 'authentication',
      'issuing-a-pat': 'authentication',
      'revoking-a-pat': 'authentication',
      expiry: 'authentication',
      scopes: 'scopes',
      'rate-limits': 'rate-limits',
      'per-pat-request-limit': 'rate-limits',
      'per-user-run-start-limits': 'rate-limits',
      'idempotency-key-required-on-mutations': 'request-conventions',
      'cli-browser-handoff': 'authentication',
      'practical-debugging': 'errors',
      'read-next': 'authentication',
    },
  },
  errors: {
    anchor: 'errors',
    fragments: {
      'envelope-shape': 'response-envelopes',
      'error-codes': 'errors',
      'retry-guidance': 'errors',
      idempotency: 'request-conventions',
      'rate-limit-headers': 'rate-limits',
      'read-next': 'errors',
    },
  },
  'mcp-servers': {
    anchor: 'external-mcp-servers',
    fragments: {
      scope: 'external-mcp-servers',
      'merge-rules': 'list-configured-external-mcp-servers',
      example: 'list-configured-external-mcp-servers',
      'response-shape': 'list-configured-external-mcp-servers',
      errors: 'errors',
      'cli-equivalent': 'external-mcp-servers',
      'security-notes': 'external-mcp-servers',
      'read-next': 'external-mcp-servers',
    },
  },
  mcp: {
    anchor: 'mcp-transport',
    fragments: {
      'connect-with-oauth': 'mcp-transport',
      'pat-fallback': 'authentication',
      methods: 'mcp-transport',
      initialize: 'mcp-transport',
      tools: 'mcp-transport',
      'discovery-and-sandboxes': 'sandboxes',
      automations: 'automations',
      'agent-runs': 'agent-runs',
      'call-a-tool-directly': 'mcp-transport',
      errors: 'mcp-errors',
      cors: 'mcp-transport',
      'read-next': 'mcp-transport',
    },
  },
  models: {
    anchor: 'models',
    fragments: {
      'what-this-route-owns': 'models',
      'get-apimodels': 'list-models',
      'get-apimodelsformatcli': 'list-models',
      'patch-apimodels': 'models',
      'when-to-use-apimodels-vs-apisettings': 'models',
      'read-next': 'models',
    },
  },
  quickstart: {
    anchor: 'quickstart',
    fragments: {
      prerequisites: 'quickstart',
      '1-verify-the-account': 'authentication',
      '2-list-repos': 'list-repositories',
      '3-check-model-availability': 'list-models',
      '4-start-a-run': 'start-a-run',
      '5-inspect-the-run': 'get-a-run',
      '6-cancel-a-run': 'cancel-a-run',
      '7-inspect-sandboxes': 'list-sandboxes',
      'first-error-map': 'errors',
      'read-next': 'quickstart',
    },
  },
  repos: {
    anchor: 'repositories',
    fragments: {
      scope: 'repositories',
      'query-parameters': 'list-repositories',
      example: 'list-repositories',
      'response-shape': 'list-repositories',
      errors: 'errors',
      'cli-equivalent': 'list-repositories',
      'read-next': 'repositories',
    },
  },
  'route-families': {
    anchor: 'endpoint-index',
    fragments: {
      'v1-public-surface': 'endpoint-index',
      'identity-and-setup': 'authentication',
      'projects-repos-and-github-coverage': 'repositories',
      'connections-and-reusable-libraries': 'external-mcp-servers',
      'routing-surfaces': 'endpoint-index',
      'conversations-memory-and-live-agent-work': 'agent-runs',
      'sandbox-runtime-and-observability': 'sandboxes',
      'system-plumbing-and-internal-operations': 'endpoint-index',
      'a-useful-mental-model': 'endpoint-index',
      'product-first-not-platform-first': 'endpoint-index',
    },
  },
  runs: {
    anchor: 'agent-runs',
    fragments: {
      'start-a-run': 'start-a-run',
      example: 'start-a-run',
      'status-values': 'agent-runs',
      errors: 'errors',
      'get-a-run': 'get-a-run',
      'list-run-events': 'list-run-events',
      'polling-for-terminal-status': 'list-run-events',
      'cancel-a-run': 'cancel-a-run',
      'cli-equivalents': 'agent-runs',
      'read-next': 'agent-runs',
    },
  },
  sandboxes: {
    anchor: 'sandboxes',
    fragments: {
      scope: 'sandboxes',
      'query-parameters': 'list-sandboxes',
      'list-sandboxes': 'list-sandboxes',
      'response-shape': 'sandboxes',
      'create-or-reuse-a-sandbox': 'create-or-reuse-a-sandbox',
      'read-sandbox-logs': 'read-sandbox-logs',
      errors: 'errors',
      'cli-equivalent': 'sandboxes',
      'read-next': 'sandboxes',
    },
  },
  'working-requests': {
    anchor: 'quickstart',
    fragments: {
      'before-you-start': 'quickstart',
      '1-check-setup-state-with-get-apiauthuser': 'authentication',
      '2-read-or-update-shared-defaults-with-apisettings':
        'request-conventions',
      '3-inspect-github-app-coverage-with-get-apigithubinstallations':
        'repositories',
      '4-export-cli-ready-mcp-config-with-get-apimcp-serversformatcli':
        'external-mcp-servers',
      '5-create-a-workflow-shell-with-post-apiflows': 'automations',
      '6-pull-runtime-summary-with-get-apiobservabilitystats': 'agent-runs',
      'a-good-first-day-api-sequence': 'quickstart',
      'read-next': 'quickstart',
    },
  },
});

export function resolveLegacyApiAnchor(legacyPage, fragment = '') {
  const page = legacyApiPages[legacyPage];
  if (!page) return null;

  return fragment ? (page.fragments[fragment] ?? page.anchor) : page.anchor;
}

export function resolveLegacyApiLocation(input) {
  const url = new URL(input);
  const legacyPage = url.searchParams.get('legacyApi');
  if (!legacyPage) return null;

  const anchor = resolveLegacyApiAnchor(legacyPage, url.hash.slice(1));
  if (!anchor) return null;

  url.searchParams.delete('legacyApi');
  url.hash = anchor;

  return {
    anchor,
    href: `${url.pathname}${url.search}${url.hash}`,
  };
}
