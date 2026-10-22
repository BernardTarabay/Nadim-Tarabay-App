import { Router } from 'express';
import { contactController } from '../controllers/contact.controller.js';
import { rateLimit } from '../middleware/rateLimit.js';

export const contactRoutes = Router().post(
  '/',
  rateLimit({ max: 5, windowMs: 15 * 60 * 1000 }),
  contactController.send,
);
