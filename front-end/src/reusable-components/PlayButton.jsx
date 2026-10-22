import { usePlayControl } from '@/audio/usePlayControl';
import Button from '@/reusable-components/Button';
import Icon from '@/reusable-components/Icon';

const STATE_LABEL = { playing: 'Pause', loading: 'Loading…', error: 'Unavailable' };

export default function PlayButton({ track, label, name, ...rest }) {
  const { state, toggle } = usePlayControl(track);
  const text = STATE_LABEL[state] ?? label;
  return (
    <Button {...rest} onClick={toggle} data-audio-control aria-label={`${text} ${name}`}>
      <Icon name={state === 'playing' ? 'pause-circle' : 'play-circle'} />
      {text}
    </Button>
  );
}
