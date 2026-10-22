import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { HttpError } from '../middleware/errors.js';

export class MailService {
  constructor(smtp, { hosted }) {
    this.dryRun = !smtp;
    this.hosted = hosted;
    this.transport = nodemailer.createTransport(smtp ?? { jsonTransport: true });
  }

  async send(mail) {
    if (this.dryRun && this.hosted) {
      throw new HttpError(503, 'The contact form is not set up yet. Please email directly.');
    }
    const info = await this.transport.sendMail(mail);
    if (this.dryRun)
      console.info(`[mail] SMTP is not set up, so this was not sent:\n${info.message}`);
    return info;
  }
}

export const mailService = new MailService(config.smtp, config);
