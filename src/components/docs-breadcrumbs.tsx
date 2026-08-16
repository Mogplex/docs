import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Node } from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

type Crumb = { name: ReactNode; url?: string };

function findTrail(nodes: Node[], url: string, trail: Crumb[]): Crumb[] | null {
  for (const node of nodes) {
    if (node.type === 'page' && node.url === url) {
      return [...trail, { name: node.name, url: node.url }];
    }
    if (node.type === 'folder') {
      const found = findTrail(node.children, url, [
        ...trail,
        { name: node.name, url: node.index?.url },
      ]);
      if (found) return found;
    }
  }
  return null;
}

export function DocsBreadcrumbs({ url }: { url: string }) {
  const trail = findTrail(source.getPageTree().children, url, []) ?? [];

  return (
    <nav className="docs-breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Docs</Link>
      {trail.map((crumb, index) => {
        const isLast = index === trail.length - 1;

        return (
          <span key={index} className="docs-breadcrumb-item">
            <ChevronRight aria-hidden="true" strokeWidth={1.5} />
            {crumb.url && !isLast ? (
              <Link href={crumb.url}>{crumb.name}</Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined}>{crumb.name}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
