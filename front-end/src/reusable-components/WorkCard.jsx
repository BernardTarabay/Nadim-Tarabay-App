import PlayButton from '@/reusable-components/PlayButton';
import Button from '@/reusable-components/Button';
import ContactButton from '@/reusable-components/ContactButton';
import Icon from '@/reusable-components/Icon';
import WorkTitle from '@/reusable-components/WorkTitle';
import { PREVIEW } from '@/data/playlist';
import { reveal } from '@/utils/reveal';
import { formatLength } from '@/utils/text';
import styles from '../stylesheets/WorkCard.module.css';

/** How long the recording runs; a preview says it is a sample, and that the rest is on request. */
function TrackLength({ work }) {
  const length = formatLength(work.track.duration);
  if (!PREVIEW.trackIds.includes(work.track.id)) {
    return <p className={styles.length}>Full recording · {length}</p>;
  }
  return (
    <p className={styles.length}>
      Sample: the first {Math.round(PREVIEW.seconds / 60)} minutes of a {length} work. The full
      recording is{' '}
      <ContactButton
        variant="text"
        prefill={{
          reason: 'Recording access request',
          message: `I would like to request the full recording of ${work.title}.`,
        }}
      >
        available on request
      </ContactButton>
      .
    </p>
  );
}

export default function WorkCard({ work, onViewScore }) {
  const position = work.coverPosition ?? {};
  const preview = work.track && PREVIEW.trackIds.includes(work.track.id);
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
        {work.track && <TrackLength work={work} />}
        <div className={styles.actions}>
          {work.track && (
            <PlayButton
              track={work.track}
              label={preview ? 'Play sample' : 'Play'}
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
