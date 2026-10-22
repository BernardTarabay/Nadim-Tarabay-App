import { useEffect, useState } from 'react';
import { validateContact } from '@shared/contact';
import { submitContact } from '@/api/contact';
import { ApiError } from '@/api/http';
import { CONTACT } from '@/config/site';

const PREFILL_EVENT = 'contact:prefill';
let pendingPrefill = null;

/**
 * Fills in contact form fields from elsewhere on the site (e.g. a score's "Request access" button).
 * Kept until a form picks it up, in case the form mounts after the call.
 */
export function prefillContact(fields) {
  pendingPrefill = fields;
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: fields }));
}

const emptyForm = () => ({
  name: '',
  email: '',
  phone: '',
  reason: CONTACT.reasons[0],
  message: '',
  website: '',
});

export function useContactForm() {
  const [values, setValues] = useState(() => ({ ...emptyForm(), ...pendingPrefill }));

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    pendingPrefill = null;
    const onPrefill = ({ detail }) => {
      pendingPrefill = null;
      setValues((current) => ({ ...current, ...detail }));
      setStatus('idle');
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const onChange = ({ target }) => {
    const next = { ...values, [target.name]: target.value };
    setValues(next);
    if (touched[target.name]) setErrors(validateContact(next));
    if (status !== 'submitting') setStatus('idle');
  };

  const onBlur = ({ target }) => {
    setTouched((t) => ({ ...t, [target.name]: true }));
    setErrors(validateContact(values));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setTouched({ name: true, email: true, phone: true, reason: true, message: true });
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      event.currentTarget.elements.namedItem(firstInvalid)?.focus();
      return;
    }
    setStatus('submitting');
    setServerError('');
    try {
      await submitContact({ ...values, name: values.name.trim(), email: values.email.trim() });
      setStatus('success');
      setValues(emptyForm());
      setTouched({});
    } catch (error) {
      if (error instanceof ApiError) setErrors(error.fields);
      setServerError(error instanceof Error ? error.message : 'Something went wrong.');
      setStatus('error');
    }
  };

  return { values, errors, touched, status, serverError, onChange, onBlur, onSubmit };
}
