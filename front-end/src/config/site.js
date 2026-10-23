import siteContent from '@/content/site.json';

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

// Pages that can be hidden without deleting them. A hidden page is off the menu, the sitemap and
// link previews, and its address shows the not-found page; its code and data are kept.
export const SHOW = Object.freeze({
  pressArticles: true,
  ads: false,
});

export const NAV = [
  {
    label: 'News',
    match: ['/news'],
    children: [
      { label: 'Updates', to: PATHS.news },
      ...(SHOW.pressArticles ? [{ label: 'Articles', to: PATHS.pressArticles }] : []),
    ],
  },
  {
    label: 'Work',
    match: ['/work'],
    children: [
      { label: 'Scores', to: PATHS.scores },
      { label: 'Recordings', to: PATHS.recordings },
      ...(SHOW.ads ? [{ label: 'Ads', to: PATHS.ads }] : []),
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

// The footer quote and social links are edited from the studio (shape in shared/content.js).
export const SOCIAL = siteContent.social;

export const FOOTER = Object.freeze({
  tagline: siteContent.footerTagline,
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
