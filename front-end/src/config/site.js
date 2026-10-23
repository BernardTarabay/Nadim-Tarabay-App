export const PATHS = Object.freeze({
  home: '/',
  about: '/about',
  scores: '/work/scores',
  recordings: '/work/recordings',
  ads: '/work/ads',
  zagharid: '/zagharid',
  news: '/news',
  newsArticle: (slug) => `/news/${slug}`,
  pressArticles: '/news/articles',
  pressArticle: (slug) => `/news/articles/${slug}`,
});

export const CONTACT_ANCHOR = 'contact';

export const NAV = [
  {
    label: 'News',
    match: ['/news'],
    children: [
      { label: 'Updates', to: PATHS.news },
      { label: 'Articles', to: PATHS.pressArticles },
    ],
  },
  {
    label: 'Work',
    match: ['/work'],
    children: [
      { label: 'Scores', to: PATHS.scores },
      { label: 'Recordings', to: PATHS.recordings },
      { label: 'Ads', to: PATHS.ads },
    ],
  },
  {
    label: 'Zagharid',
    match: ['/zagharid'],
    children: [{ label: 'Podcast', to: PATHS.zagharid }],
  },
  { label: 'About', to: PATHS.about, match: ['/about'] },
];

export const SITE = Object.freeze({
  name: 'Nadim Tarabay',
  url: 'https://nadimtarabay.com',
  description: 'Award winning international Lebanese composer of contemporary classical music.',
});

export { CONTACT } from '@shared/contact';

export const SOCIAL = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/_nadimtarabay/' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/nadim.tarabay/' },
  { id: 'soundcloud', label: 'SoundCloud', href: 'https://soundcloud.com/nadim-tarabay' },
];

export const FOOTER = Object.freeze({
  tagline: '“If music be the food of love, play on.”',
  pages: [
    { label: 'Homepage', to: PATHS.home },
    { label: 'About', to: PATHS.about },
    { label: 'Scores', to: PATHS.scores },
    { label: 'Recordings', to: PATHS.recordings },
    { label: 'Zagharid', to: PATHS.zagharid },
    { label: 'Updates', to: PATHS.news },
  ],
  copyrightPrefix: '© All rights reserved by',
});
