import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/reusable-components/Icon';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useModal } from '@/hooks/useModal';
import ContactButton from './ContactButton';
import { ScoreDocument } from './ScoreDocument';
import styles from '../stylesheets/ScoreViewer.module.css';

const SWIPE_THRESHOLD = 50;

function useScoreDocument(source) {
  const [state, setState] = useState({ doc: null, error: null, source });
  useEffect(() => {
    let alive = true;
    let opened = null;
    ScoreDocument.open(source).then(
      (doc) => {
        opened = doc;
        if (alive) setState({ doc, error: null, source });
        else doc.dispose();
      },
      (error) => alive && setState({ doc: null, error, source }),
    );
    return () => {
      alive = false;
      opened?.dispose();
    };
  }, [source]);
  return state.source === source ? state : { doc: null, error: null };
}

function Page({ doc, index, title, onLeave }) {
  const [page, setPage] = useState({ index: -1, src: '' });
  useEffect(() => {
    let alive = true;
    doc.getPage(index).then((src) => alive && setPage({ index, src }));
    return () => {
      alive = false;
    };
  }, [doc, index]);

  if (index >= doc.pageCount) return <div className={styles.page} aria-hidden="true" />;
  const ready = page.index === index;
  if (doc.isLocked(index)) {
    return (
      <figure className={styles.page}>
        {ready && <img src={page.src} alt="" className={styles.locked} draggable="false" />}
        <figcaption className={styles.lockedNote}>
          Preview ends here. The full score is available on request.
          {index === doc.pages.length && (
            <ContactButton
              variant="dark"
              onNavigate={onLeave}
              prefill={{
                reason: 'Score access request',
                message: `I would like to request access to the full score of ${title}.`,
              }}
            >
              Request access
            </ContactButton>
          )}
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className={styles.page}>
      {ready ? (
        <img
          key={page.src}
          src={page.src}
          alt={`${title}, page ${index + 1} of ${doc.pageCount}`}
          className={styles.image}
          draggable="false"
        />
      ) : (
        <span className={styles.loading}>Loading page {index + 1}…</span>
      )}
    </figure>
  );
}

/** onLeave: closes everything in the way when "Request access" heads to the contact form (default: onClose). */
export default function ScoreViewer({ work, onClose, onLeave = onClose }) {
  const dialogRef = useRef(null);
  const swipeStart = useRef(null);
  const single = useMediaQuery('(max-width: 767px)');
  const perView = single ? 1 : 2;
  const { doc, error } = useScoreDocument(work.score);
  const [first, setFirst] = useState(0);
  useModal(dialogRef, true, onClose);

  const pageCount = doc?.pageCount ?? 0;
  const start = first - (first % perView);
  const canPrev = start > 0;
  const canNext = start + perView < pageCount;
  const go = (delta) =>
    setFirst((current) => {
      const aligned = current - (current % perView);
      return Math.min(Math.max(aligned + delta * perView, 0), Math.max(pageCount - 1, 0));
    });

  useEffect(() => {
    if (!doc) return;
    for (let i = start + perView; i < Math.min(start + 2 * perView, pageCount); i += 1) {
      doc.getPage(i).then((src) => {
        new Image().src = src;
      });
    }
  }, [doc, start, perView, pageCount]);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') go(1);
    else if (event.key === 'ArrowLeft' || event.key === 'PageUp') go(-1);
    else return;
    event.preventDefault();
  };

  const onPointerDown = (event) => {
    swipeStart.current = event.clientX;
  };
  const onPointerUp = (event) => {
    if (swipeStart.current === null) return;
    const dx = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
  };

  const shown = Array.from({ length: perView }, (_, i) => start + i);
  const range =
    pageCount === 0
      ? ''
      : perView === 1 || start + 1 >= pageCount
        ? `Page ${start + 1} of ${pageCount}`
        : `Pages ${start + 1}–${start + 2} of ${pageCount}`;

  return createPortal(
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={styles.backdrop}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Score: ${work.title}`}
        className={styles.dialog}
        onKeyDown={onKeyDown}
      >
        <button
          type="button"
          className={`${styles.nav} ${styles.prev}`}
          onClick={() => go(-1)}
          disabled={!canPrev}
          aria-label="Previous pages"
        >
          <Icon name="chevron-left" />
        </button>

        <div
          className={`${styles.book} ${single ? styles.single : ''}`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          <div className={styles.binding}>
            {doc &&
              shown.map((index) => (
                <Page key={index} doc={doc} index={index} title={work.title} onLeave={onLeave} />
              ))}
            {!doc && (
              <p className={styles.status}>
                {error ? 'This score could not be loaded.' : 'Opening score…'}
              </p>
            )}
            {!single && <span className={styles.spine} aria-hidden="true" />}
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close score">
            <Icon name="circle-x" />
          </button>
        </div>

        <button
          type="button"
          className={`${styles.nav} ${styles.next}`}
          onClick={() => go(1)}
          disabled={!canNext}
          aria-label="Next pages"
        >
          <Icon name="chevron-right" />
        </button>

        <p className={styles.counter} aria-live="polite">
          {range}
        </p>
      </div>
    </div>,
    document.body,
  );
}
