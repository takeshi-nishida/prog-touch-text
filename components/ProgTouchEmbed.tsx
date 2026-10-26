"use client";

import React, { useState, createContext, useContext } from 'react';
import { isStepElement, resolveSteps } from './Step';
import { extractCodeFromPre, findPreElement } from '@/lib/react-utils';
import { CodeWithPreview } from './CodeWithPreview';
import { CodeBlock } from './CodeBlock';

const ProgTouchEmbedContext = createContext(false);
export const useIsInProgTouchEmbed = () => useContext(ProgTouchEmbedContext);
export const ProgTouchEmbedProvider = ProgTouchEmbedContext.Provider;

export function ProgTouchEmbed({ children }: { children: React.ReactNode }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [maskHighlight, setMaskHighlight] = useState(false);

    const stepElements = React.Children.toArray(children).filter(isStepElement);

    // Build code up to the current step
    const buildCode = () => {
        const { resolvedSteps, undoneStep, isUndoStep, shouldShowComparison } = resolveSteps(stepElements.slice(0, currentStep + 1));

        let resultLines: string[] = [];
        let highlightRange = { start: 0, end: 0 };

        resolvedSteps.forEach((step, index) => {
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

                        if (index === resolvedSteps.length - 1 && resolvedSteps.length > 1 && !isUndoStep) { // last step
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

        return { code: displayLines.join('\n'), highlightRange, undoneStep, isUndoStep, shouldShowComparison };
    };

    const nextStep = () => {
        if (currentStep < stepElements.length - 1) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const reset = () => { setCurrentStep(0); };

    const thoughts = stepElements[currentStep]?.props.thoughts;
    const { code, highlightRange, undoneStep, isUndoStep, shouldShowComparison } = buildCode();

    const undoneCode = React.useMemo(() => {
        if (!undoneStep) return "";
        const preElement = findPreElement(undoneStep.props.children);
        return preElement ? extractCodeFromPre(preElement.props)?.code || "" : "";
    }, [undoneStep]);

    return (
        <ProgTouchEmbedProvider value={true}>
            <div className="prog-touch-embed border border-gray-200 dark:border-gray-800 rounded-lg p-4 my-4 bg-gray-50 dark:bg-gray-900/60">

                {/* Controls */}
                <div className="controls flex gap-2 items-center flex-wrap">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-500 transition-colors"
                    >
                        前へ
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={currentStep === stepElements.length - 1}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:bg-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-500 transition-colors"
                    >
                        次へ
                    </button>
                    <button
                        onClick={reset}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded transition-colors"
                    >
                        リセット
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        ステップ {currentStep + 1} / {stepElements.length}
                    </span>
                    <button
                        className={`ml-auto px-3 py-1 rounded transition-transform ${maskHighlight
                            ? 'bg-red-500 hover:bg-red-600 text-white scale-105 shadow-lg'
                            : 'bg-blue-600 hover:bg-blue-700 text-white scale-100'
                            }`}
                        onClick={() => setMaskHighlight(!maskHighlight)}
                    >
                        {maskHighlight ? '挑戦モード中' : '通常モード中'}
                    </button>
                </div>

                {/* Thoughts display with undo styling */}
                {thoughts && (
                    <div className={`thoughts my-4 p-3 border-l-2 italic flex items-center ${isUndoStep
                            ? 'bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-500 text-red-800 dark:text-red-200'
                            : 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-500 text-blue-800 dark:text-blue-200'
                        }`}>
                        <span className="mr-2">{thoughts}</span>
                        {!isUndoStep && <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-3 h-3 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-3 h-3 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>}
                    </div>
                )}

                {/* Undone code display */}
                {shouldShowComparison && undoneStep && (
                    <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/40 border-l-2 border-red-300 dark:border-red-700">
                        <div className="text-red-600 dark:text-red-400 font-medium mb-2 text-sm">
                            {isUndoStep ? '削除:' : '前回:'}
                        </div>
                        <CodeBlock code={undoneCode} language="javascript" showCopyButton={false} className="text-xs" />
                    </div>
                )}

                {/* Code display with preview */}
                <div className="code-display mb-4">
                    <CodeWithPreview
                        code={code}
                        language="javascript"
                        highlightLines={highlightRange ? Array.from({ length: highlightRange.end - highlightRange.start + 1 }, (_, i) => highlightRange.start + i) : []}
                        maskHighlight={maskHighlight}
                    />
                </div>
            </div>
        </ProgTouchEmbedProvider>
    );
}
