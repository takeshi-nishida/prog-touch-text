import { extractCodeFromPre } from "@/lib/react-utils";

export interface StepProps {
    children?: React.ReactNode;
    thoughts?: string;
    at?: string;
    undo?: number;
}

export type StepElement = React.ReactElement<StepProps>;

export function Step({ children, thoughts, at, undo }: StepProps) {
    console.log('Step component rendered with children:', children);

    const { code, language } = extractCodeFromPre({ children }) || { code: '', language: 'plaintext' };

    return (
        <div className="step border-l-4 border-green-500 pl-4 py-2 my-2 bg-white rounded-r">
            {children || <p>ステップ内容</p>}
            {thoughts && <p className="text-gray-500 italic">思考: {thoughts}</p>}
            {language && <p>written in {language}</p>}
        </div>
    );
}

export function isStepElement(node: React.ReactNode): node is StepElement {
    return (
        node !== null &&
        typeof node === 'object' &&
        'type' in node &&
        (node.type === Step || (typeof node.type === 'function' && node.type.name === 'Step'))
    );
}

export function resolveSteps(stepElements: StepElement[]): {
    resolvedSteps: StepElement[],
    undoneStep: StepElement | null,
    isUndoStep: boolean,
    shouldShowComparison: boolean,
} {
    const currentStep = stepElements[stepElements.length - 1];
    const isUndoStep = currentStep?.props.undo !== undefined;
    
    const resolvedSteps: StepElement[] = [];
    let undoneStep: StepElement | null = null;

    stepElements.forEach((step) => {
        if (step.props.undo) {
            for (let i = 0; i < step.props.undo; i++) {
                undoneStep = resolvedSteps.pop() ?? null;
            }
        } else {
            resolvedSteps.push(step);
        }
    });

    // Determine if we should show comparison
    // Case 1: On undo step and we have an undone step
    // Case 2: Previous step was undo, current step inserts code, and we have undone step
    const prevStepWasUndo = stepElements.length >= 2 && 
                           stepElements[stepElements.length - 2]?.props.undo !== undefined;
    
    const shouldShowComparison = 
        (isUndoStep && undoneStep !== null) || // Show what's being removed during undo
        (!isUndoStep && undoneStep !== null && currentStep?.props.at !== undefined && prevStepWasUndo); // Show comparison after undo

    return { 
        resolvedSteps, 
        undoneStep, 
        isUndoStep, 
        shouldShowComparison 
    };
}