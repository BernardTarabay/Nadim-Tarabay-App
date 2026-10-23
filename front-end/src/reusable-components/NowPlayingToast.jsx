import { useEffect, useState } from 'react';
import { useAudioPlayer, useAudioProgress } from '@/audio/useAudioPlayer';
import Icon from '@/reusable-components/Icon';
import { SITE } from '@/config/site';
import { CATALOGUE } from '@/data/works';
import { formatTime } from '@/utils/text';
import styles from '../stylesheets/NowPlayingToast.module.css';

const SHOW_MS = 6000;

const COVERS = new Map(
  CATALOGUE.filter((work) => work.track && work.cover).map((work) => [work.track.id, work.cover]),
);

const percent = (seconds, duration) => `${(Math.min(seconds, duration) / duration) * 100}%`;

function Seek({ title, preview, previewSeconds, seek, onSeek }) {
  const { currentTime, duration } = useAudioProgress();
  const known = Number.isFinite(duration) && duration > 0;
  // The bar spans the whole work; a sample's share is lit up to where it ends, and seeking stops there.
  const limit = preview ? previewSeconds : duration;
  return (
    <>
      <input
        type="range"
        className={styles.seek}
        min={0}
        max={known ? duration : 0}
        step={1}
        value={known ? currentTime : 0}
        onChange={(event) => {
          seek(Number(event.target.value));
          onSeek();
        }}
        disabled={!known}
        aria-label={`Seek ${title}`}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}${
          preview ? `, the sample ends at ${formatTime(previewSeconds)}` : ''
        }`}
        style={
          known
            ? { '--progress': percent(currentTime, duration), '--limit': percent(limit, duration) }
            : undefined
        }
      />
      <div className={styles.times}>
        <span>{formatTime(known ? currentTime : NaN)}</span>
        {preview && (
          <span className={styles.limit}>Sample ends at {formatTime(previewSeconds)}</span>
        )}
        <span>{formatTime(duration)}</span>
      </div>
    </>
  );
}

/** Drops in at the top right when a track starts, like a macOS notification, then slips away. */
export default function NowPlayingToast() {
  const { currentTrack, status, preview, previewSeconds, play, pause, next, seek } =
    useAudioPlayer();
  const [announced, setAnnounced] = useState(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(0);

  // Each track is announced once, as it starts; pausing and resuming it doesn't bring this back.
  if (status === 'playing' && currentTrack && currentTrack.id !== announced) {
    setAnnounced(currentTrack.id);
    setOpen(true);
    setHovered(false);
  }

  // It stays while the pointer is over it or the keyboard is in it, and a while after the last seek.
  const held = hovered || focused;
  useEffect(() => {
    if (!open || held) return undefined;
    const timer = setTimeout(() => setOpen(false), SHOW_MS);
    return () => clearTimeout(timer);
  }, [open, held, announced, touched]);

  if (!currentTrack) return null;

  const playing = status === 'playing' || status === 'loading';
  const icon = playing ? 'pause-circle' : 'play-circle';
  const cover = COVERS.get(currentTrack.id);
  const close = () => {
    setOpen(false);
    setFocused(false);
  };

  return (
    // The listeners only hold it open while it's in use, and let Escape dismiss it.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <aside
      className={styles.toast}
      data-open={open}
      inert={!open}
      aria-label="Now playing"
      data-audio-control
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => event.target.matches(':focus-visible') && setFocused(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocused(false)}
      onKeyDown={(event) => event.key === 'Escape' && close()}
    >
      <button type="button" className={styles.close} onClick={close} aria-label="Dismiss">
        <Icon name="close" size={10} />
      </button>
      <div className={styles.row}>
        <span className={styles.cover}>
          {cover ? <img src={cover} alt="" /> : <Icon name="volume" size={20} />}
        </span>
        <div key={currentTrack.id} className={styles.text}>
          <p className={styles.label}>
            {status === 'paused' ? 'Paused' : 'Now playing'}
            {preview && ' · Sample'}
          </p>
          <p className={styles.title}>{currentTrack.title}</p>
          <p className={styles.artist}>{SITE.name}</p>
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            onClick={() => (playing ? pause() : play())}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            <Icon key={icon} name={icon} size={28} className={styles.glyph} />
          </button>
          <button type="button" className={styles.control} onClick={next} aria-label="Next track">
            <Icon name="skip-next" size={20} />
          </button>
        </div>
      </div>
      <Seek
        title={currentTrack.title}
        preview={preview}
        previewSeconds={previewSeconds}
        seek={seek}
        onSeek={() => setTouched((count) => count + 1)}
      />
    </aside>
  );
}
