import { RECORDINGS } from './recordings';
import { HIGHLIGHTS } from './works';

const HOME_TRACKS = HIGHLIGHTS.map((work) => work.track).filter(Boolean);

/**
 * What the site plays, starting on its own when a visitor arrives: the home page's works in the
 * order they appear there, then every other recording.
 */
export const PLAYLIST = Object.freeze([
  ...HOME_TRACKS,
  ...RECORDINGS.map((recording) => recording.track).filter((track) => !HOME_TRACKS.includes(track)),
]);

/** The first two home tracks play as 3-minute previews, then the player moves on; the rest play in full. */
export const PREVIEW = Object.freeze({
  seconds: 180,
  trackIds: HOME_TRACKS.slice(0, 2).map((track) => track.id),
});
