import Collaborators from './sections/Collaborators';
import HomeHero from './sections/HomeHero';
import MeetComposer from './sections/MeetComposer';
import MusicalOutput from './sections/MusicalOutput';
import RecentCredits from './sections/RecentCredits';
import styles from '../../stylesheets/HomePage.module.css';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <div className={`l-container ${styles.sections}`}>
        <Collaborators />
        <MusicalOutput />
        <MeetComposer />
        <RecentCredits />
      </div>
    </>
  );
}
