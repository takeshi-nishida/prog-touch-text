"use client";

import { useRef, useEffect } from 'react';
import { CodeBlock } from './CodeBlock';

type CodeWithPreviewProps = {
    code: string;
    language?: string;
    highlightLines?: number[];
    maskHighlight?: boolean;
    cursorLine?: number;
};

export function CodeWithPreview({ 
    code, 
    language = 'javascript', 
    highlightLines = [],
    maskHighlight = false,
    cursorLine 
}: CodeWithPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current && language === 'javascript') {
            const iframeDoc = `
                <!DOCTYPE html>
                <html>
                <head>
                    <script src="https://cdn.jsdelivr.net/npm/p5@1.11.10/lib/p5.min.js" integrity="sha256-epE25cW8bLDbZpBpzok5g2FUQbKcQ4jNCgopH098G5M=" crossorigin="anonymous"></script>
                    <style>
                        body { 
                            margin: 0; 
                            padding: 0; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            min-height: 100vh; 
                            background: #f0f0f0;
                        }
                    </style>
                </head>
                <body>
                    <script>
                        try { 
                            ${code} 
                        } catch (error) { 
                            document.body.innerHTML = '<div style="color: red; padding: 20px; font-family: monospace;">エラー: ' + error.message + '</div>'; 
                        }
                    </script>
                </body>
                </html>
            `;
            
            iframeRef.current.srcdoc = iframeDoc;
        }
    }, [code, language]);

    return (
        <div className="flex gap-4">
            <div className="flex-2">
                <CodeBlock 
                    code={code}
                    language={language}
                    highlightLines={highlightLines}
                    maskHighlight={maskHighlight}
                    cursorLine={cursorLine}
                />
            </div>
            
            <div className="flex-1">
                <div className="border border-gray-500 rounded my-4 overflow-hidden">
                    <div className="bg-gray-100 px-3 py-1 border-b border-gray-500 text-sm font-medium">
                        実行結果
                    </div>
                    <iframe
                        ref={iframeRef}
                        className="w-full h-80 bg-white"
                        title="p5.js preview"
                        sandbox="allow-scripts allow-same-origin"
                        allow="accelerometer; gyroscope"
                    />
                </div>
            </div>
        </div>
    );
}