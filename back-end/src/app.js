import express from 'express';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { collectRoutes } from './routes/collect.routes.js';
import { contactRoutes } from './routes/contact.routes.js';
import { studioRoutes } from './routes/studio.routes.js';

const app = express();

app.disable('x-powered-by');
// Vercel is the one proxy in front and overwrites X-Forwarded-For with the visitor's IP. Anywhere
// else that header comes straight from the client, who could fake it to dodge the rate limit.
app.set('trust proxy', config.hosted ? 1 : false);

// The studio saves whole content files (the episode list, say), so it gets a larger body limit.
app.use('/api/studio', express.json({ limit: '200kb' }), studioRoutes);
app.use('/api', express.json({ limit: '20kb' }));
app.use('/api/contact', contactRoutes);
app.use('/api/collect', collectRoutes);
app.use('/api', notFound);
app.use('/api', errorHandler);

export default app;
