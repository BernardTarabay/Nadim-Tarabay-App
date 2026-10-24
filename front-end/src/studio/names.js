import { ADS } from '@/data/ads';
import { PRESS } from '@/data/press';
import { RECORDINGS } from '@/data/recordings';
import { CATALOGUE } from '@/data/works';
import { ZAGHARID_EPISODES } from '@/data/zagharidEpisodes';

// Event labels are IDs (a track, a work, a YouTube video); these turn them back into titles.
const TITLES = new Map([
  ...CATALOGUE.map((work) => [work.id, work.title]),
  ...RECORDINGS.map((recording) => [recording.id, recording.title]),
  ...PRESS.filter((article) => article.video).map((article) => [
    article.video.youtubeId,
    article.video.title,
  ]),
  ...ADS.map((ad) => [ad.youtubeId, `${ad.title} (${ad.kind})`]),
  ...ZAGHARID_EPISODES.map((episode) => [episode.youtubeId, `Zagharid: ${episode.title}`]),
]);

export const titleOf = (id) => TITLES.get(id) ?? id ?? 'Unknown';

export const EVENTS = [
  { name: 'play', label: 'Recording plays', hint: 'Play presses on any recording' },
  { name: 'video', label: 'Video plays', hint: 'Films and episodes started on the site' },
  { name: 'score', label: 'Scores opened', hint: 'Full-screen score views' },
  { name: 'contact', label: 'Contact messages', hint: 'Sent through the form' },
  { name: 'outbound', label: 'Outbound clicks', hint: 'Links to other sites' },
  { name: 'email', label: 'Email link clicks', hint: 'mailto: links' },
  { name: 'not_found', label: 'Broken links', hint: 'Visits to pages that do not exist' },
];
