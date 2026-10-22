import styles from '../stylesheets/Marquee.module.css';

export default function Marquee({ items, renderItem, getKey, label, duration = 60 }) {
  return (
    <div className={styles.viewport} style={{ '--marquee-duration': `${duration}s` }}>
      <div className={styles.track}>
        <ul className={styles.list} aria-label={label}>
          {items.map((item) => (
            <li key={getKey(item)}>{renderItem(item, false)}</li>
          ))}
        </ul>
        <ul className={`${styles.list} ${styles.copy}`} aria-hidden="true">
          {items.map((item) => (
            <li key={getKey(item)}>{renderItem(item, true)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
