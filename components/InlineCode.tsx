import type { ComponentProps } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

export function InlineCode(props: ComponentProps<'code'>) {
    const codeString = typeof props.children === 'string' ? props.children : String(props.children);

    return (
        <Highlight
            theme={themes.github}
            code={codeString}
            language="jsx" // all inline code in this project will be Javascript or HTML so we use jsx
        >
            {({ className, style, tokens, getTokenProps }) => (
                <code className={className + " border border-gray-400 rounded px-2 py-1"} style={style}>
                    {tokens[0].map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                    ))}
                </code>
            )}
        </Highlight>
    );
}