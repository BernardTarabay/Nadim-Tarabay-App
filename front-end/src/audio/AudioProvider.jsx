import { createContext, useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { RECORDINGS } from '@/data/recordings';
import { DEFAULT_TRACK } from '@/data/tracks';
import { AudioEngine } from './AudioEngine';

export const AudioEngineContext = createContext(null);

export const AudioPlayerContext = createContext(null);

export default function AudioProvider({ children }) {
  const [engine] = useState(
    () =>
      new AudioEngine(
        DEFAULT_TRACK,
        RECORDINGS.map((recording) => recording.track),
      ),
  );
  const state = useSyncExternalStore(engine.subscribe, engine.getState);
  const attachAudio = useCallback((element) => engine.attach(element), [engine]);

  const player = useMemo(
    () => ({
      ...state,
      play: engine.play,
      pause: engine.pause,
      toggleSound: engine.toggleSound,
      toggleMute: engine.toggleMute,
      seek: engine.seek,
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
