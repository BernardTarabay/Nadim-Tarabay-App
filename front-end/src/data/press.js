import heroImage from '@/pictures/press/hero.webp';
import emiratesPalace from '@/pictures/press/emirates-palace.webp';
import competition from '@/pictures/press/competition.webp';
import antarWaAbla from '@/pictures/press/antar-wa-abla.webp';
import echoesCover from '@/pictures/works/echoes-of-time.webp';

export const PRESS_PAGE = Object.freeze({
  title: 'Articles',
  description: 'Press coverage of Nadim Tarabay’s work.',
  hero: { src: heroImage, alt: 'An opera house audience seen from the stage' },
});

const youtubePoster = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

/**
 * Each article links out to its `url`, or, without one, is read in full here: `body` holds its
 * paragraphs (default: the summary), `credits` its [label, value] rows, and `video` a YouTube
 * film that replaces the photo at the top of the article (`external` when its owner has turned
 * off embedding, so the poster opens it on YouTube).
 */
export const PRESS = [
  {
    slug: 'feel-the-symphony-within-uae-national-orchestra',
    title: 'Ad Music: Feel the Symphony Within, UAE National Orchestra',
    source: '@Nadim',
    date: '2026-10-23',
    summary:
      'Feel the Symphony Within (سيمفونية تلامس قلوبنا) is the national campaign film for the UAE National Orchestra’s first season. Its original music is by composer Nadim Tarabay.',
    body: [
      'Feel the Symphony Within (سيمفونية تلامس قلوبنا) is the national campaign film for the UAE National Orchestra’s first season. Its original music is by composer Nadim Tarabay.',
      'The film rests on one idea: an orchestra is only complete when it meets its audience. It brings the orchestra’s 100 musicians, from 35 nations, together with the people listening to them, in one shared feeling of pride and belonging.',
      'Tarabay’s score carries that idea from the stage to the audience. It belongs to the same season as his symphony The Beginning, which opened the orchestra’s first concert at Emirates Palace on 15 January 2026.',
    ],
    credits: [
      ['Music', 'Nadim Tarabay'],
      ['Director', 'Joe Connor'],
      ['Production', 'electriclime°'],
      ['Agency', 'C2 Comms'],
      ['Client', 'UAE National Orchestra'],
    ],
    video: { youtubeId: 'YkmjllisSGg', title: 'Feel the Symphony Within, UAE National Orchestra' },
    image: youtubePoster('YkmjllisSGg'),
  },
  {
    slug: 'rewriting-antar-and-abla-al-mashhad-interview',
    title: 'Interview: Tarabay on Rewriting Antar and Abla',
    source: 'Al Mashhad',
    date: '2025-12-12',
    summary:
      'On Al Mashhad’s Dardashat, Nadim Tarabay talks from Abu Dhabi, between rehearsals, about rewriting the opera Antar and Abla in three and a half months, making sung Arabic understood, and the hard lessons of his student years in Boston.',
    body: [
      'In December 2025, between rehearsals for Antar and Abla in Abu Dhabi, Nadim Tarabay joined Khalil Jamal and Suha Zaben on Dardashat, Al Mashhad’s talk show, for a conversation over Zoom. The opera was playing at Zayed Sports City until 14 December, in the version Tarabay had rewritten and reorchestrated.',
      'Asked how a composer in his twenties came to rework a piece of this scale, he credits a mix of providence, luck, perseverance and sleepless nights. Maroun Al-Rahi, who conceived the opera and wrote its first score, had come across an Easter oratorio Tarabay was preparing in Lebanon for 120 musicians and singers. The performance was postponed when Pope Francis died on 21 April 2025, but Al-Rahi had heard enough: he asked Tarabay to help him bring Antar and Abla back to life.',
      'The hardest part, Tarabay says, was time. The whole opera was written in three and a half months. On top of that came the task of finishing another composer’s work: going back into it, reshaping it, and finding solutions that kept its old structure while meeting the demands of a modern production and of its venue, an open-air stage at Zayed Sports City.',
      'He is quick to correct one claim. Antar and Abla is not the first Arabic opera, since operettas in Arabic go back to Sayed Darwish and Wadih Sabra. What sets it apart, he argues, is the care it takes with the language. Opera is hard to follow in any tongue, and Arabic adds its own difficulty: three long vowels, and short vowels that change a word’s meaning when one is sung wrong. That attention to diction, he believes, is what won the opera the 2024 Mohammed bin Rashid Arabic Language Award.',
      '“How do we keep all of that intact for a society that loves its language and loves its poets? That was the biggest challenge, and I think it is what made this work stand out.”',
      'The conversation then turns to his own path. At 21, Tarabay left law school to study composition in Boston. There he met the reality of a composer’s life, in an art many no longer see as belonging to their time, and lost two years to what he calls a depression of a kind he had never known. He had grown up on composers’ biographies, convinced there was nothing more beautiful than writing music and sleeping under a bridge; he learned that a dream also needs a way to make a living.',
      'He sees the problem as wider than his own story. Arab countries, he says, have little academic tradition in the arts and no real plan for bringing young artists into working life: universities hand out degrees, but a degree alone does not prepare anyone for the profession. Add an inferiority complex towards Western institutions, and the illusion that getting into one means the journey is half done. “In truth we are always halfway,” he says. “Never at the end of the road.”',
    ],
    credits: [
      ['Programme', 'Dardashat'],
      ['Channel', 'Al Mashhad'],
      ['Hosts', 'Khalil Jamal, Suha Zaben'],
      ['Guest', 'Nadim Tarabay'],
      ['Language', 'Arabic'],
    ],
    video: {
      youtubeId: '3ORpiQb3dIc',
      title: 'Challenging Heritage with a Young Mind: Nadim Tarabay on Antar and Abla, Dardashat',
      external: true,
    },
    image: youtubePoster('3ORpiQb3dIc'),
  },
  {
    slug: 'antar-wa-abla-international-stage',
    title: 'Antar wa Abla Reaches the International Stage in Abu Dhabi',
    source: 'L’Orient Today',
    date: '2025-12-15',
    summary:
      'L’Orient Today calls Nadim Tarabay’s rewriting, orchestration and dramaturgical reworking of the Lebanese opera “a decisive turning point” in Arab operatic history.',
    image: antarWaAbla,
    url: 'https://today.lorientlejour.com/article/1488463/antar-wa-abla-in-abu-dhabi-lebanese-opera-makes-its-way-to-the-international-stage.html',
  },
  {
    slug: 'standing-ovation-the-beginning-emirates-palace',
    title: 'Standing Ovation for The Beginning at Emirates Palace',
    source: '',
    date: '2026-01-16',
    summary:
      'The UAE National Orchestra’s Landmark Debut. Tarabay’s The Beginning — An Emirati Symphony closes the inaugural concert, attended by Sheikh Abdullah bin Zayed Al Nahyan.',
    image: emiratesPalace,
    url: 'https://en.aletihad.ae/news/uae/4637703/abdullah-bin-zayed-attends-uae-national-orchestra-s-landmark',
  },
  {
    slug: 'echoes-of-time-ibn-arabi-aletihad',
    title: 'Echoes of Time: The UAE National Orchestra Sets Ibn Arabi to Music',
    source: 'Aletihad',
    date: '2026-02-24',
    summary:
      'Aletihad previews the world premiere of Nadim Tarabay’s symphonic setting of seven poems by the Sufi mystic, conducted by Ahmed Farag at NYU Abu Dhabi’s Arts Centre on 25 February 2026.',
    image: echoesCover,
    url: 'https://en.aletihad.ae/amp/news/culture/4646973/uae-national-orchestra-sets-the-poetry-of-ibn-arabi-to-music',
  },
  {
    slug: 'the-beginning-tours-the-emirates',
    title: 'The Beginning Tours the Emirates: More Than 3,500 Hear Tarabay’s Emirati Symphony',
    source: '',
    date: '2026-06-06',
    summary:
      'Starting in Abu Dhabi, the tour went on to Dubai, Al Ain, Fujairah and Ras Al Khaimah before closing in Sharjah, reaching more than 3,500 people. At its centre was the world premiere of Nadim Tarabay’s Emirati Symphony.',
    image: heroImage,
    url: 'https://gates-dubai.com/en/article/8357',
  },
  {
    slug: 'second-prize-sinfonietta-en-spirale',
    title:
      'Second Prize for Sinfonietta en Spirale at the Abu Dhabi International Competition for Composition',
    source: 'Aletihad',
    date: '2026-01-08',
    summary:
      'Aletihad announces the winners of the first Abu Dhabi International Competition for Composition, organised by the Abu Dhabi Festival. Nadim Tarabay took Second Prize in the orchestra category for Sinfonietta en Spirale.',
    image: competition,
    url: 'https://en.aletihad.ae/news/culture/4635775/abu-dhabi-festival-announces-winners-of-inaugural-abu-dhabi',
  },
];

export const findPress = (slug) => PRESS.find((article) => article.slug === slug);
