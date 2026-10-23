import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import { analyticsService } from '../services/analytics.service.js';

export const collectController = {
  async collect(req, res) {
    const event = AnalyticsEvent.fromRequest(req);
    if (event) await analyticsService.record(event, { ip: req.ip ?? '' });
    res.status(204).end();
  },
};
