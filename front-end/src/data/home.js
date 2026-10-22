import heroImage from '@/pictures/images/home-hero.webp';

export const HOME_HERO = Object.freeze({
  firstName: 'Nadim',
  lastName: 'Tarabay',
  image: {
    src: heroImage,
    alt: 'Nadim Tarabay applauding the orchestra on stage',
  },
  description: 'Award winning international Lebanese composer of contemporary classical music.',
  tagline:
    'Explore his music, live performances and a body of work shaped by the musical heritage of the Middle East.',
});

export const HOME_SECTIONS = Object.freeze({
  collaborators: {
    title: 'Collaborators',
    description:
      'From concert halls to creative collaborations, a selection of places and people I’ve worked with.',
  },
  output: {
    title: 'Musical Output',
    description:
      'A curated collection of compositions and recordings shaped by years of musical exploration.',
  },
  composer: {
    title: 'Meet the Composer',
    introduction:
      'Nadim F. Tarabay is a Lebanese composer whose musical thought explores memory, self similarity, and fractal geometry. Drawing on Arabic maqam and Maronite chant, he investigates how melodic gestures generate larger structures. Urban polyphony and micropolyphony inform his interwoven musical lines, while resultant harmony and spectral harmony connect melodic interaction with the inner resonance of sound.',
    story:
      'His works include The Beginning: An Emirati Symphony and Echoes of Time, commissioned by the UAE National Orchestra; Antar and Abla, commissioned by Mubadala; 1001 Nuits: Le Cheval d’ébène, commissioned by the Philharmonie de Paris; and The Word Made Flesh, commissioned by the USJ Choir in Lebanon. As founder of Zagharid, he develops and produces collaborative projects across orchestral music, opera, and sacred vocal forms.',
    cta: 'Discover more',
  },
  credits: { title: 'Recent credits' },
});
