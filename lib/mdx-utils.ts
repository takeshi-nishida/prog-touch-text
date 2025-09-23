import fs from 'fs';
import path from 'path';
import { bundleMDX } from 'mdx-bundler';

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

export async function getMdxBySlug(slugPath: string) {
  const filePath = path.join(process.cwd(), "data", "text", `${slugPath}.mdx`);
  const source = fs.readFileSync(filePath, "utf-8");

  const { code } = await bundleMDX({ source });

  return { code };
}