import thesisCover from '@/pictures/blogs/thesis.webp';
import operaHouse from '@/pictures/blogs/opera-house.webp';
import pianoHandsDark from '@/pictures/blogs/piano-hands-dark.webp';
import pianoHands from '@/pictures/blogs/piano-hands.webp';
import concertHall from '@/pictures/blogs/concert-hall.webp';
import orchestra from '@/pictures/images/orchestra.webp';

export const BLOGS_PAGE = Object.freeze({
  title: 'Latest Blogs',
  description:
    'Explore the stories behind the music, the ideas that shape compositions, and the creative minds behind every melody. Discover insights, reflections, and perspectives from the world of music and composers.',
});

export const BLOG_POSTS = [
  {
    slug: 'de-l-instrument-invite-au-pupitre-orchestral',
    title: 'De l’instrument invité au pupitre orchestral',
    date: '2026-11-29',
    cover: thesisCover,
    lead: {
      images: [
        { src: operaHouse, alt: 'An opera house interior' },
        { src: pianoHandsDark, alt: 'Hands on a piano keyboard in low light' },
        { src: pianoHands, alt: 'Hands playing a grand piano' },
      ],
      paragraphs: [
        'Essential, perhaps, best articulates Nadim Tarabay’s role in Lebanon’s classical music scene. Growing from a deep appreciation for the piano, he found his voice through classical compositions and performances, shaping a musical journey rooted in tradition, emotion, and timeless expression.',
        'The future of music is constantly evolving. New technologies, changing audiences, and emerging creative industries are opening new possibilities, and Nadim’s ventures are driven by the curiosity to explore them and create what comes next. The most powerful ventures begin with a simple idea and grow through collaboration.',
      ],
    },
    sections: [
      {
        type: 'feature',
        band: true,
        title: 'Looking Toward What Comes Next',
        paragraphs: [
          'The future of music is constantly evolving. New technologies, changing audiences, and emerging creative industries are opening new possibilities, and Nadim’s ventures are driven by the curiosity to explore them and create what comes next. The most powerful ventures begin with a simple idea and grow through collaboration.',
        ],
        images: [
          { src: concertHall, alt: 'A concert hall seen from the balcony' },
          { src: orchestra, alt: 'An orchestra seen from above' },
        ],
      },
    ],
  },
];

export const findBlogPost = (slug) => BLOG_POSTS.find((post) => post.slug === slug);
