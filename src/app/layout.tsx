import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { GeistMono } from 'geist/font/mono';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { appName } from '@/lib/shared';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
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
      className={`${inter.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider
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
