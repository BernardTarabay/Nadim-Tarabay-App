export const audioSrc = (file) => `/audio/${file}`;

export const DEFAULT_TRACK = Object.freeze({
  id: 'experience',
  title: 'Experience',
  subtitle: 'Theme',
  src: audioSrc('experience.mp3'),
  loop: true,
});
