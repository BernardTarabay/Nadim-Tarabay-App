import heroImage from '@/pictures/scores/hero.webp';
import heroMobile from '@/pictures/scores/hero-mobile.webp';
import { CATALOGUE } from './works';

export const SCORES_PAGE = Object.freeze({
  title: 'Scores',
  description:
    'Written for performance. Designed to be heard. Explore a selection of compositions, available as playable scores.',
  intro: [
    'Written for performance. Designed to be heard.',
    'Explore a selection of my compositions, available as playable scores.',
  ],
  hero: { src: heroImage, mobileSrc: heroMobile, alt: 'Score books resting on a grand piano' },
});

/** Filters on the Scores page, by size of forces; choral and vocal works count as ensemble. */
export const SCORE_FAMILIES = [
  { id: 'all', label: 'All' },
  { id: 'orchestral', label: 'Orchestral' },
  { id: 'ensemble', label: 'Ensemble' },
  { id: 'solo', label: 'Solo' },
  { id: 'stage', label: 'Stage' },
];

/** Newest first; same year by title. Pieces without a known year come last. */
export const SCORES = CATALOGUE.filter((piece) => piece.score).sort(
  (a, b) =>
    (b.year ?? -Infinity) - (a.year ?? -Infinity) ||
    a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }),
);
