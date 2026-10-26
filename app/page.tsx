import Link from "next/link";

import type { Chapter } from "@/types/chapter";
import { getAllChapters } from "@/lib/chapters";
import { getMdxBySlug } from "@/lib/mdx-utils";

async function ChapterTable({ chapter }: { chapter: Chapter }) {
  const slugPaths = chapter.pages.map(slug => [chapter.slug, slug].join('/'));
  const tableRows = await Promise.all(slugPaths.map(async path => {
    const { frontmatter } = await getMdxBySlug(path);
    const { title, slug, keywords } = frontmatter;
    return { title, slug, keywords, path };
  }));

  return (
    <table className="mt-2 w-full table-auto">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-left">
          <th className="px-2 py-1">Title</th>
          <th className="px-2 py-1">Keywords</th>
        </tr>
      </thead>
      <tbody>
        {tableRows.map(({ title, slug, keywords, path }) => (
          <tr key={slug} className="border-y border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors">
            <td className="px-2 py-1"><Link href={`/${path}`} className="text-blue-700 dark:text-blue-400 hover:underline">{title}</Link></td>
            <td className="px-2 py-1 text-gray-700 dark:text-gray-300">{keywords.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function Home() {
  const chapters = await getAllChapters(); // sorted by order

  return (
    <div className="flex min-h-screen flex-col items-center justify-center pt-12 px-4 sm:px-16">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Welcome to ProgTouch-Text!</h1>
      </header>
      <main className="flex flex-1 flex-col w-full max-w-4xl">
        <div className="mt-4">
          {chapters.map(chapter => (
            <section key={chapter.title} className="pb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{chapter.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{chapter.description}</p>
              <ChapterTable chapter={chapter} />
            </section>
          ))}
        </div>
      </main>
      <footer className="flex h-24 w-full items-center justify-center border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} ProgTouch-Text
      </footer>
    </div>
  );
}
