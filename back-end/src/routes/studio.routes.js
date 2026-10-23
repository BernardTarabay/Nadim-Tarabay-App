import { Router } from 'express';
import { studioController } from '../controllers/studio.controller.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { requireStudio, requireStudioSetup } from '../middleware/studioAuth.js';

export const studioRoutes = Router()
  .use(requireStudioSetup)
  .post(
    '/login',
    rateLimit({
      max: 8,
      windowMs: 15 * 60 * 1000,
      message: 'Too many attempts. Try again in a few minutes.',
    }),
    studioController.login,
  )
  .post('/logout', studioController.logout)
  .use(requireStudio)
  .get('/session', studioController.session)
  .get('/stats', studioController.stats)
  .get('/live', studioController.live)
  .get('/content', studioController.contentList)
  .get('/content/:key', studioController.contentRead)
  .put('/content/:key', studioController.contentSave);
