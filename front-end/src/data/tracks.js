export const audioSrc = (file) => `/audio/${file}`;

export const DEFAULT_TRACK = Object.freeze({
  id: 'the-beginning',
  title: 'The Beginning',
  subtitle: 'An Emirati Symphony',
  src: audioSrc('the-beginning.m4a'),
  // The background track plays for three minutes; after that visitors pick a piece from Scores.
  limit: 180,
});
