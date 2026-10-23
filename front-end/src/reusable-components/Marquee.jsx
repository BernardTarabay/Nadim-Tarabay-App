import { useEffect, useRef } from 'react';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMediaQuery';
import styles from '../stylesheets/Marquee.module.css';

const SETTLE_RATE = 2.5; // per second: how quickly a push eases back to the steady drift
const WHEEL_PUSH = 4; // px/s of speed added per px scrolled
const MAX_SPEED = 3000; // px/s
const DRAG_START_PX = 6;

const clamp = (speed) => Math.min(Math.max(speed, -MAX_SPEED), MAX_SPEED);

/**
 * Drifts the track to the right, and lets visitors push it along: scrolling over it speeds it up
 * (down or right pushes it right), and dragging moves it by hand, with a fling that coasts. Either
 * way it then eases back to the drift. Hovering or focusing it stops the drift so a logo is easy
 * to click. Returns a cleanup function.
 */
function drive(viewport, track, duration) {
  const list = track.firstElementChild;
  let loop = 0; // one copy of the list plus the gap after it: how far it moves before repeating
  let x = 0;
  let speed = 0;
  let hovered = false;
  let focused = false;
  let drag = null;
  let dragged = false;
  let frame = 0;
  let last = 0;
  let stopped = false;

  const measure = () => {
    loop = list.offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
  };

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (!drag?.moving) {
      const drift = hovered || focused ? 0 : loop / duration;
      speed = drift + (speed - drift) * Math.exp(-SETTLE_RATE * dt);
      x += speed * dt;
    }
    if (loop) x = ((x % loop) - loop) % loop;
    track.style.transform = `translate3d(${x}px, 0, 0)`;
    frame = requestAnimationFrame(tick);
  };

  const onWheel = (event) => {
    const sideways = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    // A sideways swipe belongs to the strip (and must not go back a page); scrolling down still
    // scrolls the page too, so the strip never traps the wheel.
    if (sideways) event.preventDefault();
    const delta = (sideways ? -event.deltaX : event.deltaY) * (event.deltaMode === 1 ? 16 : 1);
    speed = clamp(speed + delta * WHEEL_PUSH);
  };

  const onPointerDown = (event) => {
    dragged = false;
    if (event.button !== 0) return;
    const at = { lastX: event.clientX, lastTime: event.timeStamp };
    drag = { id: event.pointerId, startX: event.clientX, ...at, moving: false, speed: 0 };
  };

  const onPointerMove = (event) => {
    if (drag?.id !== event.pointerId) return;
    if (!drag.moving) {
      if (Math.abs(event.clientX - drag.startX) < DRAG_START_PX) return;
      drag.moving = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add(styles.dragging);
    }
    const dx = event.clientX - drag.lastX;
    const dt = (event.timeStamp - drag.lastTime) / 1000;
    x += dx;
    // Smooth the speed over quick moves; after a pause, only the latest move counts.
    if (dt > 0) drag.speed = dt > 0.05 ? dx / dt : 0.7 * (dx / dt) + 0.3 * drag.speed;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
  };

  const onPointerEnd = (event) => {
    if (drag?.id !== event.pointerId) return;
    if (drag.moving) {
      // Holding still before letting go means no fling.
      speed = event.timeStamp - drag.lastTime < 100 ? clamp(drag.speed) : 0;
      dragged = true;
      viewport.classList.remove(styles.dragging);
    }
    drag = null;
  };

  // A drag that ends on a logo shouldn't also open its link.
  const onClick = (event) => {
    if (!dragged) return;
    dragged = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const listeners = [
    ['wheel', onWheel, { passive: false }],
    ['pointerdown', onPointerDown],
    ['pointermove', onPointerMove],
    ['pointerup', onPointerEnd],
    ['pointercancel', onPointerEnd],
    ['click', onClick, true],
    ['dragstart', (event) => event.preventDefault()],
    ['pointerenter', () => (hovered = true)],
    ['pointerleave', () => (hovered = false)],
    ['focusin', () => (focused = true)],
    ['focusout', (event) => (focused = viewport.contains(event.relatedTarget))],
  ];
  listeners.forEach(([type, listener, options]) =>
    viewport.addEventListener(type, listener, options),
  );

  const resize = new ResizeObserver(measure);
  resize.observe(list);
  const visibility = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(frame);
    frame = 0;
    // An entry queued just before cleanup can still arrive; it must not restart the loop.
    if (stopped || !entry.isIntersecting) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  });
  visibility.observe(viewport);
  measure();

  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    resize.disconnect();
    visibility.disconnect();
    listeners.forEach(([type, listener, options]) =>
      viewport.removeEventListener(type, listener, options),
    );
    viewport.classList.remove(styles.dragging);
    track.style.transform = '';
  };
}

export default function Marquee({ items, renderItem, getKey, label, duration = 60 }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const stacked = useMediaQuery('(max-width: 767px)');
  const moving = !reducedMotion && !stacked;

  useEffect(() => {
    if (!moving) return undefined;
    return drive(viewportRef.current, trackRef.current, duration);
  }, [moving, duration]);

  return (
    <div ref={viewportRef} className={styles.viewport}>
      <div ref={trackRef} className={styles.track}>
        <ul className={styles.list} aria-label={label}>
          {items.map((item) => (
            <li key={getKey(item)}>{renderItem(item, false)}</li>
          ))}
        </ul>
        <ul className={`${styles.list} ${styles.copy}`} aria-hidden="true">
          {items.map((item) => (
            <li key={getKey(item)}>{renderItem(item, true)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
