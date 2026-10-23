import Collaborators from './sections/Collaborators';
import HomeHero from './sections/HomeHero';
import MeetComposer from './sections/MeetComposer';
import MusicalOutput from './sections/MusicalOutput';
import RecentCredits from './sections/RecentCredits';
import { HOME_LAYOUT } from '@/data/home';
import styles from '../../stylesheets/HomePage.module.css';

const SECTIONS = {
  collaborators: Collaborators,
  output: MusicalOutput,
  composer: MeetComposer,
  credits: RecentCredits,
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <div className={`l-container ${styles.sections}`}>
        {HOME_LAYOUT.map((id) => {
          const Section = SECTIONS[id];
          return <Section key={id} />;
        })}
      </div>
    </>
  );
}
