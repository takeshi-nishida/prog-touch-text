import { extractCodeFromPre } from "@/lib/react-utils";

export interface StepProps {
    children?: React.ReactNode;
    thoughts?: string;
    at?: string;
}

export function Step({ children, thoughts, at }: StepProps) {
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

export function isStepElement(node: React.ReactNode): node is React.ReactElement<StepProps> {
    return (
        node !== null &&
        typeof node === 'object' &&
        'type' in node &&
        (node.type === Step || (typeof node.type === 'function' && node.type.name === 'Step'))
    );
}