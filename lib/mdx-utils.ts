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

const mdxCache = new Map<string, { code: string; frontmatter: ContentMeta, mtime: number }>();

export async function getMdxBySlug(slugPath: string) {
  const filePath = path.join(process.cwd(), "data", "text", `${slugPath}.mdx`);
  const stat = fs.statSync(filePath);
  const mtime = stat.mtimeMs;

  const cacheEntry = mdxCache.get(slugPath);

  if (cacheEntry && cacheEntry.mtime === mtime) {
    const { mtime: _, ...rest } = cacheEntry;
    return rest;
  }

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

  const result = { code, frontmatter, mtime };
  mdxCache.set(slugPath, result);
  return { code, frontmatter };
}