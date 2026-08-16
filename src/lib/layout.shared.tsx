import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const docsNavItems = [
  { label: 'MCP', href: '/mcp' },
  { label: 'Platform', href: '/platform' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Guides', href: '/guides' },
  { label: 'CLI', href: '/cli' },
  { label: 'Web app', href: '/web' },
  { label: 'Reference', href: '/reference' },
] as const;

export const docsSearchLinks: [string, string][] = [
  ['Overview', '/'],
  ['Quickstart', '/quickstart'],
  ...docsNavItems.map(({ label, href }) => [label, href] as [string, string]),
  ['Support', '/support'],
];

export function MogplexWordmark({ className }: { className?: string }) {
  return (
    <span className={className} aria-label="Mogplex">
      <span className="mogplex-brandmark" aria-hidden="true" />
      <span className="mogplex-icon" aria-hidden="true" />
    </span>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <MogplexWordmark className="inline-flex" />,
      transparentMode: 'top',
    },
    themeSwitch: {
      enabled: false,
    },
  };
}
