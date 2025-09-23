import { getAllSlugs, getMdxBySlug } from '@/lib/mdx-utils';
import MdxPageRenderer from '@/components/MdxPageRenderer';

export const generateMetadata = async ({ params }: { params: { slug: string[] } }) => {
    const { slug } = await params;
    return {
        title: `${slug.join('/')}`,
        description: 'A page about ' + slug.join('/'),
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string[] }>
}) {
    const { slug } = await params;
    const { code } = await getMdxBySlug(slug.join('/'));

    return <MdxPageRenderer code={code} />;
}

export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs;
}

export const dynamicParams = false