import hero from '@/pictures/zagharid/hero.webp';
import logo from '@/pictures/zagharid/logo.webp';
import story from '@/pictures/zagharid/story.webp';
import marcHajjar from '@/pictures/zagharid/episode-marc-hajjar.webp';
import khaledMouzanar from '@/pictures/zagharid/episode-khaled-mouzanar.webp';
import bushraElTurk from '@/pictures/zagharid/episode-bushra-el-turk.webp';
import host from '@/pictures/zagharid/host.webp';
import ctaBackground from '@/pictures/zagharid/cta-bg.webp';

export const ZAGHARID = Object.freeze({
  seo: {
    title: 'Zagharid',
    description:
      'Zagharid is an Arabic-language podcast of long-form conversations with the people shaping music in the Middle East, hosted by Nadim Tarabay.',
  },
  hero: { src: hero, alt: 'Portrait of Nadim Tarabay' },
  logo: { src: logo, alt: 'Zagharid' },

  story: {
    title: 'The Story',
    columns: [
      [
        'In much of the Middle East, joy has a sound: the zaghrouta, the high, trilling ululation heard at weddings, births, homecomings and every celebration in between. Zagharid, its plural, takes its name from that sound.',
        'Launched in February 2024, Zagharid is an Arabic-language podcast of long-form conversations with the people shaping music in the Middle East. The region’s musical life is rich, but it is rarely discussed in depth in its own language. Zagharid sets out to change that.',
      ],
      [
        'Each episode looks at the person behind the music: their craft and methods, their background and influences, and the social, cultural and political forces that shape music in Lebanon, Syria, Palestine, Iraq, Egypt and beyond. The conversations move freely between heritage and innovation and between theory and practice. They also cover the concert hall, the recording studio, the street and the institutions behind them.',
      ],
    ],
    image: { src: story, alt: 'Nadim Tarabay recording an episode of Zagharid with two guests' },
  },

  conversations: {
    title: 'The Conversations',
    paragraphs: [
      'Across its first 27 episodes, Zagharid has welcomed composers, performers, producers, scholars, scientists and cultural leaders.',
      'Heritage and history: Victor Sahhab on the history of Eastern music; Fr. Geha and Johnny Kassis on early Maronite and Byzantine chant; Ghady Rahbani on Lebanese musical theatre; Fady Jeanbart and Tony Gemayel on Wadih Sabra, founder of the Lebanese conservatory.',
      'The classical world: pianist Abdel Rahman El Bacha; Ziad Kreidy on the history of the piano; conductor Lubnan Baalbaki on Lebanon’s orchestral life; Marc Hajjar on reinventing the orchestral concert.',
    ],
  },

  episodes: [
    {
      guest: 'Khaled Mouzanar',
      title: 'Faith, Hope & Music for Cinema',
      image: khaledMouzanar,
      url: null,
    },
    {
      guest: 'Bushra El-Turk',
      title: 'Improvisation Vs. Notation',
      image: bushraElTurk,
      url: null,
    },
    {
      guest: 'Marc Hajjar',
      title: 'Revolutionizing Orchestra Concerts',
      image: marcHajjar,
      url: null,
    },
  ],

  person: {
    title: 'The Person Behind Zagharid',
    paragraphs: [
      'Zagharid was created and is hosted by Nadim Tarabay, a Lebanese composer born in 1997. A graduate in business law from Université Saint-Joseph, he came to composition largely self-taught. He went on to study with Stefano Gervasoni at the Conservatoire national supérieur de musique et de danse de Paris and graduated in 2026 with the Prix de composition.',
      'His music draws on Maronite liturgy, Lebanese folk dance and sung poetry within a contemporary, micropolyphonic language. His works have been commissioned by the UAE National Orchestra, the Philharmonie de Paris and Mubadala.',
      'Zagharid grew out of the same concern that drives his compositions: taking the music of the region seriously, on its own terms and in its own language. As a composer, Tarabay asks the questions his guests face every day, and the conversations become exchanges between practitioners rather than interviews. In 2026, he founded Zagharid Ltd, a creative production and consultancy firm that extends the podcast’s mission into the making of new work.',
    ],
    image: { src: host, alt: 'Nadim Tarabay with guests of Zagharid' },
  },

  cta: {
    title: 'Ready to share your sound?',
    text: 'Join the conversation and let’s make your story the next one we hear on Zagharid.',
    button: 'Contact us',
    background: ctaBackground,
  },
});

export const episodeUrl = (episode) =>
  episode.url ??
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`Zagharid ${episode.guest}`)}`;
