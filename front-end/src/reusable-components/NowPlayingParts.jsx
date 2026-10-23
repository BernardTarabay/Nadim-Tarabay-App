import { AudioEngine } from '@/audio/AudioEngine';
import { useAudioPlayer } from '@/audio/useAudioPlayer';
import styles from '../stylesheets/NowPlaying.module.css';

const STATUS_LABEL = {
  idle: 'Now playing',
  loading: 'Loading…',
  playing: 'Now playing',
  paused: 'Paused',
  blocked: 'Sound is off',
  limited: 'Preview ended',
  error: 'Unavailable',
};

export function WaveIcon() {
  const { status } = useAudioPlayer();
  return (
    <span className={styles.wave} data-state={status} aria-hidden="true">
      <svg className={styles.waveDesktop} width="24" height="24" viewBox="0 0 24 24">
        {[
          [3, 2],
          [6, 10],
          [9, 18],
          [12, 12],
          [15, 6],
          [18, 10],
          [21, 2],
        ].map(([x, h]) => (
          <line key={x} x1={x} x2={x} y1={12 - h / 2} y2={12 + h / 2} />
        ))}
      </svg>
      <span className={styles.waveMobile}>
        {[16, 24, 12, 18].map((h, i) => (
          <i key={i} style={{ height: h }} />
        ))}
      </span>
    </span>
  );
}

export function TrackLabel() {
  const { currentTrack, status } = useAudioPlayer();
  return (
    <span className={styles.track} aria-live="polite">
      <span key={STATUS_LABEL[status]} className={styles.status}>
        {STATUS_LABEL[status]}
      </span>{' '}
      <span key={currentTrack?.id} className={styles.title}>
        {currentTrack?.title}
        {currentTrack?.subtitle && (
          <span className={styles.subtitle}> ({currentTrack.subtitle})</span>
        )}
      </span>
    </span>
  );
}

export function SoundToggle({ className = '' }) {
  const player = useAudioPlayer();
  const on = AudioEngine.isAudible(player);
  return (
    <button
      type="button"
      className={`${styles.toggle} ${className}`}
      aria-pressed={on}
      aria-label="Sound"
      data-audio-control
      onClick={player.toggleSound}
    >
      Sound {on ? 'ON' : 'OFF'}
    </button>
  );
}
