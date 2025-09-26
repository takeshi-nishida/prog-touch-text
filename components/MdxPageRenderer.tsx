"use client";

import { useMemo } from 'react';
import { getMDXComponent, getMDXExport } from 'mdx-bundler/client';

import type { ComponentProps } from 'react';
import type { Toc, TocEntry } from '@stefanprobst/rehype-extract-toc';
import type { LinkData } from '@/types/link';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { InlineCode } from '@/components/InlineCode';
import { CodeBlock } from '@/components/CodeBlock';
import Link from 'next/link';

function TocSidebar({ toc }: { toc: Toc }) {
  return (
    <nav className="text-sm p-4 bg-blue-50 rounded-lg border border-blue-100 sticky top-8">
      <Link href="/" className="block mb-8 text-blue-700 hover:underline">Home</Link>
      <div className="font-bold mb-2">目次</div>
      <ul>
        {toc.map(item => (
          <TocListItem key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
}

function TocListItem({ item }: { item: TocEntry }) {
  return (
    <li className='my-2'>
      <a
        href={`#${item.id}`}
        className="hover:underline text-blue-700 cursor-pointer transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        tabIndex={0}
        aria-label={`Jump to ${item.value}`}
      >
        {item.value}
      </a>
      {item.children && (
        <ul className="ml-4">
          {item.children.map(child => (
            <TocListItem key={child.id} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

const components = {
  h1: (props: ComponentProps<'h1'>) => <h1 className="text-3xl font-bold my-4" {...props} />,
  h2: (props: ComponentProps<'h2'>) => <h2 className="text-2xl font-bold my-3" {...props} />,
  h3: (props: ComponentProps<'h3'>) => <h3 className="text-xl font-bold my-2" {...props} />,
  h4: (props: ComponentProps<'h4'>) => <h4 className="text-lg font-bold my-2" {...props} />,
  p: (props: ComponentProps<'p'>) => <p className="my-4" {...props} />,
  a: (props: ComponentProps<'a'>) => <a className="text-blue-600 underline" {...props} />,
  ul: (props: ComponentProps<'ul'>) => <ul className="list-disc list-inside ml-4 my-2" {...props} />,
  ol: (props: ComponentProps<'ol'>) => <ol className="list-decimal list-inside ml-4 my-2" {...props} />,
  li: (props: ComponentProps<'li'>) => <li className="my-1" {...props} />,
  code: (props: ComponentProps<'code'>) => {
    const className = props.className || '';
    const isBlock = className.startsWith('language-');
    if (isBlock) return <code {...props} />;
    return <InlineCode {...props} />;
  },
  pre: (props: ComponentProps<'pre'>) => {
    const codeElement = props.children; // supposed to be a <code> element

    if (!isCodeElement(codeElement)) return <pre {...props} />;

    const code = codeElement.props.children;
    const language = props.className?.replace('language-', '').trim() || 'javascript';

    return <CodeBlock code={code} language={language} {...props} />;
  },
  img: (props: ComponentProps<'img'>) => <img className="my-8 max-w-full max-h-[480px] mx-auto rounded-lg shadow-lg shadow-gray-500" {...props} />
};

function isCodeElement(node: React.ReactNode): node is React.ReactElement<{ children: string }> {
  return node !== null && typeof node === 'object' && 'type' in node && node.type === 'code';
}

export default function MdxPageRenderer({ code, breadcrumbs, navigations }:
   { code: string; breadcrumbs: LinkData[]; navigations: { prev?: LinkData; next?: LinkData } }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  const { toc } = useMemo(() => getMDXExport(code), [code]);

  return (
    <div className="flex gap-8">
      <aside className="w-64 shrink-0 hidden lg:block">
        <TocSidebar toc={toc} />
      </aside>
      <article className="max-w-4xl mx-auto mt-8 flex-1 leading-relaxed text-gray-800">
        <Breadcrumbs items={breadcrumbs} />
        <Component components={components} />
        <div className="flex justify-between my-8">
          {navigations.prev ? (
            <Link href={navigations.prev.href} className="text-blue-600 hover:underline">← Prev: {navigations.prev.title}</Link>
          ) : <div />}
          {navigations.next ? (
            <Link href={navigations.next.href} className="text-blue-600 hover:underline">Next: {navigations.next.title} →</Link>
          ) : <div />}
        </div>
      </article>
    </div>
  );
}