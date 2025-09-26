import { getAllSlugs, getMdxBySlug } from '@/lib/mdx-utils';
import MdxPageRenderer from '@/components/MdxPageRenderer';
import type { ContentMeta } from '@/types/content';
import type { LinkData } from '@/types/link';

export const generateMetadata = async ({ params }: { params: { slug: string[] } }) => {
    const { slug } = await params;
    const { frontmatter } = await getMdxBySlug(slug.join('/'));
    return {
        title: frontmatter.title,
        description: frontmatter.description,
    };
}

function breadcrumbs(frontmatter: ContentMeta) {
    const breadcrumbs: LinkData[] = [{ title: 'Home', href: '/' }];
    const { parent } = frontmatter;

    // For now there is no parent page, so this is commented out.
    // if(parent) {
    //     const chapter = getChapterBySlug(parent);
    //     breadcrumbs.push({ title: chapter?.title || 'Chapter', href: `/${parent}` });
    // }

    breadcrumbs.push({ title: frontmatter.title, href: `/${parent}/${frontmatter.slug}` });

    return breadcrumbs;
}

async function getNavigationLinks(frontmatter: ContentMeta) {
    const { prev, next, parent } = frontmatter;
    const links: { prev?: LinkData; next?: LinkData } = {};

    if (next) {
        const nextData = await getMdxBySlug(`${parent}/${next}`);
        links.next = { title: nextData.frontmatter.title, href: `/${parent}/${next}` };
    }

    if (prev) {
        const prevData = await getMdxBySlug(`${parent}/${prev}`);
        links.prev = { title: prevData.frontmatter.title, href: `/${parent}/${prev}` };
    }

    return links;
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string[] }>
}) {
    const { slug } = await params;
    const { code, frontmatter } = await getMdxBySlug(slug.join('/'));

    return <MdxPageRenderer code={code} breadcrumbs={breadcrumbs(frontmatter)} navigations={await getNavigationLinks(frontmatter)} />
}

export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs;
}

export const dynamicParams = false;