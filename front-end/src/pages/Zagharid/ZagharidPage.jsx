import EpisodeArchive from '@/reusable-components/EpisodeArchive';
import EpisodeCard from '@/reusable-components/EpisodeCard';
import PageHero from '@/reusable-components/PageHero';
import Carousel from '@/reusable-components/Carousel';
import ContactButton from '@/reusable-components/ContactButton';
import Picture from '@/reusable-components/Picture';
import Polaroid from '@/reusable-components/Polaroid';
import Prose from '@/reusable-components/Prose';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ZAGHARID } from '@/data/zagharid';
import styles from '../../stylesheets/ZagharidPage.module.css';

export default function ZagharidPage() {
  const { hero, logo, story, conversations, episodes, person, cta } = ZAGHARID;
  const mobile = useMediaQuery('(max-width: 767px)');

  return (
    <>
      <PageHero title="Zagharid" image={hero}>
        <img className={styles.heroLogo} src={logo.src} alt="" />
      </PageHero>

      <div className={`l-container ${styles.page}`}>
        <section id="about" className={styles.story} aria-labelledby="zagharid-story">
          <h2 id="zagharid-story" className={styles.title}>
            {story.title}
          </h2>
          <div className={styles.storyColumns}>
            <Prose paragraphs={story.columns[0]} />
            <Picture {...story.image} className={styles.storyImage} />
            <Prose paragraphs={story.columns[1]} />
          </div>
        </section>

        <section className={styles.conversations} aria-labelledby="zagharid-conversations">
          <div className={styles.conversationsIntro}>
            <h2 id="zagharid-conversations" className={styles.title}>
              {conversations.title}
            </h2>
            <Prose paragraphs={conversations.paragraphs} />
          </div>
          {mobile ? (
            <ul className={styles.episodeList}>
              {episodes.map((episode) => (
                <li key={episode.guest}>
                  <EpisodeCard episode={episode} variant="card" />
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.bleed}>
              <Carousel
                items={episodes}
                label="Zagharid conversations"
                renderSlide={(episode) => <EpisodeCard episode={episode} variant="slide" />}
              />
            </div>
          )}
        </section>

        <EpisodeArchive
          id="zagharid-episodes"
          title="All Episodes"
          description="Every conversation, in the order it was released. Press play to watch here, or open an episode on YouTube."
        />

        <section className={styles.person} aria-labelledby="zagharid-person">
          <div className={styles.personRow}>
            <div className={styles.personText}>
              <h2 id="zagharid-person" className={styles.title}>
                {person.title}
              </h2>
              <Prose paragraphs={person.paragraphs} />
            </div>
            <Polaroid {...person.image} className={styles.hostPhoto} />
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="zagharid-cta">
          <img className={styles.ctaBackdrop} src={cta.background} alt="" loading="lazy" />
          <img className={styles.ctaLogo} src={logo.src} alt={logo.alt} loading="lazy" />
          <h2 id="zagharid-cta" className={styles.ctaTitle}>
            {cta.title}
          </h2>
          <p className={styles.ctaText}>{cta.text}</p>
          <ContactButton font="sans" className={styles.ctaButton}>
            {cta.button}
          </ContactButton>
        </section>
      </div>
    </>
  );
}
