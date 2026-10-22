import { useAudioPlayer } from './useAudioPlayer';

export function usePlayControl(track) {
  const { currentTrack, status, play, pause } = useAudioPlayer();
  let state = 'idle';
  if (currentTrack?.id === track.id) {
    state = status === 'playing' || status === 'loading' || status === 'error' ? status : 'paused';
  }
  const toggle = () => (state === 'playing' || state === 'loading' ? pause() : play(track));
  return { state, toggle };
}
