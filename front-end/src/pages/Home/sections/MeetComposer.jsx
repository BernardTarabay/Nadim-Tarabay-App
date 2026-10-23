import Button from '@/reusable-components/Button';
import SectionHeader from '@/reusable-components/SectionHeader';
import { PATHS } from '@/config/site';
import { HOME_SECTIONS } from '@/data/home';
import { reveal } from '@/utils/reveal';
import portraitBw from '@/pictures/images/composer-portrait-bw.webp';
import portrait from '@/pictures/images/composer-portrait.webp';
import styles from '../../../stylesheets/MeetComposer.module.css';

export default function MeetComposer() {
  const { title, introduction, story, cta } = HOME_SECTIONS.composer;
  return (
    <section className={styles.section} aria-labelledby="composer-title">
      <SectionHeader
        id="composer-title"
        title={title}
        description={introduction}
        className={styles.header}
      />
      <div className={styles.body}>
        <img
          ref={reveal}
          className={styles.portrait}
          src={portraitBw}
          alt="Nadim Tarabay leaning against a wall, holding a score"
          loading="lazy"
        />
        <div className={styles.details}>
          <p ref={reveal} className={styles.story}>
            {story}
          </p>
          <img
            ref={reveal}
            className={styles.photo}
            src={portrait}
            alt="Portrait of Nadim Tarabay"
            loading="lazy"
          />
        </div>
      </div>
      <Button to={PATHS.about} variant="dark" font="sans" className={styles.cta}>
        {cta}
      </Button>
    </section>
  );
}
