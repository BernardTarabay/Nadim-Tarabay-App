import { useState } from 'react';
import { AudioEngine } from '@/audio/AudioEngine';
import { trackEvent } from '@/analytics/track';
import { useAudioPlayer } from '@/audio/useAudioPlayer';
import styles from '../stylesheets/VideoPlayer.module.css';

const embedUrl = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;

// A poster with a play button; the YouTube player only loads (and starts) once it is clicked.
export default function VideoPlayer({ youtubeId, title, poster, compact = false, className = '' }) {
  const [playing, setPlaying] = useState(false);
  const player = useAudioPlayer();

  const start = () => {
    // The site's background music would talk over the film.
    if (AudioEngine.isAudible(player)) player.toggleSound();
    trackEvent('video', youtubeId);
    setPlaying(true);
  };

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
      ) : (
        <button
          type="button"
          className={styles.poster}
          onClick={start}
          aria-label={`Play ${title}`}
        >
          <img src={poster.src} alt="" className={styles.posterImage} />
          <span className={styles.play} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
