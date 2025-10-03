"use client";

import { useState } from 'react';
import type { ComponentProps } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

type CodeBlockProps = {
    code: string;
    language?: string;
    highlightLines?: number[]; // Array of line numbers to highlight (1-indexed)
    maskHighlight?: boolean;   // Whether to mask the highlight (for educational purposes)
    cursorLine?: number;       // Single line number to show as cursor position (1-indexed)
    showCopyButton?: boolean;
} & ComponentProps<'pre'>;

export function CodeBlock({
    code,
    language = 'javascript',
    highlightLines = [],
    maskHighlight = false,
    cursorLine,
    showCopyButton = true,
    ...props
}: CodeBlockProps) {
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
            {showCopyButton && (<button
                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-sm px-2 py-1 rounded z-10"
                onClick={handleCopy}
            >{copied ? 'Copied!' : 'Copy'}</button>
            )}
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
                        {tokens.map((line, i) => {
                            const lineNumber = i + 1; // Convert to 1-indexed
                            const isHighlighted = highlightLines.includes(lineNumber);
                            const isCursor = cursorLine === lineNumber;

                            const { className: lineClassName, style: lineStyle, ...restLineProps } = getLineProps({ line });

                            return (
                                <div
                                    key={i}
                                    {...restLineProps}
                                    className={`
                                        ${lineClassName || ''}
                                        ${isHighlighted ? 'bg-yellow-100' : ''}
                                        ${isCursor ? 'bg-blue-50 border-l-4 border-blue-400 pl-2' : ''}
                                    `.trim()}
                                    style={{
                                        ...lineStyle,
                                        ...(isHighlighted ? { backgroundColor: '#fef3c7' } : {}),
                                        ...(isCursor ? { backgroundColor: '#eff6ff' } : {}),
                                    }}
                                >
                                    {line.map((token, key) => (
                                        // if maskHighlight and highlighted, replace all alphanumeric characters with dots
                                        maskHighlight && isHighlighted
                                            ? <span key={key} {...getTokenProps({ token: { ...token, content: token.content.replace(/\w/g, '•') } })} />
                                            : <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </div>
                            );
                        })}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}