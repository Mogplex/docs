import Link from 'next/link';
import { MogplexWordmark } from '@/lib/layout.shared';

export function DocsSiteFooter() {
  return (
    <footer className="docs-site-footer">
      <div className="docs-site-footer-identity">
        <Link className="docs-site-footer-brand" href="/" aria-label="Mogplex docs home">
          <MogplexWordmark />
        </Link>
        <p>Agentic CI/CD, from trigger to shipped code.</p>
      </div>

      <nav className="docs-site-footer-nav" aria-label="Footer navigation">
        <Link href="/quickstart">Quickstart</Link>
        <Link href="/support">Support</Link>
        <a
          href="https://github.com/webrenew/mogplex-docs"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub (opens in a new tab)"
        >
          GitHub
        </a>
      </nav>
    </footer>
  );
}
