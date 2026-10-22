import Icon from '@/reusable-components/Icon';
import styles from '../stylesheets/ScoreBook.module.css';

export default function ScoreBook({ score, selected, onSelect }) {
  return (
    <article className={`${styles.book} ${selected ? styles.selected : ''}`}>
      <div className={styles.stage}>
        <img className={styles.cover} src={score.score.cover} alt="" loading="lazy" />
        <Icon name="play-circle" size={32} className={styles.play} />
      </div>
      <h2 className={styles.title}>
        <button
          type="button"
          className={styles.button}
          onClick={onSelect}
          aria-pressed={selected}
          data-score={score.id}
          data-audio-control
        >
          {score.title}
        </button>
      </h2>
      <p className={styles.meta}>
        {[score.instrumentation, score.year].filter(Boolean).join(' · ')}
      </p>
    </article>
  );
}
