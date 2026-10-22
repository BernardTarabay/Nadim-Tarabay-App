import heroImage from '@/pictures/press/emirates-palace.webp';
import { CATALOGUE } from './works';

export const RECORDINGS_PAGE = Object.freeze({
  title: 'Recordings',
  description: 'Full recordings of works by Nadim Tarabay.',
  hero: { src: heroImage, alt: 'An orchestra and choir on a concert stage' },
});

export const RECORDINGS = CATALOGUE.filter((piece) => piece.track);
