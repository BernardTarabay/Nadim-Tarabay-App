import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/reusable-components/Button';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { CONTACT_ANCHOR, PATHS } from '@/config/site';
import { prefillContact } from './useContactForm';

export default function ContactButton({ onNavigate, prefill, children = 'Get in touch', ...rest }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reducedMotion = useReducedMotion();

  const handleClick = (event) => {
    event.preventDefault();
    if (prefill) prefillContact(prefill);
    onNavigate?.();
    const target = document.getElementById(CONTACT_ANCHOR);
    if (!target) {
      navigate(`${PATHS.home}#${CONTACT_ANCHOR}`, { viewTransition: true });
      return;
    }
    const go = () => {
      target.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
      target.focus({ preventScroll: true });
      window.history.replaceState(window.history.state, '', `${pathname}#${CONTACT_ANCHOR}`);
    };
    // After closing a modal, give it a moment to release its scroll lock before the smooth scroll starts.
    setTimeout(go, onNavigate ? 50 : 0);
  };

  return (
    <Button href={`#${CONTACT_ANCHOR}`} onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
}
