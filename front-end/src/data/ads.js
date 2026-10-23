import poster from '@/pictures/about/antar-stage.webp';

export const ADS_PAGE = Object.freeze({
  title: 'Ads',
  description:
    'Trailers and promotional films for the stage works and productions of Nadim Tarabay, with original music.',
  hero: { src: poster, alt: 'The Antar and Abla opera on stage' },
});

// The first entry is the featured film at the top of the page; the rest fill the grid below it.
export const ADS = [
  Object.freeze({
    id: 'antar-wa-abla-trailer',
    youtubeId: 'Z1TygKJWhhk',
    title: 'Antar & Abla',
    kind: 'Trailer',
    subtitle: 'Arabic opera',
    year: 2025,
    description:
      'The official trailer for Antar and Abla, a large-scale Arabic opera on the legendary poet-knight Antar and his beloved Abla. Nadim Tarabay rewrote the work in full, with new orchestration and a reworked dramaturgy, for its open-air premiere in Abu Dhabi.',
    details: [
      ['Work', 'Antar and Abla'],
      ['Premiere', 'December 2025, Zayed Sports City, Abu Dhabi'],
      ['Commission', 'Mubadala and Clairmine Opus'],
      ['Film', 'Amine Hachem'],
    ],
    poster: { src: poster, alt: 'The Antar and Abla opera on stage' },
    stills: [],
  }),
];
