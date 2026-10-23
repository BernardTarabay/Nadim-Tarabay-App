import { usePlayControl } from '@/audio/usePlayControl';
import Button from '@/reusable-components/Button';
import Icon from '@/reusable-components/Icon';
import styles from '../stylesheets/PlayButton.module.css';

const STATE_LABEL = { playing: 'Pause', loading: 'Loading…', error: 'Unavailable' };

export default function PlayButton({ track, label, name, ...rest }) {
  const { state, toggle } = usePlayControl(track);
  const text = STATE_LABEL[state] ?? label;
  const icon = state === 'playing' ? 'pause-circle' : 'play-circle';
  return (
    <Button
      {...rest}
      onClick={toggle}
      data-audio-control
      data-state={state}
      aria-label={`${text} ${name}`}
    >
      <Icon key={icon} name={icon} className={styles.icon} />
      {text}
    </Button>
  );
}
