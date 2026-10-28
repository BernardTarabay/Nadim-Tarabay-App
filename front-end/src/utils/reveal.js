const STAGGER_MS = 60;
const MAX_STAGGER_STEPS = 4;

let observer = null;
// The first render hydrates a pre-rendered page that is already on screen: elements in view then stay
// as they are instead of vanishing and fading back in. Later renders (page changes) reveal as usual.
let firstRender = true;
const shown = new WeakSet();

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
  if (
    !node ||
    node.dataset.reveal === 'in' ||
    shown.has(node) ||
    typeof IntersectionObserver === 'undefined'
  ) {
    return undefined;
  }
  if (firstRender) {
    // Runs once the whole first commit has attached its elements.
    queueMicrotask(() => {
      firstRender = false;
    });
    if (node.getBoundingClientRect().top < window.innerHeight) {
      shown.add(node);
      return undefined;
    }
  }
  const io = getObserver();
  node.dataset.reveal = '';
  io.observe(node);
  return () => io.unobserve(node);
}
