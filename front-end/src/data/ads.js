// Edited from the studio (/studio → Edit site); the shape is defined in shared/content.js.
import ads from '@/content/ads.json';

const youtubePoster = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

// The first entry is the featured film at the top of the page; the rest fill the grid below it.
// `score` is optional: the page this film's score lives on, shown as a "View the score" button.
export const ADS = Object.freeze(
  ads.films.map((film) =>
    Object.freeze({
      ...film,
      id: film.youtubeId,
      details: film.details.map(({ term, value }) => [term, value]),
      poster: { src: youtubePoster(film.youtubeId), alt: `A still from ${film.title}` },
      stills: [],
    }),
  ),
);

export const ADS_PAGE = Object.freeze({
  title: 'Ads',
  description: 'Campaign films and trailers with original music by Nadim Tarabay.',
  hero: ADS[0].poster,
});
