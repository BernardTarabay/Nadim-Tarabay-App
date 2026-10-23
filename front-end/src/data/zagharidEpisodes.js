// Edited from the studio (/studio → Edit site); the shape is defined in shared/content.js.
import episodes from '@/content/episodes.json';

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
export const ZAGHARID_EPISODES = Object.freeze(
  episodes.map(({ number, youtubeId, title, guest }) => episode(number, youtubeId, title, guest)),
);
