export const audioSrc = (file) => `/audio/${file}`;

export const DEFAULT_TRACK = Object.freeze({
  id: 'the-beginning',
  title: 'The Beginning',
  subtitle: 'An Emirati Symphony',
  src: audioSrc('the-beginning.m4a'),
  loop: true,
});
