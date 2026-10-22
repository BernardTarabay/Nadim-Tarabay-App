import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Icon from '@/reusable-components/Icon';
import ContactButton from '@/reusable-components/ContactButton';
import { useModal } from '@/hooks/useModal';
import { NAV, PATHS, SITE } from '@/config/site';
import NavDropdown from './NavDropdown';
import MobileMenu from './MobileMenu';
import styles from '../stylesheets/Header.module.css';

const isCurrent = (item, pathname) =>
  (item.match ?? []).some((prefix) => pathname.startsWith(prefix));

export default function Header() {
  const location = useLocation();
  const { pathname } = location;
  const headerRef = useRef(null);
  const menuId = useId();
  const mobileId = useId();
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [focusColumn, setFocusColumn] = useState(null);

  const [locationKey, setLocationKey] = useState(location.key);
  const clearFocus = useCallback(() => setFocusColumn(null), []);

  const closeAll = useCallback(() => {
    setOpenIndex(null);
    setMobileOpen(false);
  }, []);

  if (locationKey !== location.key) {
    setLocationKey(location.key);
    closeAll();
  }

  useEffect(() => {
    if (openIndex === null) return undefined;
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      const trigger = headerRef.current?.querySelector(`[data-nav-index="${openIndex}"]`);
      setOpenIndex(null);
      trigger?.focus();
    };
    const onPointer = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpenIndex(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [openIndex]);

  useModal(headerRef, mobileOpen, () => setMobileOpen(false));

  const onTriggerKeyDown = (event, index) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpenIndex(index);
      setFocusColumn(index);
    }
  };

  const onTriggerClick = (event, index) => {
    const viaKeyboard = event.detail === 0;
    if (event.nativeEvent.pointerType === 'mouse') setOpenIndex(index);
    else setOpenIndex((current) => (current === index ? null : index));
    setFocusColumn(viaKeyboard ? index : null);
  };

  return (
    <header
      ref={headerRef}
      className={styles.header}
      onPointerLeave={(event) => event.pointerType === 'mouse' && setOpenIndex(null)}
    >
      <div className={styles.bar}>
        <Link to={PATHS.home} className={styles.brand}>
          {SITE.name}
        </Link>

        <nav className={styles.desktopNav} aria-label="Main">
          <ul className={styles.links}>
            {NAV.map((item, index) => {
              const current = isCurrent(item, pathname);
              const highlighted = current || openIndex === index;
              if (!item.children) {
                return (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      className={`${styles.link} ${highlighted ? styles.active : ''}`}
                      onPointerEnter={(event) =>
                        event.pointerType === 'mouse' && setOpenIndex(null)
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                );
              }
              return (
                <li key={item.label} className={styles.item}>
                  <button
                    type="button"
                    data-nav-index={index}
                    className={`${styles.link} ${highlighted ? styles.active : ''}`}
                    aria-expanded={openIndex === index}
                    aria-controls={`${menuId}-${index}`}
                    aria-current={current ? 'true' : undefined}
                    onPointerEnter={(event) => event.pointerType === 'mouse' && setOpenIndex(index)}
                    onClick={(event) => onTriggerClick(event, index)}
                    onKeyDown={(event) => onTriggerKeyDown(event, index)}
                  >
                    {item.label}
                    <Icon name="chevron-down" className={styles.chevron} />
                  </button>
                  <NavDropdown
                    id={`${menuId}-${index}`}
                    item={item}
                    open={openIndex === index}
                    focusFirst={focusColumn === index}
                    onFocused={clearFocus}
                  />
                </li>
              );
            })}
          </ul>
          <ContactButton onNavigate={closeAll} />
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={mobileOpen}
          aria-controls={mobileId}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} />
        </button>
      </div>

      <MobileMenu
        id={mobileId}
        items={NAV}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
