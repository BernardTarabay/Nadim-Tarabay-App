import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import ContactButton from '@/reusable-components/ContactButton';
import Icon from '@/reusable-components/Icon';
import styles from '../stylesheets/Header.module.css';

export default function MobileMenu({ id, items, open, onClose }) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(null);
  const [wasOpen, setWasOpen] = useState(open);

  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) setExpanded(null);
  }

  return (
    <div id={id} className={styles.mobileMenu} hidden={!open}>
      <nav aria-label="Main" className={styles.mobileNav}>
        {items.map((item) =>
          item.children ? (
            <section key={item.label} className={styles.mobileGroup}>
              <button
                type="button"
                className={styles.mobileToggle}
                aria-expanded={expanded === item.label}
                aria-controls={`${panelId}-${item.label}`}
                onClick={() =>
                  setExpanded((current) => (current === item.label ? null : item.label))
                }
              >
                {item.label}
                <Icon name="chevron-down" className={styles.chevron} />
              </button>
              <ul
                id={`${panelId}-${item.label}`}
                className={styles.mobileLinks}
                hidden={expanded !== item.label}
              >
                {item.to && (
                  <li>
                    <Link to={item.to} className={styles.mobileLink} viewTransition>
                      All {item.label}
                    </Link>
                  </li>
                )}
                {item.children.map((child) => (
                  <li key={child.label}>
                    <Link to={child.to} className={styles.mobileLink} viewTransition>
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <Link
              key={item.label}
              to={item.to}
              className={`${styles.mobileLink} ${styles.mobileTopLink}`}
              viewTransition
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>
      <ContactButton block font="sans" onNavigate={onClose} />
    </div>
  );
}
