"use client";

import { useState } from 'react';
import type { ComponentProps } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

type CodeBlockProps = {
    code: string;
    language?: string;
} & ComponentProps<'pre'>;

export function CodeBlock({ code, language = 'javascript', ...props }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    return (
        <div className="relative">
            <button
                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-sm px-2 py-1 rounded"
                onClick={handleCopy}
            >{ copied ? 'Copied!' : 'Copy' }</button>
            <Highlight
                theme={themes.github}
                code={code}
                language={language}
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        className={className + " border border-gray-500 rounded p-2 my-4 overflow-x-auto"}
                        style={style}
                        {...props}
                    >
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}