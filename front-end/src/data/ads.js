const youtubePoster = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

const poster = {
  src: youtubePoster('YkmjllisSGg'),
  alt: 'An orchestra and its conductor on a wood-panelled concert stage',
};

export const ADS_PAGE = Object.freeze({
  title: 'Ads',
  description: 'Campaign films and trailers with original music by Nadim Tarabay.',
  hero: poster,
});

// The first entry is the featured film at the top of the page; the rest fill the grid below it.
// `score` is optional: the page this film's score lives on, shown as a "View the score" button.
export const ADS = [
  Object.freeze({
    id: 'feel-the-symphony-within',
    youtubeId: 'YkmjllisSGg',
    title: 'Feel the Symphony Within',
    kind: 'Campaign film',
    subtitle: 'UAE National Orchestra',
    year: 2025,
    description:
      'A film for the UAE National Orchestra that invites audiences to experience music as more than sound: a presence that lives within us and shapes emotion, memory and meaning. The music is composed by Nadim Tarabay.',
    details: [
      ['Client', 'UAE National Orchestra'],
      ['Music', 'Nadim Tarabay'],
      ['Released', 'December 2025'],
    ],
    poster,
    stills: [],
  }),
];
