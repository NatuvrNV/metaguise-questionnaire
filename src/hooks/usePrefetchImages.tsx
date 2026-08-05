import { useEffect, useRef } from "react";

/**
 * Warms the browser's image cache for a list of URLs during idle time,
 * so hover/selection swaps later feel instant instead of triggering a
 * fresh network fetch. Each unique cacheKey only ever prefetches once
 * per page session, even across remounts (e.g. navigating back a step).
 */
const prefetchedKeys = new Set<string>();

export function usePrefetchImages(urls: (string | undefined | null)[], cacheKey: string) {
  const idleHandle = useRef<number | null>(null);

  useEffect(() => {
    if (prefetchedKeys.has(cacheKey)) return;

    const run = () => {
      prefetchedKeys.add(cacheKey);
      urls.filter(Boolean).forEach((src) => {
        const img = new Image();
        img.src = src as string;
      });
    };

    if ("requestIdleCallback" in window) {
      idleHandle.current = window.requestIdleCallback(run, { timeout: 2000 });
      return () => {
        if (idleHandle.current !== null) window.cancelIdleCallback(idleHandle.current);
      };
    } else {
      const t = window.setTimeout(run, 300);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);
}