import Picture from '@/reusable-components/Picture';
import Polaroid from '@/reusable-components/Polaroid';
import Prose from '@/reusable-components/Prose';
import { ABOUT } from '@/data/about';
import { reveal } from '@/utils/reveal';
import styles from '../../stylesheets/AboutPage.module.css';

export default function AboutPage() {
  const { hero, intro, impact, podcast, strip } = ABOUT;
  return (
    <article>
      <header className={`l-container ${styles.hero}`}>
        <h1 className={styles.heroTitle}>{hero.title}</h1>
        <Prose
          paragraphs={hero.paragraphs}
          className={`${styles.heroText} ${styles.trailingLine}`}
        />
        <Picture {...hero.image} priority className={styles.heroImage} />
      </header>

      <section className={styles.band} aria-labelledby="about-intro">
        <div ref={reveal} className={`l-container ${styles.intro}`}>
          <Prose
            paragraphs={intro.paragraphs}
            className={`${styles.introText} ${styles.trailingLine}`}
          />
          <Picture {...intro.image} className={styles.introImage} />
          <h2 id="about-intro" className={styles.introTitle}>
            {intro.title}
          </h2>
        </div>
      </section>

      <section
        ref={reveal}
        className={`l-container ${styles.impact}`}
        aria-labelledby="about-impact"
      >
        <h2 id="about-impact" className={styles.title}>
          {impact.title}
        </h2>
        <div className={styles.impactBody}>
          <Polaroid {...impact.polaroid} className={styles.polaroid} />
          <Prose paragraphs={impact.paragraphs} className={styles.trailingLine}>
            <h3 className={styles.distinctionsTitle}>{impact.distinctionsTitle}</h3>
            <ul>
              {impact.distinctions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Prose>
        </div>
      </section>

      <section
        ref={reveal}
        className={`l-container ${styles.podcast}`}
        aria-labelledby="about-podcast"
      >
        <h2 id="about-podcast" className={styles.title}>
          {podcast.title}
        </h2>
        <div className={styles.podcastColumns}>
          <Picture {...podcast.mobileImages[0]} className={styles.mobileOnly} />
          <Prose paragraphs={podcast.columns[0]} />
          <Picture {...podcast.mobileImages[1]} className={styles.mobileOnly} />
          <Prose paragraphs={podcast.columns[1]} />
          <Picture {...podcast.mobileImages[2]} className={styles.mobileOnly} />
        </div>
      </section>

      <ul ref={reveal} className={styles.strip} aria-label="Photos">
        {strip.map((picture) => (
          <li key={picture.src}>
            <Picture {...picture} />
          </li>
        ))}
      </ul>
    </article>
  );
}
