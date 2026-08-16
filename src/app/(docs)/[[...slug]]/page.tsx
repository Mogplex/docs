import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  MarkdownCopyButton,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { DocsBreadcrumbs } from '@/components/docs-breadcrumbs';
import { DocsSiteFooter } from '@/components/docs-site-footer';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';

export default async function Page(props: PageProps<'/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      className="docs-article"
      breadcrumb={{ enabled: false }}
      tableOfContentPopover={{ enabled: false }}
      footer={{ children: <DocsSiteFooter /> }}
      tableOfContent={{
        container: { className: 'docs-toc' },
        list: { className: 'docs-toc-list' },
        footer: (
          <div className="docs-toc-actions">
            <MarkdownCopyButton markdownUrl={markdownUrl} />
          </div>
        ),
      }}
    >
      <DocsBreadcrumbs url={page.url} />
      <DocsTitle className="docs-title">{page.data.title}</DocsTitle>
      <DocsDescription className="docs-lead">{page.data.description}</DocsDescription>
      <DocsBody className="docs-body">
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      <EditOnGitHub href={githubUrl} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      types: {
        'text/markdown': getPageMarkdownUrl(page).url,
      },
    },
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
