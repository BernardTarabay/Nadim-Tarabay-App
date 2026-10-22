import { Link } from 'react-router-dom';
import ContactButton from '@/reusable-components/ContactButton';
import styles from '../stylesheets/Header.module.css';

export default function MobileMenu({ id, items, open, onClose }) {
  return (
    <div id={id} className={styles.mobileMenu} hidden={!open}>
      <nav aria-label="Main" className={styles.mobileNav}>
        {items.map((item) =>
          item.children ? (
            <section key={item.label} className={styles.mobileGroup}>
              <h2 className={styles.mobileLabel}>
                {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
              </h2>
              <ul className={styles.mobileLinks}>
                {item.children.map((child) => (
                  <li key={child.label}>
                    <Link to={child.to} className={styles.mobileLink}>
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
