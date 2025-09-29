"use client";

import React, { useState, createContext, useContext } from 'react';
import { isStepElement } from './Step';
import { extractCodeFromPre, isPreElement, findPreElement } from '@/lib/react-utils';
import { CodeWithPreview } from './CodeWithPreview';

const ProgTouchEmbedContext = createContext(false);
export const useIsInProgTouchEmbed = () => useContext(ProgTouchEmbedContext);
export const ProgTouchEmbedProvider = ProgTouchEmbedContext.Provider;

export function ProgTouchEmbed({ children }: { children: React.ReactNode }) {
    const [currentStep, setCurrentStep] = useState(0);

    const stepElements = React.Children.toArray(children).filter(isStepElement);

    // Build code up to the current step
    const buildCode = () => {
        let resultLines: string[] = [];
        let highlightRange = { start: 0, end: 0 };

        stepElements.forEach((step, index) => {
            if (index > currentStep) return;

            const preElement = findPreElement(step.props.children);
            if (!preElement) return;

            const code = extractCodeFromPre(preElement?.props)?.code;
            if (!code) return;

            if (step.props.at) {
                const atMarker = `// @${step.props.at}`;
                const newLines: string[] = [];

                for (const line of resultLines) {
                    if (line.includes(atMarker)) {
                        const insertLineStart = newLines.length;
                        const codeLines = code.split('\n');
                        newLines.push(...codeLines);

                        if (index === currentStep && currentStep > 0) {
                            highlightRange = {
                                start: insertLineStart + 1, // 1-indexed
                                end: insertLineStart + codeLines.length
                            };
                        }
                    }
                    newLines.push(line);
                }
                resultLines = newLines;
            } else {
                resultLines = code.split('\n');
            }
        });

        const displayLines: string[] = [];
        let removedLines = 0;

        resultLines.forEach((line, index) => {
            if (line.trim().match(/^\/\/ @\w+$/)) {
                if (index < highlightRange.start - 1 + removedLines) {
                    removedLines++;
                }
            } else {
                displayLines.push(line);
            }
        });

        highlightRange = {
            start: highlightRange.start - removedLines,
            end: highlightRange.end - removedLines
        };

        return { code: displayLines.join('\n'), highlightRange };
    };

    const nextStep = () => {
        if (currentStep < stepElements.length - 1) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const reset = () => { setCurrentStep(0); }; 

    const thoughts = stepElements[currentStep]?.props.thoughts;
    const { code, highlightRange } = buildCode();

    return (
        <ProgTouchEmbedProvider value={true}>
            <div className="prog-touch-embed border rounded-lg p-4 my-4 bg-gray-50">

                {/* Controls */}
                <div className="controls flex gap-2 items-center">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        前へ
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={currentStep === stepElements.length - 1}
                        className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        次へ
                    </button>
                    <button
                        onClick={reset}
                        className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                        リセット
                    </button>
                    <span className="text-sm text-gray-600 flex items-center">
                        ステップ {currentStep + 1} / {stepElements.length}
                    </span>
                </div>

                <div className="progress mt-2 text-center">
                </div>

                {/* Thoughts display */}
                {thoughts && (
                    <div className="thoughts mb-4 p-3 bg-blue-50 border-l-2 border-blue-400 italic text-blue-800 flex items-center">
                        <span className="mr-2">{thoughts}</span>
                        <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}

                {/* Code display with preview */}
                <div className="code-display mb-4">
                    <CodeWithPreview
                        code={code}
                        language="javascript"
                        highlightLines={highlightRange ? Array.from({ length: highlightRange.end - highlightRange.start + 1 }, (_, i) => highlightRange.start + i) : []}
                    />
                </div>
            </div>
        </ProgTouchEmbedProvider>
    );
}