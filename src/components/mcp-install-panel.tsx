'use client';

import { Braces, Check, Copy, ExternalLink, MousePointerClick, Terminal } from 'lucide-react';
import { useState } from 'react';

const MCP_URL = 'https://mogplex.com/api/v1/mogplex/mcp';

const CURSOR_INSTALL_URL =
  'cursor://anysphere.cursor-deeplink/mcp/install?name=mogplex&config=eyJ1cmwiOiJodHRwczovL3d3dy5tb2dwbGV4LmNvbS9hcGkvdjEvbW9ncGxleC9tY3AifQ%3D%3D';

const CLIENTS = [
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'Open Cursor, register Mogplex, then complete OAuth in your browser.',
    action: 'link' as const,
    actionLabel: 'Install in Cursor',
    href: CURSOR_INSTALL_URL,
    icon: MousePointerClick,
    snippet: JSON.stringify({ mcpServers: { mogplex: { url: MCP_URL } } }, null, 2),
    snippetLabel: 'Cursor MCP configuration',
  },
  {
    id: 'codex',
    name: 'Codex',
    description: 'Copy both commands. Codex binds OAuth to the exact Mogplex resource.',
    action: 'copy' as const,
    actionLabel: 'Copy Codex setup',
    icon: Terminal,
    snippet: `codex mcp add mogplex \\
  --url ${MCP_URL} \\
  --oauth-resource ${MCP_URL}
codex mcp login mogplex`,
    snippetLabel: 'Codex terminal setup',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Install Mogplex, then authenticate from Claude Code with /mcp.',
    action: 'copy' as const,
    actionLabel: 'Copy Claude setup',
    icon: Terminal,
    snippet: `claude mcp add --transport http --scope user mogplex ${MCP_URL}
# Then start Claude Code, run /mcp, select mogplex, and authenticate.`,
    snippetLabel: 'Claude Code terminal setup',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    description: 'Copy this entry into opencode.json, then authenticate with OpenCode.',
    action: 'copy' as const,
    actionLabel: 'Copy OpenCode config',
    icon: Braces,
    snippet: JSON.stringify(
      {
        $schema: 'https://opencode.ai/config.json',
        mcp: {
          mogplex: {
            type: 'remote',
            url: MCP_URL,
            enabled: true,
          },
        },
      },
      null,
      2,
    ),
    snippetLabel: 'OpenCode configuration',
    followUp: 'opencode mcp auth mogplex',
  },
] as const;

type ClientId = (typeof CLIENTS)[number]['id'];
type CopyFeedback = { clientId: ClientId; status: 'copied' | 'error' } | null;

function copyWithSelection(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  textarea.remove();

  if (!copied) {
    throw new Error('Copy command was rejected.');
  }
}

export function McpInstallPanel() {
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null);

  async function copySnippet(clientId: ClientId, snippet: string) {
    try {
      if (!navigator.clipboard) {
        copyWithSelection(snippet);
      } else {
        await navigator.clipboard.writeText(snippet);
      }
      setCopyFeedback({ clientId, status: 'copied' });
    } catch {
      try {
        copyWithSelection(snippet);
        setCopyFeedback({ clientId, status: 'copied' });
      } catch {
        setCopyFeedback({ clientId, status: 'error' });
      }
    }
  }

  return (
    <section className="mcp-install-panel" aria-labelledby="mcp-install-heading">
      <div className="mcp-install-panel-heading">
        <p className="mcp-install-eyebrow">Choose your local agent</p>
        <h2 id="mcp-install-heading">Connect Mogplex</h2>
        <p>
          Every client connects to the same hosted endpoint. OAuth opens in your browser, and no
          API token needs to be pasted into configuration.
        </p>
      </div>

      <div className="mcp-install-grid">
        {CLIENTS.map((client) => {
          const Icon = client.icon;
          const isCopied =
            copyFeedback?.clientId === client.id && copyFeedback.status === 'copied';
          const copyFailed =
            copyFeedback?.clientId === client.id && copyFeedback.status === 'error';

          return (
            <article className="mcp-install-card" key={client.id}>
              <div className="mcp-install-card-title">
                <span className="mcp-install-card-icon" aria-hidden="true">
                  <Icon strokeWidth={1.6} />
                </span>
                <div>
                  <h3>{client.name}</h3>
                  <p>{client.description}</p>
                </div>
              </div>

              <pre aria-label={client.snippetLabel}>
                <code>{client.snippet}</code>
              </pre>

              {'followUp' in client ? (
                <p className="mcp-install-follow-up">
                  Then run <code>{client.followUp}</code>.
                </p>
              ) : null}

              {client.action === 'link' ? (
                <a className="mcp-install-action" href={client.href}>
                  {client.actionLabel}
                  <ExternalLink aria-hidden="true" strokeWidth={1.6} />
                </a>
              ) : (
                <button
                  className="mcp-install-action"
                  type="button"
                  onClick={() => copySnippet(client.id, client.snippet)}
                >
                  {isCopied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  {isCopied ? 'Copied' : copyFailed ? 'Select code to copy' : client.actionLabel}
                </button>
              )}
            </article>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {copyFeedback
          ? copyFeedback.status === 'copied'
            ? `${CLIENTS.find((client) => client.id === copyFeedback.clientId)?.name} setup copied.`
            : 'Automatic copy was unavailable. Select the code block and copy it manually.'
          : ''}
      </p>
    </section>
  );
}
