import NowPlayingStrip from '@/reusable-components/NowPlayingStrip';
import Picture from '@/reusable-components/Picture';
import { HOME_HERO } from '@/data/home';
import styles from '../../../stylesheets/HomeHero.module.css';

export default function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.media}>
        <Picture {...HOME_HERO.image} priority />
        <div className={styles.content}>
          <h1 id="home-title" className={styles.name}>
            <span>{HOME_HERO.firstName}</span> <span>{HOME_HERO.lastName}</span>
          </h1>
          <p className={styles.description}>{HOME_HERO.description}</p>
        </div>
      </div>
      <div className={styles.strip}>
        <NowPlayingStrip tagline={HOME_HERO.tagline} />
      </div>
    </section>
  );
}
