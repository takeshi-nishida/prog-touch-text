import React from 'react';
import Link from 'next/link';
import type { LinkData } from '@/types/link';

export function Breadcrumbs({ items }: { items: LinkData[] }) {
    if (!items?.length) return null;
    return (
        <nav aria-label="Breadcrumb">
            <div className="flex items-center text-sm">
                {items.map((item, idx) => (
                    <React.Fragment key={item.href}>
                        {idx < items.length - 1 ? (
                            <>
                                <Link href={item.href} className="text-blue-600 dark:text-blue-400 hover:underline">{item.title}</Link>
                                <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
                            </>
                        ) : (
                            <span aria-current="page" className="text-gray-600 dark:text-gray-400 font-medium">{item.title}</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </nav>
    );
}
