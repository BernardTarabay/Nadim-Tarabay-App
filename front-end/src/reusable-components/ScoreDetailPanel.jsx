import { useEffect, useRef } from 'react';
import { usePlayControl } from '@/audio/usePlayControl';
import { useAudioPlayer, useAudioProgress } from '@/audio/useAudioPlayer';
import Icon from '@/reusable-components/Icon';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useModal } from '@/hooks/useModal';
import { SITE } from '@/config/site';
import { formatTime } from '@/utils/text';
import styles from '../stylesheets/ScoreDetailPanel.module.css';

function Transport({ track, title }) {
  const { state, toggle } = usePlayControl(track);
  const { muted, toggleMute, seek } = useAudioPlayer();
  const progress = useAudioProgress();
  const isCurrent = state !== 'idle';
  const current = isCurrent ? progress.currentTime : 0;
  const duration = isCurrent ? progress.duration : NaN;
  const percent = Number.isFinite(duration) && duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className={styles.transport}>
      <button
        type="button"
        className={styles.iconButton}
        onClick={toggle}
        data-audio-control
        aria-label={`${state === 'playing' ? 'Pause' : 'Play'} ${title}`}
      >
        <Icon name={state === 'playing' ? 'pause-circle' : 'play-circle'} size={24} />
      </button>
      <input
        type="range"
        className={styles.progress}
        min={0}
        max={Number.isFinite(duration) ? duration : 0}
        step={0.1}
        value={current}
        onChange={(event) => seek(Number(event.target.value))}
        disabled={!Number.isFinite(duration)}
        aria-label="Seek"
        aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
        style={{ '--progress': `${percent}%` }}
        data-audio-control
      />
      <span className={styles.time}>
        {{ loading: 'Loading…', error: 'Unavailable' }[state] ??
          `${formatTime(current)} / ${formatTime(duration)}`}
      </span>
      <button
        type="button"
        className={styles.iconButton}
        onClick={toggleMute}
        aria-pressed={muted}
        aria-label="Mute"
        data-audio-control
      >
        <Icon name={muted ? 'volume-off' : 'volume'} size={16} />
      </button>
    </div>
  );
}

export default function ScoreDetailPanel({ score, onClose, onFullscreen }) {
  const ref = useRef(null);
  const overlay = useMediaQuery('(max-width: 767px)');
  useModal(ref, overlay, onClose);

  useEffect(() => {
    if (!overlay) ref.current?.focus({ preventScroll: true });
  }, [score.id, overlay]);

  const onKeyDown = (event) => {
    if (!overlay && event.key === 'Escape') onClose();
  };

  return (
    <>
      {overlay && <div className={styles.backdrop} aria-hidden="true" onClick={onClose} />}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <section
        ref={ref}
        className={styles.panel}
        aria-labelledby="score-detail-title"
        role={overlay ? 'dialog' : undefined}
        aria-modal={overlay || undefined}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <div className={styles.nav}>
          <button type="button" className={styles.back} onClick={onClose}>
            <Icon name="chevron-left" size={16} />
            Back to Library
          </button>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </div>

        <header className={styles.heading}>
          <h2 id="score-detail-title" className={styles.title}>
            {score.title}
          </h2>
          <p className={styles.meta}>
            {[score.instrumentation, score.year].filter(Boolean).join(' · ')}
          </p>
        </header>

        <img
          className={styles.preview}
          src={score.score.cover}
          alt={`Title page of the score of ${score.title}`}
        />

        <div className={styles.credit}>
          <p className={styles.creditTitle}>{score.title}</p>
          <p className={styles.creditName}>{SITE.name}</p>
        </div>

        {score.track && <Transport track={score.track} title={score.title} />}

        {score.description && <p className={styles.description}>{score.description}</p>}

        <button
          type="button"
          className={styles.fullscreen}
          onClick={onFullscreen}
          aria-haspopup="dialog"
        >
          <Icon name="maximize" size={16} />
          View Fullscreen
        </button>
      </section>
    </>
  );
}
