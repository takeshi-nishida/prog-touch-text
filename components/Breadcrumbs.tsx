import React from 'react';
import Link from 'next/link';
import type { LinkData } from '@/types/link';


export function Breadcrumbs({ items }: { items: LinkData[] }) {
    if (!items?.length) return null;
    return (
        <nav aria-label="Breadcrumb">
            <div className="flex items-center">
                {items.map((item, idx) => (
                    <React.Fragment key={item.href}>
                        {idx < items.length - 1 ? (
                            <>
                                <Link href={item.href} className="text-blue-600 hover:underline">{item.title}</Link>
                                <span className="mx-2 text-gray-400">/</span>
                            </>
                        ) : (
                            <span aria-current="page" className="text-gray-500">{item.title}</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </nav>
    );
}
