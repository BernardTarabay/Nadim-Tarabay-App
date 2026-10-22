import { config } from '../config/env.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { mailService } from '../services/mail.service.js';

export const contactController = {
  async send(req, res) {
    const message = new ContactMessage(req.body);
    if (message.isSpam) {
      res.json({ ok: true });
      return;
    }
    const errors = message.validate();
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ message: 'Please check the highlighted fields.', errors });
      return;
    }
    await mailService.send(message.toEmail(config.mail));
    res.json({ ok: true });
  },
};
