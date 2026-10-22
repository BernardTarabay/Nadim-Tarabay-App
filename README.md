# Nadim Tarabay — website

Portfolio site for the composer Nadim Tarabay: a React single-page site with one small API (the
contact form), hosted on Vercel at https://nadimtarabay.com.

| Folder       | What it is                                                                            |
| ------------ | ------------------------------------------------------------------------------------- |
| `front-end/` | The site: React + Vite. Content lives in `front-end/src/data/*.js`.                   |
| `back-end/`  | The API: Express, MVC (`routes/ → controllers/ → models/ + services/`).               |
| `shared/`    | Code both use: the contact form's settings and validation rules.                      |
| `api/`       | Vercel's entry point; hands every `/api/*` request to the Express app in `back-end/`. |

## Develop

Needs Node 20.12 or newer.

```bash
npm install
npm run dev      # site + API on http://localhost:5173 (restart after editing back-end/)
npm run lint
npm run build    # front-end/dist, including one HTML file per page for link previews
```

To send real email locally, copy `.env.example` to `.env` and fill it in. Without it, contact
messages are printed in the terminal instead of sent.

## Content still to come

- **Audio:** drop the files into `front-end/public/audio/` using the names in `front-end/src/data/`
  (`tracks.js`, `works.js`, `scores.js`, `recordings.js`).
- **Scores:** only a sample is published: the title page and first 3 pages as images in
  `front-end/src/pictures/scores/` (`covers/`, `pages/`); later pages show blurred. Page counts are in
  `works.js`. Keep the full PDFs out of `public/`, where anyone could download them.
- **Blog post text:** `front-end/src/data/blogs.js`.

Pages, titles and link previews come from the same data, so adding an item there is all it takes.

## Deploy (Vercel)

1. Push the repository to GitHub and import it in Vercel. Leave **Root Directory** empty (the
   repository root, not `front-end`); `vercel.json` holds the build settings.
2. In **Settings → Environment Variables**, add `SMTP_USER` and `SMTP_PASS` (see `.env.example`).
   Until they exist, the live form answers "not set up yet, please email directly".
3. In **Settings → Domains**, add `nadimtarabay.com` and `www.nadimtarabay.com`. Vercel then shows
   the DNS records to create; add exactly those in Wix (**Domains → Manage DNS Records**), usually
   an `A` record for the bare domain and a `CNAME` for `www`.
