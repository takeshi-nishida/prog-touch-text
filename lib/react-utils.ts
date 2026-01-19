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

export function extractCodeFromPre(preElement: React.ComponentProps<'pre'>): { code: string; language: string, preview: boolean, highlightLines: number[] } | null {
    const codeElement = preElement.children;
    if(!isCodeElement(codeElement) || typeof codeElement.props.children !== 'string') return null;

    const code = codeElement.props.children.trimEnd();

    const codeProps = codeElement.props;
    if(!('className' in codeProps) || typeof codeProps.className !== 'string') return { code, language: 'plaintext', preview: false, highlightLines: [] };

    const className = String(codeProps.className);

    const languageToken = className.split(/[\s,{]+/)[0] || '';
    const language = languageToken.replace(/^language-/, '') || 'javascript';
    
    const preview = className.includes('preview');

    const braceMatch = className.match(/\{([^}]+)\}/);
    const braceContent = braceMatch ? braceMatch[1] : undefined;
    const highlightLines = parseLineList(braceContent);
    
    return { code, language, preview, highlightLines };
}

function parseLineList(spec?: string): number[] {
  if (!spec) return [];
  const s = spec.trim();
  if (!s) return [];

  const tokens = s.split(/[,;\s]+/).map(t => t.trim()).filter(Boolean);
  const set = new Set<number>();

  for (const tok of tokens) {
    const rangeMatch = tok.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
        for (let i = start; i <= end; i++) set.add(i);
      }
      continue;
    }

    const n = parseInt(tok, 10);
    if (!isNaN(n) && n > 0) set.add(n);
  }

  return Array.from(set).sort((a, b) => a - b);
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