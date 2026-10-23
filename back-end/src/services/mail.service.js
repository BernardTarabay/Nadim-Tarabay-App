import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { HttpError } from '../middleware/errors.js';

// Caps what this server instance sends, whoever is asking, so a flood from many addresses
// cannot use up the Gmail account's daily sending quota.
const SEND_LIMIT = { max: 10, windowMs: 60 * 60 * 1000 };

export class MailService {
  constructor(smtp, { hosted }) {
    this.dryRun = !smtp;
    this.hosted = hosted;
    this.transport = nodemailer.createTransport(smtp ?? { jsonTransport: true });
    this.sentAt = [];
  }

  async send(mail) {
    if (this.dryRun && this.hosted) {
      throw new HttpError(503, 'The contact form is not set up yet. Please email directly.');
    }
    const now = Date.now();
    this.sentAt = this.sentAt.filter((time) => now - time < SEND_LIMIT.windowMs);
    if (this.sentAt.length >= SEND_LIMIT.max) {
      throw new HttpError(429, 'The form is busy right now. Please email directly.');
    }
    this.sentAt.push(now);
    const info = await this.transport.sendMail(mail);
    if (this.dryRun)
      console.info(`[mail] SMTP is not set up, so this was not sent:\n${info.message}`);
    return info;
  }
}

export const mailService = new MailService(config.smtp, config);
