import { SoundToggle, TrackLabel, WaveIcon } from './NowPlayingParts';
import styles from '../stylesheets/NowPlaying.module.css';

export default function MiniPlayer() {
  return (
    <aside className={styles.mini} aria-label="Audio player">
      <div className={styles.playback}>
        <WaveIcon />
        <TrackLabel />
      </div>
      <SoundToggle />
    </aside>
  );
}
