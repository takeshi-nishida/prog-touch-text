"use client";

import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import type { ComponentProps } from 'react';
import { isValidElement } from 'react';

import { InlineCode } from '@/components/InlineCode';
import { CodeBlock } from './CodeBlock';

const components = {
  h1: (props: ComponentProps<'h1'>) => <h1 className="text-3xl font-bold my-4" {...props} />,
  h2: (props: ComponentProps<'h2'>) => <h2 className="text-2xl font-bold my-3" {...props} />,
  h3: (props: ComponentProps<'h3'>) => <h3 className="text-xl font-bold my-2" {...props} />,
  p: (props: ComponentProps<'p'>) => <p className="my-2" {...props} />,
  a: (props: ComponentProps<'a'>) => <a className="text-blue-600 underline" {...props} />,
  ul: (props: ComponentProps<'ul'>) => <ul className="list-disc list-inside my-2" {...props} />,
  code: (props: ComponentProps<'code'>) => {
    const className = props.className || '';
    const isBlock = className.startsWith('language-');
    if (isBlock) return <code {...props} />;
    return <InlineCode {...props} />;
  },
  pre: (props: ComponentProps<'pre'>) => {
    const codeElement = props.children; // supposed to be a <code> element
    // TODO: check if codeElement is a valid React element and of type 'code'

    // extract the code string and language from the <code> element
    const codeString = (codeElement as any).props?.children || '';
    const code = typeof codeString === 'string' ? codeString : String(codeString);    
    const language = props.className?.replace('language-', '').trim() || 'javascript';

    return <CodeBlock code={code} language={language} {...props} />;
  },
};

export default function MdxPageRenderer({ code }: { code: string }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return <article className="max-w-4xl mx-auto mt-8"><Component components={components} /></article>;
}