import { useCallback, useState } from 'react';

/** A callback ref plus the element's current content width, kept up to date as it resizes. */
export function useWidth() {
  const [width, setWidth] = useState(0);
  const ref = useCallback((node) => {
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}
