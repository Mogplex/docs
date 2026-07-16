'use client';

import Link from 'next/link';
import { ChevronDown, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { useEffect, useId, useRef, useState } from 'react';
import { docsNavItems, MogplexWordmark } from '@/lib/layout.shared';
import { ThemeSwitcher } from '@/components/theme-switcher';

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function useDisclosureMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return { containerRef, open, setOpen, triggerRef };
}

function DocsSectionPicker({ pathname }: { pathname: string }) {
  const menuId = useId();
  const { containerRef, open, setOpen, triggerRef } = useDisclosureMenu();

  return (
    <div className="docs-section-picker" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className="docs-section-trigger"
        aria-label="Select documentation section"
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>Docs</span>
        <ChevronDown aria-hidden="true" strokeWidth={1.5} />
      </button>

      <nav
        id={menuId}
        className="docs-header-popover docs-section-popover"
        aria-label="Documentation sections"
        hidden={!open}
      >
        {docsNavItems.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              data-active={active}
              aria-current={active ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function DashboardMenu() {
  const menuId = useId();
  const { containerRef, open, setOpen, triggerRef } = useDisclosureMenu();

  return (
    <div className="docs-dashboard-menu" ref={containerRef}>
      <div className="docs-dashboard-group">
        <a
          className="docs-dashboard-link"
          href="https://www.mogplex.com"
          aria-label="Open the Mogplex dashboard"
        >
          Dashboard
        </a>
        <button
          ref={triggerRef}
          type="button"
          className="docs-dashboard-more"
          aria-label="More Mogplex links"
          aria-controls={menuId}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronDown aria-hidden="true" strokeWidth={1.5} />
        </button>
      </div>

      <nav
        id={menuId}
        className="docs-header-popover docs-dashboard-popover"
        aria-label="More Mogplex links"
        hidden={!open}
      >
        <Link href="/support" onClick={() => setOpen(false)}>
          Support
        </Link>
        <a href="https://github.com/webrenew/mogplex-docs" onClick={() => setOpen(false)}>
          GitHub
        </a>
      </nav>
    </div>
  );
}

export function DocsHeader() {
  const pathname = usePathname();
  const { slots } = useDocsLayout();
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
    <header className="docs-header">
      <div className="docs-header-inner">
        <Link className="docs-header-brand" href="/" aria-label="Mogplex documentation home">
          <MogplexWordmark />
        </Link>

        <div className="docs-header-center">
          <DocsSectionPicker pathname={pathname} />
        </div>

        <div className="docs-header-actions">
          <ThemeSwitcher />

          {FullSearchTrigger ? (
            <FullSearchTrigger
              hideIfDisabled
              className="docs-search-trigger docs-search-trigger-full"
            />
          ) : null}
          {SearchTrigger ? (
            <SearchTrigger hideIfDisabled className="docs-icon-button docs-search-trigger-compact" />
          ) : null}

          <DashboardMenu />

          <SidebarTrigger
            className="docs-icon-button docs-sidebar-trigger"
            aria-label="Open navigation"
          >
            <Menu aria-hidden="true" strokeWidth={1.5} />
          </SidebarTrigger>
        </div>
      </div>
    </header>
  );
}
