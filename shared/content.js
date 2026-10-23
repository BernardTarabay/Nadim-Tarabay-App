/**
 * The parts of the site the studio can edit. Each entry names its JSON file and describes its
 * shape; the studio builds its forms from the shape and the server validates every save against
 * it, so a save can never commit a file the site cannot build from.
 */

const text = (label, max = 120, extra = {}) => ({ type: 'text', label, max, ...extra });
const paragraph = (label, max = 1500) => text(label, max, { multiline: true });
const optional = (field) => ({ ...field, optional: true });
const group = (label, fields) => ({ type: 'group', label, fields });
const list = (label, item, options = {}) => ({
  type: 'list',
  label,
  item,
  min: 0,
  max: 200,
  ...options,
});
const choice = (label, options) => ({ type: 'choice', label, options });

export const HOME_SECTION_IDS = ['collaborators', 'output', 'composer', 'credits'];
const SECTION_NAMES = {
  collaborators: 'Collaborators',
  output: 'Musical Output',
  composer: 'Meet the Composer',
  credits: 'Recent credits',
};
const SOCIAL_IDS = ['instagram', 'facebook', 'soundcloud'];

const sameIds = (ids) => (items) =>
  items.length === ids.length && ids.every((id) => items.some((item) => item.id === id))
    ? null
    : 'Every item must appear exactly once.';

export const CONTENT = {
  home: {
    label: 'Home page',
    description:
      'The hero text, the section titles and texts, and which sections show, in what order.',
    file: 'front-end/src/content/home.json',
    schema: group(null, {
      hero: group('Hero', {
        firstName: text('First name', 40),
        lastName: text('Last name', 40),
        description: paragraph('Description', 300),
        tagline: paragraph('Tagline under the hero', 300),
      }),
      sections: list(
        'Sections, in order',
        group(null, {
          id: { ...choice('Section', HOME_SECTION_IDS), names: SECTION_NAMES, readonly: true },
          visible: { type: 'boolean', label: 'Shown on the page' },
        }),
        {
          fixed: true,
          itemLabel: (item) => SECTION_NAMES[item.id],
          check: sameIds(HOME_SECTION_IDS),
        },
      ),
      collaborators: group('Collaborators', {
        title: text('Title', 80),
        description: paragraph('Description', 400),
      }),
      output: group('Musical Output', {
        title: text('Title', 80),
        description: paragraph('Description', 400),
      }),
      composer: group('Meet the Composer', {
        title: text('Title', 80),
        introduction: paragraph('Introduction'),
        story: paragraph('Story'),
        cta: text('Button text', 40),
      }),
      credits: group('Recent credits', { title: text('Title', 80) }),
    }),
  },

  credits: {
    label: 'Recent credits',
    description: 'The table of recent projects at the bottom of the home page.',
    file: 'front-end/src/content/credits.json',
    schema: list(
      'Credits, newest first',
      group(null, {
        project: text('Project', 120),
        role: text('Role', 80),
        date: text('Date (month/year, e.g. 12/2026)', 7, { pattern: '^\\d{1,2}/\\d{4}$' }),
        venue: text('Client / venue', 120),
        upcoming: { type: 'boolean', label: 'Upcoming' },
      }),
      { min: 1, max: 40, itemLabel: (item) => item.project },
    ),
  },

  ads: {
    label: 'Ads',
    description: 'The films on the Ads page. The first one is featured at the top.',
    file: 'front-end/src/content/ads.json',
    schema: group(null, {
      films: list(
        'Films, featured first',
        group(null, {
          youtubeId: { type: 'youtube', label: 'YouTube link or video ID' },
          title: text('Title', 100),
          kind: text('Kind (e.g. Trailer, Campaign film)', 40),
          subtitle: text('Subtitle (e.g. the client)', 100),
          year: { type: 'number', label: 'Year', min: 1990, max: 2100 },
          description: paragraph('Description', 1000),
          details: list(
            'Details',
            group(null, { term: text('Label', 40), value: text('Value', 160) }),
            { max: 8, itemLabel: (item) => item.term },
          ),
          score: optional({ type: 'path', label: 'Score page (optional, e.g. /work/scores)' }),
        }),
        { min: 1, max: 30, itemLabel: (item) => item.title },
      ),
    }),
  },

  episodes: {
    label: 'Podcast episodes',
    description: 'The Zagharid "All Episodes" list, newest first. Thumbnails come from YouTube.',
    file: 'front-end/src/content/episodes.json',
    schema: list(
      'Episodes, newest first',
      group(null, {
        number: optional({
          type: 'number',
          label: 'Episode number (empty for a special)',
          min: 1,
          max: 9999,
        }),
        youtubeId: { type: 'youtube', label: 'YouTube link or video ID' },
        title: text('Title', 140),
        guest: optional(text('Guest', 140)),
      }),
      { min: 1, max: 500, itemLabel: (item) => item.title },
    ),
  },

  site: {
    label: 'Footer & social',
    description: 'The footer quote and the social media links.',
    file: 'front-end/src/content/site.json',
    schema: group(null, {
      footerTagline: paragraph('Footer quote', 200),
      social: list(
        'Social links',
        group(null, {
          id: { ...choice('Network', SOCIAL_IDS), readonly: true },
          label: text('Name', 40),
          href: optional({ type: 'url', label: 'Link (empty shows “coming soon”)' }),
        }),
        { fixed: true, itemLabel: (item) => item.label, check: sameIds(SOCIAL_IDS) },
      ),
    }),
  },
};

const YOUTUBE_ID = /^[\w-]{11}$/;

/** Accepts a bare ID or any common YouTube link and returns the 11-character video ID. */
export function youtubeIdFrom(input) {
  const value = String(input ?? '').trim();
  if (YOUTUBE_ID.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^(www|m)\./, '');
    const id =
      host === 'youtu.be'
        ? url.pathname.slice(1)
        : (url.searchParams.get('v') ??
          url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/)?.[1]);
    return YOUTUBE_ID.test(id ?? '') ? id : null;
  } catch {
    return null;
  }
}

function check(field, input, path, errors) {
  const fail = (message) => {
    errors.push({ path, message });
    return undefined;
  };
  const empty = input === undefined || input === null || input === '';

  if (field.type === 'group') {
    const source = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
    if (input !== undefined && source !== input) fail('Expected a group of fields.');
    return Object.fromEntries(
      Object.entries(field.fields).map(([key, child]) => [
        key,
        check(child, source[key], path ? `${path}.${key}` : key, errors),
      ]),
    );
  }

  if (field.type === 'list') {
    if (!Array.isArray(input)) return fail(`${field.label ?? 'This list'} is missing.`) ?? [];
    if (input.length < field.min) fail(`Add at least ${field.min}.`);
    if (input.length > field.max) fail(`Keep it to ${field.max} at most.`);
    const items = input
      .slice(0, field.max)
      .map((item, i) => check(field.item, item, path ? `${path}.${i}` : String(i), errors));
    const problem = field.check?.(items);
    if (problem) fail(problem);
    return items;
  }

  if (field.type === 'boolean') return input === true;

  if (empty) return field.optional ? null : fail(`${field.label} is required.`);

  switch (field.type) {
    case 'text': {
      if (typeof input !== 'string') return fail(`${field.label} must be text.`);
      const value = field.multiline ? input.trim() : input.replace(/\s+/g, ' ').trim();
      if (!value) return field.optional ? null : fail(`${field.label} is required.`);
      if (field.pattern && !new RegExp(field.pattern).test(value))
        return fail(`${field.label}: check the format.`);
      if (value.length > field.max)
        return fail(`${field.label}: keep it under ${field.max} characters.`);
      return value;
    }
    case 'number': {
      const value = Number(input);
      if (!Number.isInteger(value) || value < field.min || value > field.max) {
        return fail(`${field.label}: a whole number from ${field.min} to ${field.max}.`);
      }
      return value;
    }
    case 'choice':
      return field.options.includes(input) ? input : fail(`${field.label}: unknown value.`);
    case 'youtube':
      return youtubeIdFrom(input) ?? fail(`${field.label}: not a YouTube link or ID.`);
    case 'url': {
      try {
        const url = new URL(String(input).trim());
        if (url.protocol !== 'https:') return fail(`${field.label}: use an https:// link.`);
        return url.href.slice(0, 500);
      } catch {
        return fail(`${field.label}: not a valid link.`);
      }
    }
    case 'path':
      return /^\/[\w\-/]*$/.test(String(input).trim())
        ? String(input).trim()
        : fail(`${field.label}: a site path such as /work/scores.`);
    default:
      return fail('Unknown field.');
  }
}

/** Returns the cleaned value and a list of { path, message } problems (empty when it is valid). */
export function validateContent(key, value) {
  const definition = CONTENT[key];
  if (!definition) return { value: null, errors: [{ path: '', message: 'Unknown content.' }] };
  const errors = [];
  const clean = check(definition.schema, value, '', errors);
  return { value: clean, errors };
}
