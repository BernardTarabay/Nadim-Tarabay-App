import heroImage from '@/pictures/images/home-hero.webp';
// Edited from the studio (/studio → Edit site); the shape is defined in shared/content.js.
import home from '@/content/home.json';

export const HOME_HERO = Object.freeze({
  ...home.hero,
  image: {
    src: heroImage,
    alt: 'Nadim Tarabay applauding the orchestra on stage',
  },
});

export const HOME_SECTIONS = Object.freeze({
  collaborators: home.collaborators,
  output: home.output,
  composer: home.composer,
  credits: home.credits,
});

/** The home sections to show, in order. */
export const HOME_LAYOUT = Object.freeze(
  home.sections.filter((section) => section.visible).map((section) => section.id),
);
