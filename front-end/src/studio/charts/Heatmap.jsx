import { useState } from 'react';
import { formatCount } from '../format';
import Tooltip from './Tooltip';
import { useWidth } from './useWidth';
import styles from '../../stylesheets/studio/Charts.module.css';

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STEPS = 7;
const LEFT = 36;
const TOP = 18;
const GAP = 2;

/** Visits by weekday and hour: one hue, more is darker (lighter on the dark theme). */
export default function Heatmap({ cells }) {
  const [ref, width] = useWidth();
  const [active, setActive] = useState(null);
  const values = new Map(cells.map((cell) => [`${cell.day}-${cell.hour}`, cell.pageviews]));
  const max = Math.max(1, ...cells.map((cell) => cell.pageviews));
  const cellWidth = Math.max(6, (width - LEFT - GAP * 23) / 24);
  const cellHeight = 18;
  const height = TOP + 7 * (cellHeight + GAP);
  const stepOf = (value) => (value ? Math.min(STEPS - 1, Math.floor((value / max) * STEPS)) : null);

  return (
    <div className={styles.chart} ref={ref}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          className={styles.svg}
          aria-hidden="true"
          onPointerLeave={() => setActive(null)}
        >
          {[0, 6, 12, 18, 23].map((hour) => (
            <text
              key={hour}
              x={LEFT + hour * (cellWidth + GAP) + cellWidth / 2}
              y={11}
              className={styles.xTick}
            >
              {String(hour).padStart(2, '0')}h
            </text>
          ))}
          {DAYS.map((day, d) => (
            <g key={day} transform={`translate(0,${TOP + d * (cellHeight + GAP)})`}>
              <text x={LEFT - 8} y={cellHeight / 2} dy="0.32em" className={styles.yTick}>
                {day}
              </text>
              {Array.from({ length: 24 }, (_, hour) => {
                const value = values.get(`${d + 1}-${hour}`) ?? 0;
                const step = stepOf(value);
                return (
                  <rect
                    key={hour}
                    x={LEFT + hour * (cellWidth + GAP)}
                    width={cellWidth}
                    height={cellHeight}
                    rx={2}
                    style={{ fill: step === null ? 'var(--empty)' : `var(--seq-${step})` }}
                    className={
                      active?.day === d && active?.hour === hour ? styles.cellActive : undefined
                    }
                    onPointerEnter={() => setActive({ day: d, hour, value })}
                  />
                );
              })}
            </g>
          ))}
        </svg>
      )}
      {active && (
        <Tooltip
          x={LEFT + active.hour * (cellWidth + GAP) + cellWidth / 2}
          y={TOP + active.day * (cellHeight + GAP) + cellHeight / 2}
          width={width}
          title={`${DAYS[active.day]} ${String(active.hour).padStart(2, '0')}:00–${String(active.hour + 1).padStart(2, '0')}:00`}
          rows={[{ name: 'pageviews', value: formatCount(active.value) }]}
        />
      )}
      <div className={styles.scale} aria-hidden="true">
        <span>Fewer</span>
        {Array.from({ length: STEPS }, (_, i) => (
          <span key={i} className={styles.scaleStep} style={{ background: `var(--seq-${i})` }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
