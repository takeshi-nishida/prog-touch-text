import React from 'react';

function isObject(o: any): o is object {
  return o !== null && typeof o === 'object';
}

function isReactElementWithType(node: React.ReactNode): node is React.ReactElement {
  return (isObject(node) && 'type' in node && 'props' in node);
}

function isReactElementWithChildren(node: React.ReactNode): node is React.ReactElement & { props: { children: React.ReactNode } } {
  return (
    isReactElementWithType(node) &&
    isObject(node.props) &&
    'children' in node.props
  );
}

export function isCodeElement(node: React.ReactNode): node is React.ReactElement<{ children?: React.ReactNode }> {
  return (
    isReactElementWithType(node) &&
    (node.type === 'code' || node.type?.toString().includes('code'))
  );
}

export function isCodeElementWithString(node: React.ReactNode): node is React.ReactElement<{ children: string }> {
  return (
    isCodeElement(node) &&
    typeof node.props.children === 'string'
  );
}

export function isPreElement(node: React.ReactNode): node is React.ReactElement<{ children: React.ReactNode }> {
  return (
    isReactElementWithType(node) &&
    (node.type === 'pre' || node.type?.toString().includes('pre'))
  );
}

export function extractLanguageFromClassName(className?: string): string {
  return className?.replace('language-', '').trim() || 'javascript';
}

export function extractCodeFromPre(preElement: React.ComponentProps<'pre'>): { code: string; language: string } | null {
    const codeElement = preElement.children;    
    if (!isCodeElementWithString(codeElement)) return null;

    const code = codeElement.props.children.trimEnd();

    const language = extractLanguageFromClassName(preElement.className);
    return { code, language };
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