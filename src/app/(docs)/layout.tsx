import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, docsNavItems, MogplexWordmark } from '@/lib/layout.shared';
import { DocsHeader } from '@/components/docs-header';
import Link from 'next/link';
import type { CSSProperties } from 'react';

const shellStyle = {
  '--fd-header-height': 'var(--docs-header-height)',
  '--fd-toc-popover-height': '0px',
  gridTemplate: `"header header header header header" var(--fd-header-height)
    "sidebar sidebar toc-popover toc toc" var(--fd-toc-popover-height)
    "sidebar sidebar main toc toc" 1fr /
    0px var(--fd-sidebar-col) minmax(0, 1fr) var(--fd-toc-width) 0px`,
} as CSSProperties;

const docsTabs = docsNavItems.map((item) => ({
  title: item.label,
  url: item.href,
}));

const mobileDrawerBrand = (
  <Link
    key="mobile-drawer-brand"
    className="docs-drawer-brand"
    href="/"
    aria-label="Mogplex documentation home"
  >
    <MogplexWordmark />
  </Link>
);

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      tabs={docsTabs}
      sidebar={{
        collapsible: false,
        banner: mobileDrawerBrand,
      }}
      slots={{ header: DocsHeader }}
      containerProps={{ className: 'docs-shell', style: shellStyle }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
