import express from 'express';
import { errorHandler, notFound } from './middleware/errors.js';
import { contactRoutes } from './routes/contact.routes.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', true);

app.use('/api', express.json({ limit: '20kb' }));
app.use('/api/contact', contactRoutes);
app.use('/api', notFound);
app.use('/api', errorHandler);

export default app;
