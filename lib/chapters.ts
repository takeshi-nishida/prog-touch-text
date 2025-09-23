import fs from 'fs';
import path from 'path';
import { Chapter } from '../types/chapter';

export function getAllChapters(): Chapter[] {
    const chaptersDir = path.join(process.cwd(), 'data', 'text');
    const chapterDirs = fs.readdirSync(chaptersDir).filter(dir => {
        const fullPath = path.join(chaptersDir, dir);
        return fs.statSync(fullPath).isDirectory();
    });

    const chapters = chapterDirs.map(dir => {
        const chapterPath = path.join(chaptersDir, dir, 'index.json');
        const chapterData = fs.readFileSync(chapterPath, 'utf-8');
        return JSON.parse(chapterData) as Chapter;
    });

    // Sort chapters by their 'order' property
    chapters.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return chapters;
}

export function getChapterBySlug(slug: string): Chapter | undefined {
    const chapters = getAllChapters();
    return chapters.find(chapter => chapter.slug === slug);
}