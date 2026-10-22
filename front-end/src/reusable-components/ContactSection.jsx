import { useId } from 'react';
import Button from '@/reusable-components/Button';
import Icon from '@/reusable-components/Icon';
import { CONTACT_LIMITS } from '@shared/contact';
import { CONTACT, CONTACT_ANCHOR } from '@/config/site';
import backgroundImage from '@/pictures/images/contact-bg.webp';
import { useContactForm } from './useContactForm';
import styles from '../stylesheets/ContactSection.module.css';

function Field({ name, label, error, wide = false, select = false, children }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={`${styles.field} ${wide ? styles.wide : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={select ? styles.select : styles.control}>
        {children({
          id,
          name,
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? errorId : undefined,
        })}
        {select && <Icon name="chevron-down-lg" className={styles.selectIcon} />}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactSection() {
  const { values, errors, touched, status, serverError, onChange, onBlur, onSubmit } =
    useContactForm();
  const show = (name) => (touched[name] ? errors[name] : undefined);
  const bind = { onChange, onBlur };

  return (
    <section
      id={CONTACT_ANCHOR}
      tabIndex={-1}
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <img
        className={styles.backdrop}
        src={backgroundImage}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className={styles.panel}>
        <header className={styles.intro}>
          <p className={styles.prompt}>Leave your details</p>
          <h2 id="contact-title" className={styles.title}>
            Contact us
          </h2>
          <p className={styles.email}>
            Or just write: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </p>
        </header>

        <form className={styles.form} noValidate onSubmit={onSubmit}>
          <div className={styles.grid}>
            <Field name="name" label="Name" error={show('name')}>
              {(p) => (
                <input
                  {...p}
                  {...bind}
                  value={values.name}
                  type="text"
                  autoComplete="name"
                  maxLength={CONTACT_LIMITS.name}
                  placeholder="Your full name"
                />
              )}
            </Field>
            <Field name="email" label="Email" error={show('email')}>
              {(p) => (
                <input
                  {...p}
                  {...bind}
                  value={values.email}
                  type="email"
                  autoComplete="email"
                  maxLength={CONTACT_LIMITS.email}
                  placeholder="name@company.com"
                />
              )}
            </Field>
            <Field name="phone" label="Phone" error={show('phone')}>
              {(p) => (
                <input
                  {...p}
                  {...bind}
                  value={values.phone}
                  type="tel"
                  autoComplete="tel"
                  maxLength={CONTACT_LIMITS.phone}
                  placeholder={CONTACT.phonePrefix}
                />
              )}
            </Field>
            <Field name="reason" label="Reason" error={show('reason')} select>
              {(p) => (
                <select {...p} {...bind} value={values.reason}>
                  {CONTACT.reasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field name="message" label="Message" error={show('message')} wide>
              {(p) => (
                <textarea
                  {...p}
                  {...bind}
                  value={values.message}
                  rows={1}
                  maxLength={CONTACT_LIMITS.message}
                  placeholder="A few words"
                />
              )}
            </Field>
          </div>

          <div className={styles.trap} aria-hidden="true">
            <input
              name="website"
              value={values.website}
              onChange={onChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className={styles.footer}>
            <Button
              type="submit"
              className={styles.submit}
              disabled={status === 'submitting'}
              aria-disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending…' : 'Send Details'}
            </Button>
            <p className={styles.note} role="status" aria-live="polite">
              {status === 'success' && (
                <span className={styles.success}>Thank you. Your details were sent.</span>
              )}
              {status === 'error' && <span className={styles.failure}>{serverError}</span>}
              {(status === 'idle' || status === 'submitting') &&
                'Sent details land in my inbox and nowhere else'}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
