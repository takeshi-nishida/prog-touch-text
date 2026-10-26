"use client";

import { useState, useEffect } from 'react';

/**
 * Hook that listens to the system color scheme preference (prefers-color-scheme: dark).
 * Returns `false` on the server to prevent hydration mismatches.
 */
export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setIsDark(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDark;
}
