import styles from '../../stylesheets/studio/Charts.module.css';

/** Floats beside a point inside a `position: relative` chart, flipping left near the right edge. */
export default function Tooltip({ x, y, width, title, rows }) {
  const flip = x > width - 180;
  return (
    <div
      className={styles.tooltip}
      style={{ left: x, top: y, translate: flip ? 'calc(-100% - 12px) -50%' : '12px -50%' }}
      role="presentation"
    >
      {title && <p className={styles.tooltipTitle}>{title}</p>}
      {rows.map((row) => (
        <p key={row.name} className={styles.tooltipRow}>
          {row.color && <span className={styles.lineKey} style={{ background: row.color }} />}
          <strong>{row.value}</strong>
          <span>{row.name}</span>
        </p>
      ))}
    </div>
  );
}
