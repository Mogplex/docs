'use client';

import Link from 'next/link';
import { Menu, PanelsTopLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { useEffect } from 'react';
import { docsNavItems, MogplexWordmark } from '@/lib/layout.shared';
import { ThemeSwitcher } from '@/components/theme-switcher';

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DocsHeader() {
  const pathname = usePathname();
  const { isNavTransparent, slots } = useDocsLayout();
  const SidebarTrigger = slots.sidebar.trigger;
  const SearchTrigger = slots.searchTrigger && slots.searchTrigger.sm;
  const FullSearchTrigger = slots.searchTrigger && slots.searchTrigger.full;
  const { open, setOpen } = slots.sidebar.useSidebar();

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
    };

    document.documentElement.classList.add('docs-nav-open');
    document.body.classList.add('docs-nav-open');
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.documentElement.classList.remove('docs-nav-open');
      document.body.classList.remove('docs-nav-open');
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, setOpen]);

  return (
    <header className="docs-header" data-transparent={isNavTransparent || undefined}>
      <SidebarTrigger className="docs-icon-button docs-sidebar-trigger" aria-label="Open navigation">
        <Menu aria-hidden="true" strokeWidth={1.5} />
      </SidebarTrigger>

      <Link className="docs-header-brand" href="/" aria-label="Mogplex documentation home">
        <MogplexWordmark />
      </Link>

      <nav className="docs-header-nav" aria-label="Documentation sections">
        {docsNavItems.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              data-active={active}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="docs-header-actions">
        <ThemeSwitcher />

        {FullSearchTrigger ? (
          <FullSearchTrigger hideIfDisabled className="docs-search-trigger docs-search-trigger-full" />
        ) : null}
        {SearchTrigger ? (
          <SearchTrigger hideIfDisabled className="docs-icon-button docs-search-trigger-compact" />
        ) : null}

        <a
          className="docs-dashboard-link"
          href="https://www.mogplex.com"
          aria-label="Open the Mogplex dashboard"
        >
          <span>Dashboard</span>
          <PanelsTopLeft aria-hidden="true" strokeWidth={1.5} />
        </a>
      </div>
    </header>
  );
}
