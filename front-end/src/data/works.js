import { audioSrc } from './tracks';
import beginningCover from '@/pictures/works/the-beginning.webp';
import echoesCover from '@/pictures/works/echoes-of-time.webp';
import wordCover from '@/pictures/works/the-word-made-flesh.webp';
import chevalCover from '@/pictures/works/cheval-d-ebene.webp';
import maroniteCover from '@/pictures/works/maronite-mass.webp';
import sinfoniettaCover from '@/pictures/works/sinfonietta-en-spirale.webp';

const picture = (glob) => (path) => glob[`/src/pictures/scores/${path}.webp`];
const scoreCover = picture(
  import.meta.glob('@/pictures/scores/covers/*.webp', { eager: true, import: 'default' }),
);
const scorePage = picture(
  import.meta.glob('@/pictures/scores/pages/*.webp', { eager: true, import: 'default' }),
);

const SCORE_PAGES = {
  'antar-wa-abla': 391,
  'bayati-hayati': 26,
  'cinq-muwashah': 85,
  'deux-icones': 27,
  dialogue: 12,
  'echoes-of-time': 157,
  'fascination-et-angoisse': 26,
  'fi-llayli-qablal-alami': 41,
  ghoubar: 14,
  'la-asafou': 19,
  'le-cheval-d-ebene': 217,
  'logos-corpus-echo': 52,
  'maronite-symphonic-mass': 144,
  'maskoun-majnoun': 9,
  observations: 11,
  'piano-sonata-1': 30,
  'sinfonietta-en-spirale': 59,
  'the-beginning': 109,
  'the-word-made-flesh': 319,
  'three-piano-pieces': 19,
  'two-pieces-for-vocal-quartet': 15,
  'une-balancoire-devant-l-eglise': 23,
};
const SAMPLE_PAGES = 3;

const definePiece = ({ audio, seconds, ...work }) => {
  const cover = scoreCover(`covers/${work.id}`);
  const score = cover && {
    cover,
    pageCount: SCORE_PAGES[work.id],
    pages: Array.from({ length: SAMPLE_PAGES }, (_, i) => scorePage(`pages/${work.id}-${i + 1}`)),
    locked: scorePage(`pages/${work.id}-locked`),
  };
  return Object.freeze({
    ...work,
    // Pieces without a photo of their own show their score's title page, so the name always matches.
    cover: work.cover ?? score?.cover,
    coverIsTitlePage: !work.cover && Boolean(score),
    track: audio
      ? { id: work.id, title: work.title, src: audioSrc(`${work.id}.${audio}`), duration: seconds }
      : null,
    score: score || null,
  });
};

export const WORKS = [
  definePiece({
    id: 'the-beginning',
    title: 'The Beginning — An Emirati Symphony',
    year: 2026,
    family: 'orchestral',
    instrumentation: 'Symphony for mixed orchestra and choir',
    audio: 'm4a',
    seconds: 1574,
    description:
      'Written for the inaugural season of the UAE National Orchestra, The Beginning is a large-scale symphony for orchestra and choir. It draws on Emirati culture, history and landscape, setting Arabic instruments within a contemporary symphonic language.',
    commission: 'Commissioned by the UAE National Orchestra (UAENO)',
    cover: beginningCover,
  }),
  definePiece({
    id: 'echoes-of-time',
    title: 'Echoes of Time: Ibn Arabi',
    year: 2026,
    family: 'orchestral',
    instrumentation: 'Symphonic poem for mixed orchestra, choir and narrator',
    audio: 'mp3',
    seconds: 3759,
    description:
      'A symphonic poem on the poetry of the Sufi mystic Ibn ‘Arabi. It moves through seven poems, each spoken by a narrator and answered by choir and orchestra, with oud, nay and qanun in dialogue with Western instruments.',
    commission: 'Commissioned by the UAE National Orchestra (UAENO)',
    cover: echoesCover,
  }),
  definePiece({
    id: 'the-word-made-flesh',
    title: 'The Word Made Flesh',
    year: 2026,
    family: 'orchestral',
    instrumentation: 'Oratorio for string orchestra, piano, percussion, choir and soloists',
    titleAr: 'الكلمة صار جسدًا',
    description:
      'An oratorio of around 85 minutes for soloists, choir and string orchestra, sung in Arabic and Syriac. It sets texts from the Gospels and the Prophets, and takes some Maronite chants as source material within an entirely new composition.',
    commission: 'Commissioned by the Saint Joseph University (USJ) Choir, Beirut',
    cover: wordCover,
    coverPosition: { desktop: '50% 39%', mobile: '50% 44%' },
  }),
  definePiece({
    id: 'le-cheval-d-ebene',
    title: '1001 Nuits : Le Cheval d’ébène',
    year: 2025,
    family: 'orchestral',
    instrumentation:
      'Programme music for chamber orchestra, mixed soloists and singer; music by Keyvan Chemirani, orchestration and arrangement by Nadim Tarabay',
    audio: 'mp3',
    seconds: 4164,
    description:
      'A family concert based on the One Thousand and One Nights tale of the flying ebony horse, combining narration, song and shadow theatre. It was premiered by the Orchestre de chambre de Paris at the Cité de la musique in October 2025.',
    commission: 'Commissioned by the Philharmonie de Paris',
    cover: chevalCover,
  }),
  definePiece({
    id: 'maronite-symphonic-mass',
    title: 'The Maronite Symphonic Mass',
    year: 2025,
    family: 'orchestral',
    instrumentation: 'Mass-oratorio for large orchestra, choir and soloists',
    audio: 'mp3',
    seconds: 2541,
    description: '',
    commission: 'Commissioned by the Lebanese National Higher Conservatory of Music',
    cover: maroniteCover,
    coverPosition: { desktop: '50% 80%', mobile: '50% 41%' },
  }),
  definePiece({
    id: 'sinfonietta-en-spirale',
    title: 'Sinfonietta en spirale',
    year: 2025,
    family: 'orchestral',
    instrumentation: 'Sinfonietta for chamber orchestra',
    audio: 'mp3',
    seconds: 659,
    description: '',
    commission:
      'Awarded Second Prize in the orchestral category of the Abu Dhabi International Competition for Composers 2026.',
    cover: sinfoniettaCover,
  }),

  definePiece({
    id: 'ghoubar',
    title: 'Ghoubar',
    year: 2019,
    family: 'ensemble',
    instrumentation: 'Vocal work for singer and ensemble',
    audio: 'm4a',
    seconds: 606,
    description:
      'Dust. Set to a text by the composer’s father, the piece draws on the art of Qur’anic recitation (tajwīd) heard in the call to prayer. It explores micro-time, treating the voice and ensemble as a single speck of dust held still and examined in slow motion.',
    commission: 'Commissioned by Ensemble Dynamique, Paris',
  }),
  definePiece({
    id: 'logos-corpus-echo',
    title: 'Logos Corpus Echo',
    year: 2023,
    family: 'ensemble',
    instrumentation: 'Ensemble work for large ensemble',
    audio: 'm4a',
    seconds: 443,
    description:
      'A study of energy structures and micro-delays. Gestures pass between ten players with tiny offsets in time, so that one idea is heard as an impulse, a body of sound, and its own echo.',
    commission:
      'Composed for the Conservatoire national supérieur de musique et de danse de Paris (CNSMDP)',
  }),
  definePiece({
    id: 'bayati-hayati',
    title: 'Bayati Hayati',
    year: 2023,
    family: 'ensemble',
    instrumentation: 'Ensemble work for seven instruments, Ensemble intercontemporain',
    audio: 'm4a',
    seconds: 679,
    description: '',
    commission:
      'Composed for the Conservatoire national supérieur de musique et de danse de Paris (CNSMDP)',
  }),
  definePiece({
    id: 'fi-llayli-qablal-alami',
    title: 'Zakhrafa (Fi l-Layli Qabla l-Alami)',
    year: 2026,
    family: 'orchestral',
    instrumentation: 'Orchestral work for chamber orchestra',
    audio: 'mp3',
    seconds: 862,
    description:
      'In the Night Before the Passion. Variations on the Maronite hymn of the same name, extended through prolation canons and self-similar growth, with harmonisation techniques derived from the maqam. Awarded the Prix du Conservatoire de Paris in 2026.',
    commission:
      'Graduation work, Conservatoire national supérieur de musique et de danse de Paris (CNSMDP)',
  }),
  definePiece({
    id: 'une-balancoire-devant-l-eglise',
    title: 'Une balançoire devant l’église',
    year: 2024,
    family: 'ensemble',
    instrumentation: 'Chamber work for woodwind quartet',
    audio: 'mp3',
    seconds: 551,
    description:
      'A Swing in Front of the Church. A deconstruction of the Lebanese folk song Al ʿĀyn Mulayyatayn. The melody is taken apart and rebuilt through extended techniques for the four wind players.',
    commission: 'Commissioned by the D440 Festival',
  }),
  definePiece({
    id: 'maskoun-majnoun',
    title: 'Maskoun Majnoun',
    year: 2025,
    family: 'ensemble',
    instrumentation: 'Choral work for choir and string quartet',
    audio: 'mp3',
    seconds: 320,
    description:
      'A work for twelve voices and string quartet on an invented text, contemplating deep torment and isolation.',
    commission:
      'Commissioned by the Spirito vocal ensemble, Quatuor Béla and the Festival Messiaen au Pays de la Meije',
  }),

  definePiece({
    id: 'antar-wa-abla',
    title: 'Antar and Abla',
    year: 2025,
    family: 'stage',
    instrumentation: 'Opera for orchestra and soloists',
    video: { youtubeId: 'Z1TygKJWhhk' },
    description:
      'A large-scale Arabic opera on the legendary poet-knight Antar and his beloved Abla. This version is fully rewritten, with new orchestration and a reworked dramaturgy. It premiered in December 2025 on an open-air stage at Zayed Sports City, Abu Dhabi.',
    commission: 'Commissioned by Mubadala and Clairmine Opus',
  }),
  definePiece({
    id: 'hamlet-the-mad-prince',
    title: 'Hamlet the Mad Prince, The Gérard Avedissian Adaptation',
    year: 2019,
    description:
      'Music for Gérard Avédissian’s stage production of Shakespeare’s Hamlet, written to support the drama.',
    commission: 'Production directed by Gérard Avédissian',
  }),
];

const MORE_PIECES = [
  definePiece({
    id: 'deux-icones',
    title: 'Deux icônes',
    year: 2017,
    family: 'ensemble',
    instrumentation: 'Chamber work for violin, cello and piano',
    audio: 'mp3',
    seconds: 386,
  }),
  definePiece({
    id: 'fascination-et-angoisse',
    title: 'Fascination et angoisse',
    year: 2021,
    family: 'ensemble',
    instrumentation: 'Chamber work for mixed piano quartet',
    audio: 'm4a',
    seconds: 541,
  }),
  definePiece({
    id: 'three-piano-pieces',
    title: 'Three Piano Pieces',
    year: 2020,
    family: 'solo',
    instrumentation: 'Solo piano',
    audio: 'mp3',
    seconds: 1017,
  }),
  definePiece({
    id: 'two-pieces-for-vocal-quartet',
    title: 'Deux pièces pour quatuor vocal',
    year: 2017,
    family: 'ensemble',
    instrumentation: 'Vocal work for vocal quartet',
    audio: 'mp3',
    seconds: 510,
  }),
  definePiece({
    id: 'piano-sonata-1',
    title: 'Piano Sonata No. 1',
    year: 2019,
    family: 'solo',
    instrumentation: 'Solo piano',
    audio: 'mp3',
    seconds: 1712,
  }),
  definePiece({
    id: 'cinq-visions',
    title: 'Cinq Visions for Piano',
    instrumentation: 'Piano',
    audio: 'mp3',
    seconds: 1233,
  }),
  definePiece({
    id: 'deux-lamentations',
    title: 'Deux Lamentations for Two Violins',
    instrumentation: 'Two violins',
    audio: 'mp3',
    seconds: 556,
  }),
  definePiece({
    id: 'synthesis',
    title: 'Synthesis for Microtonal Piano',
    instrumentation: 'Microtonal piano',
    audio: 'm4a',
    seconds: 487,
  }),
  definePiece({ id: 'states-of-rapture', title: 'States of Rapture', audio: 'm4a', seconds: 713 }),
  definePiece({
    id: 'nature-and-the-machine',
    title: 'Nature and the Machine',
    audio: 'm4a',
    seconds: 276,
  }),
  definePiece({ id: 'timbral-study-2', title: 'Timbral Study No. 2', audio: 'm4a', seconds: 570 }),
  definePiece({
    id: 'dialogue',
    title: 'Dialogue',
    year: 2018,
    family: 'ensemble',
    instrumentation: 'Chamber work for violin and piano',
  }),
  definePiece({
    id: 'observations',
    title: 'Observations',
    year: 2018,
    family: 'ensemble',
    instrumentation: 'Chamber work for string quartet',
  }),
  definePiece({
    id: 'cinq-muwashah',
    title: 'Cinq muwashshahat',
    year: 2025,
    family: 'ensemble',
    instrumentation: 'Song cycle of five miniatures for singer and mixed ensemble',
  }),
  definePiece({
    id: 'la-asafou',
    title: 'La Asafou Ella',
    year: 2024,
    family: 'ensemble',
    instrumentation: 'Choral work for mixed choir',
  }),
];

export const CATALOGUE = [...WORKS, ...MORE_PIECES];

/** The six works the home page shows; the rest are on the Scores page. */
export const HIGHLIGHTS = Object.freeze(
  [
    'the-beginning',
    'echoes-of-time',
    'the-word-made-flesh',
    'le-cheval-d-ebene',
    'fi-llayli-qablal-alami',
    'sinfonietta-en-spirale',
  ].map((id) => WORKS.find((work) => work.id === id)),
);
