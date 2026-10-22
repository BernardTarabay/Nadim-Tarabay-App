import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Open modals; the page scrolls again only when the last one closes, whatever the closing order. */
let openCount = 0;

export function useModal(ref, open, onClose) {
  useEffect(() => {
    if (!open || !ref.current) return undefined;
    const node = ref.current;
    const previous = document.activeElement;
    openCount += 1;
    document.body.style.overflow = 'hidden';
    node.querySelector(FOCUSABLE)?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = [...node.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      openCount -= 1;
      if (openCount === 0) document.body.style.overflow = '';
      previous?.focus?.({ preventScroll: true });
    };
  }, [ref, open, onClose]);
}
