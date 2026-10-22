import { validateContact } from '../../../shared/contact.js';

const text = (value) => (typeof value === 'string' ? value.trim() : '');

const escapeHtml = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );

const oneLine = (value) => value.replace(/\s+/g, ' ');

export class ContactMessage {
  constructor(body) {
    const fields = body && typeof body === 'object' ? body : {};
    this.name = text(fields.name);
    this.email = text(fields.email);
    this.phone = text(fields.phone);
    this.reason = text(fields.reason);
    this.message = text(fields.message);
    this.trap = text(fields.website);
  }

  get isSpam() {
    return this.trap !== '';
  }

  validate() {
    return validateContact(this);
  }

  toEmail({ to, from }) {
    const rows = [
      ['Name', this.name],
      ['Email', this.email],
      ['Phone', this.phone || '–'],
      ['Reason', this.reason],
    ];
    return {
      from,
      to,
      replyTo: { name: oneLine(this.name), address: this.email },
      subject: `Website: ${this.reason} – ${oneLine(this.name)}`,
      text: `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${this.message}`,
      html: `<table cellpadding="4">${rows
        .map(
          ([label, value]) =>
            `<tr><th align="left">${label}</th><td>${escapeHtml(value)}</td></tr>`,
        )
        .join('')}</table><p style="white-space: pre-wrap">${escapeHtml(this.message)}</p>`,
    };
  }
}
