import { useCallback, useEffect, useState } from 'react';
import Icon from '@/reusable-components/Icon';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import styles from '../stylesheets/Carousel.module.css';

const OFFSETS = [-2, -1, 0, 1, 2];

export default function Carousel({ items, label, renderSlide, interval = 7000 }) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [moving, setMoving] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const count = items.length;
  const at = (offset) => items[(((index + offset) % count) + count) % count];

  const go = useCallback(
    (direction) => {
      if (moving) return;
      if (reducedMotion) setIndex((i) => (i + direction + count) % count);
      else setMoving(direction);
    },
    [moving, reducedMotion, count],
  );

  const onTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || !moving) return;
    setIndex((i) => (i + moving + count) % count);
    setMoving(0);
  };

  useEffect(() => {
    if (paused || stopped || reducedMotion || moving || count < 2) return undefined;
    const timer = setTimeout(() => {
      if (document.visibilityState === 'visible') go(-1);
    }, interval);
    return () => clearTimeout(timer);
  }, [paused, stopped, reducedMotion, moving, count, interval, go, index]);

  return (
    <section
      className={styles.carousel}
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setPaused(false)}
    >
      <div
        className={`${styles.track} ${moving ? styles.moving : ''}`}
        style={{ '--shift': -moving }}
        onTransitionEnd={onTransitionEnd}
      >
        {OFFSETS.map((offset) => {
          const item = at(offset);
          const active = offset === 0;
          return (
            <div
              key={offset}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${((((index + offset) % count) + count) % count) + 1} of ${count}`}
              aria-hidden={!active}
              inert={!active}
            >
              {renderSlide(item, active)}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.prev}`}
        onClick={() => go(-1)}
        aria-label="Previous conversation"
      >
        <Icon name="arrow-circle" />
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        onClick={() => go(1)}
        aria-label="Next conversation"
      >
        <Icon name="arrow-circle" />
      </button>

      {!reducedMotion && (
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setStopped((value) => !value)}
          aria-label={stopped ? 'Play slideshow' : 'Pause slideshow'}
        >
          <Icon name={stopped ? 'play-circle' : 'pause-circle'} size={32} />
        </button>
      )}

      <p className="visually-hidden" aria-live={paused || stopped ? 'polite' : 'off'}>
        Slide {index + 1} of {count}
      </p>
    </section>
  );
}
