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

// The press Articles pages are hidden for now: off the menu, the sitemap and link previews, and
// their addresses show the not-found page. The pages and their data are kept; set this to true
// to bring them back.
export const SHOW_PRESS_ARTICLES = false;

export const NAV = [
  {
    label: 'News',
    match: ['/news'],
    children: [
      { label: 'Updates', to: PATHS.news },
      ...(SHOW_PRESS_ARTICLES ? [{ label: 'Articles', to: PATHS.pressArticles }] : []),
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
