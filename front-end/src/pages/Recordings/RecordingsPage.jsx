import RecordingRow from '@/reusable-components/RecordingRow';
import PageHero from '@/reusable-components/PageHero';
import { RECORDINGS, RECORDINGS_PAGE } from '@/data/recordings';
import styles from '../../stylesheets/RecordingsPage.module.css';

export default function RecordingsPage() {
  return (
    <>
      <PageHero title={RECORDINGS_PAGE.title} image={RECORDINGS_PAGE.hero} />
      <div className={`l-container ${styles.content}`}>
        <ul className={styles.list} aria-label="Recordings">
          {RECORDINGS.map((recording) => (
            <RecordingRow key={recording.id} recording={recording} />
          ))}
        </ul>
      </div>
    </>
  );
}
