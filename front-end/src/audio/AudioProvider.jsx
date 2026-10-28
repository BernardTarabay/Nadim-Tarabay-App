import { createContext, useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { PLAYLIST, PREVIEW } from '@/data/playlist';
import { AudioEngine } from './AudioEngine';

export const AudioEngineContext = createContext(null);

export const AudioPlayerContext = createContext(null);

export default function AudioProvider({ children }) {
  const [engine] = useState(() => new AudioEngine(PLAYLIST, PREVIEW));
  const state = useSyncExternalStore(engine.subscribe, engine.getState, engine.getState);
  const attachAudio = useCallback((element) => engine.attach(element), [engine]);

  const player = useMemo(
    () => ({
      ...state,
      play: engine.play,
      pause: engine.pause,
      next: engine.next,
      toggleSound: engine.toggleSound,
      toggleMute: engine.toggleMute,
      seek: engine.seek,
      previewSeconds: engine.preview.seconds,
    }),
    [state, engine],
  );

  return (
    <AudioEngineContext.Provider value={engine}>
      <AudioPlayerContext.Provider value={player}>
        {children}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio ref={attachAudio} preload="metadata" hidden />
      </AudioPlayerContext.Provider>
    </AudioEngineContext.Provider>
  );
}
