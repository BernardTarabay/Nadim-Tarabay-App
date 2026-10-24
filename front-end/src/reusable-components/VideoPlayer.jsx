import { useState } from 'react';
import { AudioEngine } from '@/audio/AudioEngine';
import { trackEvent } from '@/analytics/track';
import { useAudioPlayer } from '@/audio/useAudioPlayer';
import Icon from '@/reusable-components/Icon';
import styles from '../stylesheets/VideoPlayer.module.css';

const embedUrl = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

/**
 * A poster with a play button; the YouTube player only loads (and starts) once it is clicked.
 * An `external` film's owner has turned off embedding, so its poster opens it on YouTube instead.
 */
export default function VideoPlayer({
  youtubeId,
  title,
  poster,
  external = false,
  compact = false,
  className = '',
}) {
  const [playing, setPlaying] = useState(false);
  const player = useAudioPlayer();

  const start = () => {
    // The site's background music would talk over the film.
    if (AudioEngine.isAudible(player)) player.toggleSound();
    trackEvent('video', youtubeId);
    if (!external) setPlaying(true);
  };

  const cover = (
    <>
      <img src={poster.src} alt="" className={styles.posterImage} />
      <span className={styles.play} aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24">
          <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
        </svg>
      </span>
    </>
  );

  return (
    <div className={`${styles.frame} ${compact ? styles.compact : ''} ${className}`}>
      {playing ? (
        <iframe
          className={styles.embed}
          src={embedUrl(youtubeId)}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : external ? (
        <a
          className={styles.poster}
          href={watchUrl(youtubeId)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={start}
          aria-label={`Watch ${title} on YouTube (opens in a new tab)`}
        >
          {cover}
          <span className={styles.badge} aria-hidden="true">
            <Icon name="youtube" size={20} />
            Watch on YouTube
          </span>
        </a>
      ) : (
        <button
          type="button"
          className={styles.poster}
          onClick={start}
          aria-label={`Play ${title}`}
        >
          {cover}
        </button>
      )}
    </div>
  );
}
