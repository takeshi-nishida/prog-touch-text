import fs from 'fs';
import path from 'path';
import { bundleMDX } from 'mdx-bundler';
import rehypeSlug from 'rehype-slug';
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc';
import rehypeExtractTocExport from '@stefanprobst/rehype-extract-toc/mdx';

import type { ContentMeta } from '@/types/content';

function getAllMdxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) return getAllMdxFiles(res);
    if (entry.isFile() && res.endsWith('.mdx')) return [res];
    return [];
  });
}

export function getAllSlugs() {
  const baseDir = path.join(process.cwd(), 'data', 'text');
  const files = getAllMdxFiles(baseDir);
  return files.map(file => {
    const rel = path.relative(baseDir, file);
    const slugArr = rel.replace(/\.mdx$/, '').split(path.sep);
    return { slug: slugArr };
  });
}

const mdxCache = new Map<string, { code: string; frontmatter: any }>();

export async function getMdxBySlug(slugPath: string) {
  if (mdxCache.has(slugPath)) {
    return mdxCache.get(slugPath)!;
  }

  const filePath = path.join(process.cwd(), "data", "text", `${slugPath}.mdx`);
  const source = fs.readFileSync(filePath, "utf-8");

  const { code, frontmatter } = await bundleMDX<ContentMeta>({
    source,
    mdxOptions(options) {
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeExtractToc,
        [rehypeExtractTocExport, { name: 'toc' }]
      ];
      return options;
    }
  });

  const result = { code, frontmatter };
  mdxCache.set(slugPath, result);
  return result;
}