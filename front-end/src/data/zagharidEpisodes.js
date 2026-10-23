export const ZAGHARID_CHANNEL_URL = 'https://www.youtube.com/@ZagharidPod';

export const videoUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

// 16:9 content sits inside a 4:3 frame here, so the player crops it with object-fit: cover.
export const thumbnailUrl = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const episode = (number, youtubeId, title, guest) => ({
  id: youtubeId,
  youtubeId,
  label: number ? `Episode ${number}` : 'Documentary',
  title,
  guest,
});

// Newest first, as on the channel.
export const ZAGHARID_EPISODES = Object.freeze([
  episode(null, 'r9jrbiXzX1A', 'Did Arabs Notate Music? The Hidden Truth', null),
  episode(
    29,
    'c0IRAaKt-QU',
    'The Story Behind Nassim Maalouf’s Oriental Trumpet',
    'Nassim Maalouf',
  ),
  episode(28, 'VfORvDNeWzA', 'Faith, Hope & Music for Cinema', 'Khaled Mouzanar'),
  episode(27, 'ecyYK1bXayo', 'The Producer Redefining Lebanese Pop Music', 'Jad Obeid'),
  episode(26, 'sWF36FghT2E', 'Wadia Sabra, The Founder', 'Fady Jeanbart & Tony Gemayel'),
  episode(25, 'JBR_HHcz5rE', 'The Influence of Politics on Music', 'Ghassan Moukheiber'),
  episode(24, '53Zn6jhjsYI', 'Why the World of Music Is in Danger', 'Daniel Teruggi'),
  episode(22, 'l1PM_u4P2rg', 'Revolutionizing Orchestra Concerts', 'Marc Hajjar'),
  episode(21, 'ymT3WGTKuGQ', 'A Jazz Fusion Odyssey', 'Lynn Adib'),
  episode(20, 'DL2Oe_FxC6E', 'Becoming an Artist in the 21st Century', 'Alexandre Khoury'),
  episode(19, '5vuqjedPJU0', 'Music & Fate in the Jeita Grotto', 'François Bayle'),
  episode(18, 'IZmwdAWTsRA', 'Lebanese Musical Theatre', 'Ghady Rahbani'),
  episode(17, '9FX5jJtV-w0', 'Beethoven, a Lebanese Martyr', 'Marc Ernest'),
  episode(16, 'mDkBzzYut4E', 'The History of Eastern Music', 'Victor Sahhab'),
  episode(15, 'ivu8Wrr403I', 'Improvisation Vs. Notation', 'Bushra El-Turk'),
  episode(14, 'wXNMq-BOQ04', 'A Brief History of the Piano', 'Ziad Kreidy'),
  episode(13, 'NlobD9HxzZw', 'How Your Brain Perceives Music', 'Albert Moukheiber'),
  episode(12, 'XE91R-9QYRA', 'The Humble Giant', 'Abdel Rahman El Bacha'),
  episode(11, '-_-yyrkMMA0', 'Memory Master Musician', 'Mohtadi El Hage'),
  episode(10, 'U12TQPdNYQ0', 'Early Maronite & Byzantine Music', 'Fr. Geha & Johnny Kassis'),
  episode(9, '9JdPfsgVgBc', 'How to Run a Festival', 'Toufic Maatouk'),
  episode(8, 'GFJLzwyHAac', 'The Decentralisation of Music', 'Elie Sfeir & Ramzi Kandalaft'),
  episode(7, 'rJl9FNezV5g', 'On Musical Aesthetics and Beauty', 'Alaa Al-Rashidi'),
  episode(6, 'HtAK2Kbi-TQ', 'Oriental Music & Innovation', 'Ziyad Sahhab & Makram Abul Hosn'),
  episode(5, 'AwWG864ipIU', 'The Concept of Musical Loyalty', 'Yasmina Sabah & Mario Al-Rahi'),
  episode(4, 'mwOPJPsyfBs', 'Lebanon in an Orchestra', 'Lubnan Baalbaki'),
  episode(3, 'M-8fRrsDaTw', 'Somebody Erased Beirut', 'Zeid Hamdan'),
  episode(2, 'P2zPPERzO9g', 'A Deep Dive into Monomania', 'Sary & Ayad Khalifé'),
  episode(1, 'QO3doZh3j_Q', 'The Exotic & The Sensational', 'El Rass & Sharif El Sehnaoui'),
]);
