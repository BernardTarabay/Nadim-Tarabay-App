import { CONTENT, validateContent } from '../../../shared/content.js';
import { config } from '../config/env.js';
import { HttpError } from '../middleware/errors.js';
import { studioSession } from '../middleware/studioAuth.js';
import { analyticsService } from '../services/analytics.service.js';
import { contentService } from '../services/content.service.js';

export const studioController = {
  login(req, res) {
    if (!studioSession.passwordMatches(req.body?.password)) {
      throw new HttpError(401, 'That password is not right.');
    }
    studioSession.issue(res);
    res.json({ ok: true });
  },

  logout(req, res) {
    studioSession.clear(res);
    res.json({ ok: true });
  },

  async session(req, res) {
    res.json({
      analytics: await analyticsService.enabled(),
      editing: contentService.mode,
      hosted: config.hosted,
      repo: config.github?.repo ?? null,
    });
  },

  async stats(req, res) {
    res.json(await analyticsService.stats(req.query));
  },

  async live(req, res) {
    res.json(await analyticsService.live());
  },

  contentList(req, res) {
    res.json({
      mode: contentService.mode,
      files: Object.entries(CONTENT).map(([key, { label, description }]) => ({
        key,
        label,
        description,
      })),
    });
  },

  async contentRead(req, res) {
    res.json(await contentService.read(req.params.key));
  },

  async contentSave(req, res) {
    const { value, errors } = validateContent(req.params.key, req.body?.value);
    if (errors.length > 0) {
      res.status(400).json({ message: 'Some fields need fixing.', errors });
      return;
    }
    res.json({ value, ...(await contentService.write(req.params.key, value, req.body?.version)) });
  },
};
