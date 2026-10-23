const STAGGER_MS = 60;
const MAX_STAGGER_STEPS = 4;

let observer = null;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      let step = 0;
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        const delay = Math.min(step, MAX_STAGGER_STEPS) * STAGGER_MS;
        target.style.setProperty('--reveal-delay', `${delay}ms`);
        target.dataset.reveal = 'in';
        step += 1;
      });
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  return observer;
}

/**
 * Ref callback: fades the element in the first time it scrolls into view ([data-reveal] in base.css).
 * Elements that arrive together, like a row of cards, come in as a short cascade.
 */
export function reveal(node) {
  if (!node || node.dataset.reveal === 'in' || typeof IntersectionObserver === 'undefined') {
    return undefined;
  }
  const io = getObserver();
  node.dataset.reveal = '';
  io.observe(node);
  return () => io.unobserve(node);
}
