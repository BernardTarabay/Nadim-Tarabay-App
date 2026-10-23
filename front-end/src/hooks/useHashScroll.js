import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SETTLE_MS = 2500;
const CHECK_MS = 60;
const USER_EVENTS = ['wheel', 'touchmove', 'keydown', 'pointerdown'];

// A malformed escape (a link ending in "#%") would throw; such a hash has no target anyway.
const decodeHash = (hash) => {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return '';
  }
};

export function useHashScroll() {
  const { hash, key } = useLocation();

  useEffect(() => {
    const id = decodeHash(hash);
    if (!id) return undefined;
    const started = performance.now();
    let lastTop = null;
    let timer = 0;
    let stopped = false;

    const stop = () => {
      stopped = true;
      clearTimeout(timer);
      USER_EVENTS.forEach((type) => window.removeEventListener(type, stop));
    };

    const check = () => {
      const target = document.getElementById(id);
      if (target) {
        const top = Math.round(target.getBoundingClientRect().top + window.scrollY);
        if (top !== lastTop) {
          lastTop = top;
          target.scrollIntoView({ behavior: 'instant' });
        }
      }
      if (!stopped && performance.now() - started < SETTLE_MS) timer = setTimeout(check, CHECK_MS);
    };

    USER_EVENTS.forEach((type) => window.addEventListener(type, stop, { passive: true }));
    check();
    return stop;
  }, [hash, key]);
}
