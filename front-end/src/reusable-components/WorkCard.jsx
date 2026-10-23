import PlayButton from '@/reusable-components/PlayButton';
import Button from '@/reusable-components/Button';
import Icon from '@/reusable-components/Icon';
import WorkTitle from '@/reusable-components/WorkTitle';
import { reveal } from '@/utils/reveal';
import styles from '../stylesheets/WorkCard.module.css';

export default function WorkCard({ work, onViewScore }) {
  const position = work.coverPosition ?? {};
  return (
    <article ref={reveal} className={styles.card} aria-labelledby={`work-${work.id}`}>
      {work.cover && (
        <div className={`${styles.cover} ${work.coverIsTitlePage ? styles.titlePage : ''}`}>
          <img
            src={work.cover}
            alt=""
            loading="lazy"
            style={{
              '--pos-desktop': position.desktop ?? '50% 50%',
              '--pos-mobile': position.mobile ?? position.desktop ?? '50% 50%',
            }}
          />
        </div>
      )}
      <div className={styles.info}>
        <div className={styles.text}>
          <h3 id={`work-${work.id}`} className={styles.title}>
            <WorkTitle title={work.title} titleAr={work.titleAr} year={work.year} />
          </h3>
          {work.description && <p className={styles.description}>{work.description}</p>}
          <p className={styles.description}>{work.commission}</p>
        </div>
        <div className={styles.actions}>
          {work.track && (
            <PlayButton
              track={work.track}
              label="Play"
              name={work.title}
              variant="dark"
              className={styles.action}
            />
          )}
          {work.score && (
            <Button
              variant="outline"
              className={styles.action}
              onClick={() => onViewScore(work)}
              aria-label={`View score of ${work.title}`}
              aria-haspopup="dialog"
            >
              <Icon name="score-book" />
              View Score
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
