import Icon from '@/reusable-components/Icon';
import VideoPlayer from '@/reusable-components/VideoPlayer';
import {
  ZAGHARID_CHANNEL_URL,
  ZAGHARID_EPISODES,
  thumbnailUrl,
  videoUrl,
} from '@/data/zagharidEpisodes';
import { reveal } from '@/utils/reveal';
import styles from '../stylesheets/EpisodeArchive.module.css';

export default function EpisodeArchive({ id, title, description }) {
  return (
    <section className={styles.archive} aria-labelledby={id}>
      <header ref={reveal} className={styles.header}>
        <h2 id={id} className={styles.title}>
          {title}
        </h2>
        <p className={styles.description}>{description}</p>
        <a
          className={styles.channel}
          href={ZAGHARID_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="youtube" size={24} />
          Visit the channel on YouTube
        </a>
      </header>

      <ul className={styles.grid}>
        {ZAGHARID_EPISODES.map((episode) => (
          <li key={episode.id} ref={reveal} className={styles.card}>
            <VideoPlayer
              compact
              youtubeId={episode.youtubeId}
              title={`${episode.title}${episode.guest ? `, ${episode.guest}` : ''}`}
              poster={{ src: thumbnailUrl(episode.youtubeId) }}
            />
            <div className={styles.text}>
              <p className={styles.label}>{episode.label}</p>
              <h3 className={styles.name}>{episode.title}</h3>
              {episode.guest && <p className={styles.guest}>{episode.guest}</p>}
            </div>
            <a
              className={styles.link}
              href={videoUrl(episode.youtubeId)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${episode.title} on YouTube (opens in a new tab)`}
            >
              Watch on YouTube
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
