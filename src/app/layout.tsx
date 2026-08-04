import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { IBM_Plex_Mono, Inter_Tight } from 'next/font/google';
import type { Metadata } from 'next';
import { docsSearchLinks } from '@/lib/layout.shared';
import { appName } from '@/lib/shared';

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex-mono',
});

function resolveMetadataBase() {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (candidate) {
    return new URL(candidate.startsWith('http') ? candidate : `https://${candidate}`);
  }

  return new URL('https://docs.mogplex.com');
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  applicationName: appName,
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider
          search={{ links: docsSearchLinks }}
          theme={{
            defaultTheme: 'system',
            attribute: 'class',
            enableSystem: true,
            disableTransitionOnChange: true,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
