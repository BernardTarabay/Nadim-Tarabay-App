import { useContext, useSyncExternalStore } from 'react';
import { AudioEngineContext, AudioPlayerContext } from './AudioProvider';

export function useAudioPlayer() {
  const player = useContext(AudioPlayerContext);
  if (!player) throw new Error('useAudioPlayer must be used inside <AudioProvider>');
  return player;
}

export function useAudioProgress() {
  const engine = useContext(AudioEngineContext);
  if (!engine) throw new Error('useAudioProgress must be used inside <AudioProvider>');
  return useSyncExternalStore(engine.subscribeProgress, engine.getProgress, engine.getProgress);
}
