import Button from '@/reusable-components/Button';
import Icon from '@/reusable-components/Icon';
import { episodeUrl } from '@/data/zagharid';
import styles from '../stylesheets/EpisodeCard.module.css';

export default function EpisodeCard({ episode, variant }) {
  return (
    <article className={`${styles.episode} ${styles[variant]}`}>
      <div className={styles.media}>
        <img src={episode.image} alt="" loading="lazy" />
      </div>
      <div className={styles.details}>
        <div className={styles.text}>
          <h3 className={styles.guest}>{episode.guest}</h3>
          <p className={styles.title}>{episode.title}</p>
        </div>
        <Button
          variant={variant === 'slide' ? 'light' : 'dark'}
          font="sans"
          href={episodeUrl(episode)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.watch}
          aria-label={`Watch ${episode.guest}: ${episode.title} on YouTube (opens in a new tab)`}
        >
          Watch now
          {variant === 'slide' && <Icon name="youtube" size={24} />}
        </Button>
      </div>
    </article>
  );
}
