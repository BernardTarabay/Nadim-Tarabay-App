import Button from '@/reusable-components/Button';
import SectionHeader from '@/reusable-components/SectionHeader';
import VideoPlayer from '@/reusable-components/VideoPlayer';
import { ADS } from '@/data/ads';
import { PATHS } from '@/config/site';
import styles from '../../stylesheets/AdsPage.module.css';

const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

export default function AdsPage() {
  const [featured, ...more] = ADS;

  return (
    <>
      <section className={styles.stage} aria-label={`${featured.title} ${featured.kind}`}>
        <VideoPlayer
          youtubeId={featured.youtubeId}
          title={`${featured.title}: ${featured.kind}`}
          poster={featured.poster}
          className={styles.video}
        />
      </section>

      <div className={`l-container ${styles.page}`}>
        <div className={styles.feature}>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>Ads · {featured.kind}</p>
            <h1 className={styles.title}>{featured.title}</h1>
            <p className={styles.subtitle}>
              {featured.subtitle} · {featured.year}
            </p>
          </header>

          <div className={styles.body}>
            <p className={styles.lead}>{featured.description}</p>
            <dl className={styles.details}>
              {featured.details.map(([term, value]) => (
                <div key={term} className={styles.detail}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.actions}>
              <Button variant="dark" to={PATHS.scores}>
                View the score
              </Button>
              <Button
                variant="outline"
                href={watchUrl(featured.youtubeId)}
                target="_blank"
                rel="noreferrer"
              >
                Watch on YouTube
              </Button>
            </div>
          </div>
        </div>

        {featured.stills.length > 0 && (
          <ul className={styles.stills} aria-label="Stills">
            {featured.stills.map((still) => (
              <li key={still.src}>
                <img src={still.src} alt={still.alt} className={styles.still} loading="lazy" />
              </li>
            ))}
          </ul>
        )}

        {more.length > 0 && (
          <section className={styles.more} aria-labelledby="more-films">
            <SectionHeader id="more-films" title="More films" />
            <ul className={styles.grid}>
              {more.map((ad) => (
                <li key={ad.id} className={styles.card}>
                  <VideoPlayer
                    youtubeId={ad.youtubeId}
                    title={`${ad.title}: ${ad.kind}`}
                    poster={ad.poster}
                  />
                  <h3 className={styles.cardTitle}>{ad.title}</h3>
                  <p className={styles.cardMeta}>
                    {ad.kind} · {ad.year}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
