import { formatCount, formatPercent } from '../format';
import styles from '../../stylesheets/studio/Charts.module.css';

/** Part-to-whole for a handful of groups: one bar split by share, with a legend that labels every part. */
export default function SplitBar({ items, label }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  if (!total) return null;
  return (
    <figure className={styles.split}>
      <div
        className={styles.splitBar}
        role="img"
        aria-label={`${label}: ${items.map((item) => `${item.label} ${formatPercent(item.value / total)}`).join(', ')}`}
      >
        {items.map((item) => (
          <span
            key={item.key}
            className={styles.splitPart}
            style={{ flexGrow: item.value, background: item.color }}
            title={`${item.label}: ${formatPercent(item.value / total)}`}
          />
        ))}
      </div>
      <ul className={styles.legend}>
        {items.map((item) => (
          <li key={item.key}>
            <span className={styles.swatch} style={{ background: item.color }} aria-hidden="true" />
            {item.onSelect ? (
              <button type="button" className={styles.filterButton} onClick={item.onSelect}>
                {item.label}
              </button>
            ) : (
              <span>{item.label}</span>
            )}
            <strong>{formatPercent(item.value / total)}</strong>
            <span className={styles.muted}>{formatCount(item.value)}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
