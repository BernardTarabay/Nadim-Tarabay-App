import { SoundToggle, TrackLabel, WaveIcon } from './NowPlayingParts';
import styles from '../stylesheets/NowPlaying.module.css';

export default function NowPlayingStrip({ tagline }) {
  return (
    <div className={styles.strip}>
      <p className={styles.tagline}>{tagline}</p>
      <div className={styles.controls}>
        <div className={styles.playback}>
          <WaveIcon />
          <TrackLabel />
        </div>
        <SoundToggle />
      </div>
    </div>
  );
}
