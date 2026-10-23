import { Router } from 'express';
import { collectController } from '../controllers/collect.controller.js';
import { rateLimit } from '../middleware/rateLimit.js';

// Generous: a single visitor sends a few beacons per page (the view, then time on page and events).
export const collectRoutes = Router().post(
  '/',
  rateLimit({ max: 120, windowMs: 60 * 1000 }),
  collectController.collect,
);
