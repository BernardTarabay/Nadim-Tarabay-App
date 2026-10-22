import hero from '@/pictures/about/hero.webp';
import heroMobile from '@/pictures/about/hero-mobile.webp';
import intro from '@/pictures/about/intro.webp';
import press from '@/pictures/about/press.webp';
import antarStage from '@/pictures/about/antar-stage.webp';
import portraitGrey from '@/pictures/about/portrait-grey.webp';
import podcastSession from '@/pictures/zagharid/story.webp';
import stageBw from '@/pictures/about/stage-bw.webp';

export const ABOUT = Object.freeze({
  seo: {
    title: 'The Composer’s Journey',
    description:
      'Nadim Tarabay is a Lebanese composer whose music draws on the heritage of his land, from Maronite liturgy to the folk dances and sung poetry of the mountains.',
  },

  hero: {
    title: 'The Composer’s Journey',
    paragraphs: [
      'Nadim Tarabay is a Lebanese composer whose music draws on the heritage of his land, from Maronite liturgy to the folk dances and sung poetry of the mountains, reimagined through contemporary composition. Born in 1997, he studied with Stefano Gervasoni at the Conservatoire national supérieur de musique et de danse de Paris (CNSMDP) and graduated in 2026 with the Prix de composition.',
      'His works have been commissioned by the UAE National Orchestra, the Philharmonie de Paris, Mubadala, the Lebanese National Conservatory of Music and the choir of Université Saint-Joseph, and heard from the Cité de la musique to the Emirates Palace. He has also taken part in the Festival Messiaen au Pays de la Meije, the Festival de Caen and the D440 Festival.',
    ],
    image: {
      src: hero,
      mobileSrc: heroMobile,
      alt: 'Nadim Tarabay on stage with the UAE National Orchestra',
    },
  },

  intro: {
    title: 'Discover the life of Nadim Tarabay: Composer, and Entrepreneur',
    paragraphs: [
      'Tarabay did not come to composition through a conservatoire. As a teenager, his only formal training was in harmony with Joseph Fakhry; the rest he taught himself. He first studied law, earning a master’s in business law from Université Saint-Joseph de Beyrouth.',
      'After a year at the New England Conservatory in Boston, he returned home in 2019, when Lebanon’s economic collapse and political upheaval began. Soon after, he entered the CNSMDP composition class, which surprised everyone who knew him as a lawyer.',
      'He graduated in 2026 with the Prix de composition and the mention très bien, after five years of orchestral, choral and cross-cultural work. His thesis, De l’instrument invité au pupitre orchestral, examines how plucked and struck Arab instruments such as the oud, qanun and santur can move from guest soloists to a true orchestral section.',
    ],
    image: { src: intro, alt: 'Portrait of Nadim Tarabay smiling' },
  },

  impact: {
    title: 'Nadim’s impact on classical music',
    paragraphs: [
      'Tarabay’s music is shaped by the neoclassical and spectral schools: Stravinsky, Penderecki, Vivier, Grisey and Romitelli. From them he takes a concern for structure, an ear for the inner life of sound, and the freedom to rebuild inherited material rather than quote it.',
      'That material is Lebanese: Maronite chant, folk dance, and the sung poetry of zajal, ʿataba and mijana. He does not harmonise it in the Western sense. He sets it within a fractal, micropolyphonic framework of self-similarity, where a melodic cell returns at different scales and speeds.',
      'His guiding image is the call to prayer rising from several mosques at once, each voice slightly out of step, together forming a vast, shifting polyphony. His harmony emerges the same way, as a by-product of micropolyphony and prolation canons. It builds on the real strengths of the Eastern heritage, its modal richness and heterophony, instead of treating the absence of Western harmony as a weakness.',
      'He applies the same thinking to sound. He designs amplification in planes so that the oud, qanun, nay and strings are heard as one orchestra rather than a band placed in front of a symphony.',
    ],
    distinctionsTitle: 'Distinctions',
    distinctions: [
      'Prix de composition, CNSMDP, mention très bien (2026)',
      'Second Prize, orchestral category, Abu Dhabi International Competition for Composers, for Sinfonietta en Spirale (2026)',
      'Laureate of the Fondation Nguyễn Thiên Đạo, the Sylff fellowship of the Tokyo Foundation, and the Fondation de France',
    ],
    polaroid: {
      src: press,
      alt: 'Nadim Tarabay interviewed at a UAE National Orchestra press event',
    },
  },

  podcast: {
    title: 'Zagharid Podcast',
    columns: [
      [
        'Since its launch in early 2024, Tarabay has hosted Zagharid, an Arabic-language podcast of in-depth conversations with the people shaping music in the Middle East. Guests from Lebanon, Syria, Palestine, Iraq, Egypt and beyond discuss their craft and influences, and the social, cultural and political forces that shape music in the region. The show is made for the Arab world and its diaspora.',
        'In 2026, Tarabay founded Zagharid Ltd, a creative production and consultancy firm. It combines the composer who knows the orchestra from the inside with the lawyer who understands the contracts and rights behind large productions. The firm advises cultural institutions and festivals on ambitious musical projects, from the first idea to the final performance.',
      ],
      [
        'The conversations move between the creative and the structural. Episodes have explored artistic obsession with Sary and Ayad Khalifé, and the decentralisation of the music industry with Elie Sfeir and Ramzi Kandalaft. Others covered rethinking the orchestral concert experience with Marc Hajjar, the influence of politics on music with Ghassan Moukheiber, and songwriting, harmony and mixing with producer Jad Obeid. Guests have also included singer Lynn Adib and Daniel Teruggi, long-time director of the GRM in Paris. A special episode with Fady Jeanbart and Tony Gemayel looked back on Wadih Sabra, founder of the Lebanese conservatory.',
        'Each episode combines conversation with musical moments and stories of the region’s heritage, for both those who make music and those who listen to it. Zagharid is available on YouTube, Spotify, Apple Podcasts, Anghami and Deezer.',
      ],
    ],
    mobileImages: [
      { src: stageBw, alt: 'Nadim Tarabay alone on a dark concert stage' },
      { src: antarStage, alt: 'Cast of Antar & Abla on stage under a red moon' },
      { src: portraitGrey, alt: 'Portrait of Nadim Tarabay' },
    ],
  },

  strip: [
    { src: antarStage, alt: 'Cast of Antar & Abla on stage under a red moon' },
    { src: portraitGrey, alt: 'Portrait of Nadim Tarabay' },
    { src: podcastSession, alt: 'Nadim Tarabay recording an episode of Zagharid with two guests' },
  ],
});
