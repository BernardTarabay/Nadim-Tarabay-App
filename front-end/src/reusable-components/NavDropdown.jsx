import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../stylesheets/Header.module.css';

export default function NavDropdown({ id, item, open, focusFirst, onFocused }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open || !focusFirst) return;
    ref.current?.querySelector('a')?.focus();
    onFocused();
  }, [open, focusFirst, onFocused]);

  return (
    <div
      id={id}
      ref={ref}
      className={`${styles.dropdown} ${open ? styles.dropdownOpen : ''}`}
      hidden={!open}
    >
      <ul className={styles.dropdownLinks}>
        {item.to && (
          <li>
            <Link to={item.to} className={styles.dropdownLink}>
              All {item.label}
            </Link>
          </li>
        )}
        {item.children.map((child) => (
          <li key={child.label}>
            <Link to={child.to} className={styles.dropdownLink}>
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
