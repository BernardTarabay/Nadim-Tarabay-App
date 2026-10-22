import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../stylesheets/Header.module.css';

export default function MegaMenu({ id, items, open, focusColumn, onFocused }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open || focusColumn === null) return;
    ref.current?.querySelector(`[data-column="${focusColumn}"] a`)?.focus();
    onFocused();
  }, [open, focusColumn, onFocused]);

  return (
    <div
      id={id}
      ref={ref}
      className={`${styles.mega} ${open ? styles.megaOpen : ''}`}
      hidden={!open}
    >
      <div className={styles.megaGrid}>
        {items.map((item, index) =>
          item.children ? (
            <div key={item.label} className={styles.megaColumn} data-column={index}>
              {item.to ? (
                <Link to={item.to} className={styles.megaHeading}>
                  {item.label}
                </Link>
              ) : (
                <p className={styles.megaHeading}>{item.label}</p>
              )}
              <ul className={styles.megaLinks}>
                {item.children.map((child) => (
                  <li key={child.label}>
                    <Link to={child.to} className={styles.megaLink}>
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
