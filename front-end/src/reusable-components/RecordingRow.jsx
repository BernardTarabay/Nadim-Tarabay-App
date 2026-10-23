import PlayButton from '@/reusable-components/PlayButton';
import WorkTitle from '@/reusable-components/WorkTitle';
import { formatTime } from '@/utils/text';
import { reveal } from '@/utils/reveal';
import styles from '../stylesheets/RecordingRow.module.css';

export default function RecordingRow({ recording }) {
  return (
    <li ref={reveal} className={styles.row}>
      <span className={styles.title}>
        <WorkTitle title={recording.title} titleAr={recording.titleAr} year={recording.year} />
      </span>
      <span className={styles.duration}>
        <span className="visually-hidden">Duration </span>
        {formatTime(recording.track.duration)}
      </span>
      <PlayButton
        track={recording.track}
        label="Play recording"
        name={recording.title}
        variant="outline"
        className={styles.play}
      />
    </li>
  );
}
