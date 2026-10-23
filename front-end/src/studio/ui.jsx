import { useId, useState } from 'react';
import { change, formatChange } from './format';
import Sparkline from './charts/Sparkline';
import styles from '../stylesheets/studio/Studio.module.css';

/** A dashboard panel. `table` (when given) adds a Chart / Table switch, the accessible twin of the chart. */
export function Card({ title, subtitle, actions, table, span = 'half', customize, children }) {
  const [asTable, setAsTable] = useState(false);
  const headingId = useId();
  return (
    <section className={`${styles.card} ${styles[span]}`} aria-labelledby={headingId}>
      <header className={styles.cardHeader}>
        <div>
          <h2 id={headingId} className={styles.cardTitle}>
            {title}
          </h2>
          {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
        </div>
        <div className={styles.cardActions}>
          {actions}
          {table && (
            <button
              type="button"
              className={styles.ghostSmall}
              aria-pressed={asTable}
              onClick={() => setAsTable((value) => !value)}
            >
              {asTable ? 'Chart' : 'Table'}
            </button>
          )}
          {customize}
        </div>
      </header>
      {asTable && table ? <div className={styles.tableScroll}>{table()}</div> : children}
    </section>
  );
}

export function Tabs({ tabs, value, onChange, label }) {
  return (
    <div className={styles.segmented} role="group" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          aria-pressed={value === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/** Label, value, change against the previous period (with an arrow, never color alone), trend. */
export function StatTile({
  label,
  value,
  current,
  previous,
  format,
  lowerIsBetter = false,
  trend,
  selected,
  onSelect,
  compare,
}) {
  const delta = change(current, previous);
  const good = delta === null || delta === 0 ? null : delta > 0 !== lowerIsBetter;
  const body = (
    <>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{format(value)}</span>
      {compare && (
        <span className={`${styles.delta} ${good === null ? '' : good ? styles.up : styles.down}`}>
          <span aria-hidden="true">
            {delta === null ? '•' : delta > 0 ? '▲' : delta < 0 ? '▼' : '•'}
          </span>{' '}
          {formatChange(delta)} <span className={styles.vs}>vs previous</span>
        </span>
      )}
      {trend && <Sparkline values={trend} />}
    </>
  );
  return onSelect ? (
    <button
      type="button"
      className={`${styles.stat} ${styles.statButton}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      {body}
    </button>
  ) : (
    <div className={styles.stat}>{body}</div>
  );
}

export function DataTable({ columns, rows, caption }) {
  return (
    <table className={styles.dataTable}>
      <caption className="visually-hidden">{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              className={column.numeric ? styles.numeric : undefined}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map((column) => (
              <td key={column.key} className={column.numeric ? styles.numeric : undefined}>
                {column.format ? column.format(row[column.key], row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
