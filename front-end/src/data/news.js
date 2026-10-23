import heroImage from '@/pictures/news/hero.webp';
import heroMobile from '@/pictures/news/hero-mobile.webp';
import zagharidSquare from '@/pictures/news/zagharid-ltd-square.webp';
import zagharidLogo from '@/pictures/news/zagharid-ltd-logo.webp';
import usjEmblem from '@/pictures/news/usj-emblem.webp';
import uaeTour from '@/pictures/news/uae-tour.webp';

export const NEWS_PAGE = Object.freeze({
  title: 'Updates',
  description: 'Updates from Nadim Tarabay: new works, premieres, tours and Zagharid.',
  hero: { src: heroImage, mobileSrc: heroMobile, alt: 'A composer writing at a desk under a lamp' },
});

export const NEWS = [
  {
    slug: 'zagharid-ltd-consultancy-creative-production-firm',
    title: 'Tarabay Launches Zagharid LTD Consultancy & Creative Production Firm',
    date: '2026-09-30',
    excerpt:
      'Composer and orchestrator Nadim Tarabay has founded Zagharid Ltd, a consultancy and creative production firm bringing his experience in music, culture and institutional projects together in a single practice.',
    image: { src: zagharidLogo, fit: 'contain' },
    listImage: zagharidSquare,
    body: [
      'Composer and orchestrator Nadim Tarabay has founded Zagharid Ltd, a consultancy and creative production firm. It brings his experience in music, culture and institutional projects together in a single practice. Established in July 2026, the company offers artistic direction, production and strategic advice to cultural institutions, festivals and organisations building ambitious musical projects.',
      'The firm takes its name from Zagharid, Tarabay’s podcast dedicated to meaningful conversations about music in the Middle East. Like the podcast, the company is built on the conviction that the region’s musical heritage deserves the same care, rigour and ambition as any repertoire in the world.',
      'Tarabay brings an unusual combination of backgrounds to the firm. He trained in composition at the Conservatoire national supérieur de musique et de danse de Paris and has written and orchestrated works commissioned by the UAE National Orchestra, the Philharmonie de Paris and Mubadala. He also holds a master’s degree in business law from Université Saint-Joseph. That gives him a working understanding of the contracts, structures and negotiations behind large-scale artistic productions.',
      '“Many institutions have the vision and the resources for major musical projects, but not always the bridge between the two. Zagharid is meant to be that bridge: a partner who understands the score, the stage and the contract at the same time, and who can carry an idea all the way to the audience.”',
      'With Zagharid Ltd, Tarabay extends his work beyond the concert hall, offering partners a single point of contact from the first idea to the final performance.',
    ],
  },
  {
    slug: 'the-word-made-flesh-nativity-oratorio',
    title: 'Tarabay’s latest work: An oratorio about the Nativity story, with a twist',
    date: '2026-09-30',
    excerpt:
      'The Word Made Flesh is an 85-minute oratorio commissioned by the USJ choir. It tells the Christmas story in Arabic and Syriac, drawing on Maronite chant within a fully modern orchestral language. The piece moves from gospel to prophecy and does not shy away from the story’s darker moments, including Rachel weeping in Ramah.',
    image: { src: usjEmblem, fit: 'contain' },
    listImage: usjEmblem,
    body: [
      'Nadim Tarabay’s new oratorio, The Word Made Flesh, retells the story of the Nativity for soloists, choir and orchestra. It was commissioned by the choir of Université Saint-Joseph in Beirut. The work runs approximately 85 minutes and unfolds across a prologue, thirty-seven movements and an epilogue, arranged in five parts.',
      'The twist lies in its languages and its scope. Sung in Arabic and Syriac, the oratorio draws its texts from the Gospels of Luke, Matthew and John, and from the prophets Micah and Jeremiah. Alongside the familiar scenes of the Nativity, it gives space to the story’s darker chapter: Rachel weeping in Ramah for her children.',
      'Musically, Tarabay uses Maronite chant as raw material while writing an entirely new score. The work is scored for string orchestra, piano, timpani and percussion, with choir, a principal baritone and two sopranos. It moves between moments of chamber-like intimacy and passages of monumental, collective sound that fill the hall.',
      '“The Nativity is usually told as a gentle story. I wanted to tell it whole, with the light, the waiting, the fear and the grief, and to tell it in the languages in which this land has prayed for centuries. The chants are part of that memory, but the music had to speak in a voice of today.”',
      'Composed between June and August 2026, The Word Made Flesh joins Tarabay’s growing body of large-scale sacred and vocal works. It follows The Maronite Symphonic Mass and the Ibn ‘Arabi oratorio Echoes of Time, and stands as one of his most personal statements to date.',
    ],
  },
  {
    slug: 'successful-tour-in-the-emirates',
    title: 'Successful Tour In The Emirates With The UAE Orchestra',
    date: '2026-09-30',
    excerpt:
      'Tarabay’s collaboration with the UAE National Orchestra has reached audiences across the country. It began with The Beginning, An Emirati Symphony at the inaugural concert at Emirates Palace and continued with Echoes of Time at venues including Dubai Opera. The tour featured oud, nay and qanun alongside the orchestra.',
    image: { src: uaeTour },
    listImage: uaeTour,
    body: [
      'Nadim Tarabay’s music has travelled the length of the country with the UAE National Orchestra. The orchestra’s first national tour, The Beginning, took his new symphony to six cities and drew more than 3,500 people across the Emirates.',
      'The tour opened on 15 January 2026 at the Emirates Palace Auditorium in Abu Dhabi. There, The Beginning — An Emirati Symphony received its world premiere in the presence of Sheikh Abdullah bin Zayed Al Nahyan, senior officials, ambassadors and cultural leaders. It then continued to Dubai, Al Ain, Fujairah and Ras Al Khaimah, before closing at the Sharjah Performing Arts Academy.',
      'Under artistic director and conductor Amine Kouider, the orchestra brought together seventy musicians and a thirty-voice choir from thirty nationalities. Tarabay’s symphony is written in two parts and weaves ouds, nays, zurna, qanun and oriental strings into the orchestral fabric. It draws on the spirit of the Ayyala to give Emirati heritage a new symphonic form.',
      'The collaboration continued in February, when the orchestra premiered his Ibn ‘Arabi oratorio, Echoes of Time, at NYU Abu Dhabi before taking it to Dubai. The work sets seven poems by the Sufi mystic.',
      '“Hearing the symphony in six cities, in front of such different audiences, was extraordinary. Each night the music met people who recognised something of their own heritage in it, and that recognition is what I was writing for.”',
      'The tour marks a defining chapter in Tarabay’s relationship with the UAE National Orchestra, and a strong beginning for a partnership built on shared ambition for new music from the region.',
    ],
  },
];

export const findNews = (slug) => NEWS.find((article) => article.slug === slug);
