"use client";

import type { ComponentProps } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { useIsDarkMode } from '@/lib/use-dark-mode';

export function InlineCode(props: ComponentProps<'code'>) {
    const isDark = useIsDarkMode();
    const codeString = typeof props.children === 'string' ? props.children : String(props.children);

    return (
        <Highlight
            theme={isDark ? themes.vsDark : themes.github}
            code={codeString}
            language="jsx" // all inline code in this project will be Javascript or HTML so we use jsx
        >
            {({ className, style, tokens, getTokenProps }) => (
                <code
                    className={`${className} border border-gray-300 dark:border-gray-700 rounded px-1.5 py-0.5 text-sm`}
                    style={style}
                >
                    {tokens[0].map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                    ))}
                </code>
            )}
        </Highlight>
    );
}
