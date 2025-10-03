import React from 'react';

function isElementType(node: React.ReactNode, typeName: string): boolean {
  if (!React.isValidElement(node)) return false;
  const { type } = node;
  if (typeof type === 'string') return type === typeName;
  else if (typeof type === 'function') return type.name === typeName;
  return false;
}

function isReactElementWithChildren(node: React.ReactNode): node is React.ReactElement & { props: { children: React.ReactNode } } {
  if (!React.isValidElement(node)) return false;
  if (typeof node.props !== 'object' || node.props === null) return false; 
  return 'children' in node.props;
}

export function isCodeElement(node: React.ReactNode): node is React.ReactElement<{ children?: React.ReactNode }> {
  return isElementType(node, 'code');
}

export function isPreElement(node: React.ReactNode): node is React.ReactElement<{ children: React.ReactNode }> {
  return isElementType(node, 'pre');
}

export function extractCodeFromPre(preElement: React.ComponentProps<'pre'>): { code: string; language: string, preview: boolean } | null {
    const codeElement = preElement.children;
    if(!isCodeElement(codeElement) || typeof codeElement.props.children !== 'string') return null;

    const code = codeElement.props.children.trimEnd();

    const codeProps = codeElement.props;
    if(!('className' in codeProps) || typeof codeProps.className !== 'string') return { code, language: 'plaintext', preview: false };

    const className = codeProps.className;
    const language = className?.split(',')[0].replace('language-', '').trim() || 'javascript';
    const preview = className.includes('preview');
    return { code, language, preview };
}

export function findPreElement(node: React.ReactNode): React.ReactElement<{ children: React.ReactNode }> | null {
  if (!node) return null;
  if (isPreElement(node)) return node;

  if (isReactElementWithChildren(node)) {
    for (const child of React.Children.toArray(node.props.children)) {
      const result = findPreElement(child);
      if (result) return result;
    }
  }

  return null;
}