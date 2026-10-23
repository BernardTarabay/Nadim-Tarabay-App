import { useState } from 'react';
import { formatCount } from '../format';
import styles from '../../stylesheets/studio/Charts.module.css';

/**
 * A ranked list that is also its own table: name, a thin bar for the main measure, and the
 * numbers. Rows with `onSelect` become filters. One measure, so every bar wears the same hue.
 */
export default function BarList({
  rows,
  columns,
  limit = 8,
  empty = 'No data for this range.',
  caption,
}) {
  const [all, setAll] = useState(false);
  if (rows.length === 0) return <p className={styles.empty}>{empty}</p>;
  const max = Math.max(1, ...rows.map((row) => row.value));
  const shown = all ? rows : rows.slice(0, limit);

  return (
    <div>
      <table className={styles.barList}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{columns[0]}</th>
            {columns.slice(1).map((column) => (
              <th key={column} scope="col" className={styles.number}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shown.map((row) => (
            <tr key={row.key}>
              <th scope="row" className={styles.barCell}>
                <span className={styles.barLabel}>
                  {row.prefix && <span aria-hidden="true">{row.prefix}</span>}
                  {row.onSelect ? (
                    <button
                      type="button"
                      className={styles.filterButton}
                      onClick={row.onSelect}
                      title={`Filter by ${row.label}`}
                    >
                      {row.label}
                    </button>
                  ) : (
                    <span>{row.label}</span>
                  )}
                  {row.hint && <span className={styles.hint}>{row.hint}</span>}
                </span>
                <span
                  className={styles.bar}
                  style={{ width: `${(row.value / max) * 100}%` }}
                  aria-hidden="true"
                />
              </th>
              <td className={styles.number}>{formatCount(row.value)}</td>
              {(row.extra ?? []).map((value, i) => (
                <td key={columns[i + 2]} className={`${styles.number} ${styles.muted}`}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > limit && (
        <button type="button" className={styles.more} onClick={() => setAll((value) => !value)}>
          {all ? 'Show fewer' : `Show all ${rows.length}`}
        </button>
      )}
    </div>
  );
}
