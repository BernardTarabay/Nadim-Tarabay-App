import Picture from '@/reusable-components/Picture';
import styles from '../stylesheets/PageHero.module.css';

export default function PageHero({ title, image, overlay = 0.7, children }) {
  return (
    <header className={styles.hero} style={{ '--hero-overlay': overlay }}>
      <Picture {...image} priority className={styles.image} />
      <div className={`l-container ${styles.content}`}>
        {children}
        <h1 className={styles.title}>{title}</h1>
      </div>
    </header>
  );
}
