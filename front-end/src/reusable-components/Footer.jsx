import { Link } from 'react-router-dom';
import Icon from '@/reusable-components/Icon';
import { FOOTER, SITE, SOCIAL } from '@/config/site';
import styles from '../stylesheets/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <div className={styles.profile}>
          <div className={styles.identity}>
            <p className={styles.title}>{SITE.name}</p>
            <p className={styles.quote}>{FOOTER.tagline}</p>
          </div>
          <div className={styles.group}>
            <h2 className={styles.label}>Social Media</h2>
            <ul className={styles.social}>
              {SOCIAL.map(({ id, label, href }) => (
                <li key={id}>
                  {href ? (
                    <a
                      href={href}
                      className={styles.chip}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                    >
                      <Icon name={id} />
                    </a>
                  ) : (
                    <span className={styles.chip} title={`${label} (link coming soon)`}>
                      <Icon name={id} label={label} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav className={`${styles.group} ${styles.pages}`} aria-label="Footer">
          <h2 className={styles.label}>Pages</h2>
          <ul className={styles.pageLinks} style={{ '--rows': Math.ceil(FOOTER.pages.length / 2) }}>
            {FOOTER.pages.map((page) => (
              <li key={page.to}>
                <Link to={page.to} className={styles.pageLink} viewTransition>
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className={styles.copyright}>
        {FOOTER.copyrightPrefix} <strong>{SITE.name}</strong>
      </p>
    </footer>
  );
}
