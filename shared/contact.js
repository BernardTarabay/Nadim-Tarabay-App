export const CONTACT = Object.freeze({
  email: 'nadimtarabay@gmail.com',
  phonePrefix: '+961',
  reasons: [
    'Compose',
    'Commission',
    'Performance',
    'Press & media',
    'Collaboration',
    'Score access request',
    'Other',
  ],
});

export const CONTACT_LIMITS = Object.freeze({ name: 100, email: 254, phone: 30, message: 5000 });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{6,20}$/;

export function validateContact(values) {
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const message = values.message.trim();
  const errors = {};
  if (name.length < 2) errors.name = 'Please enter your name.';
  else if (name.length > CONTACT_LIMITS.name) errors.name = 'Please shorten your name.';
  if (!EMAIL_RE.test(email) || email.length > CONTACT_LIMITS.email)
    errors.email = 'Please enter a valid email address.';
  if (phone && !PHONE_RE.test(phone)) errors.phone = 'Please enter a valid phone number.';
  if (!CONTACT.reasons.includes(values.reason)) errors.reason = 'Please choose a reason.';
  if (message.length < 2) errors.message = 'Please write a few words.';
  else if (message.length > CONTACT_LIMITS.message)
    errors.message = `Please keep it under ${CONTACT_LIMITS.message} characters.`;
  return errors;
}
