import styles from '../stylesheets/SectionHeader.module.css';

export default function SectionHeader({ id, title, description, className = '', children }) {
  return (
    <header className={`${styles.header} ${className}`}>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </header>
  );
}
