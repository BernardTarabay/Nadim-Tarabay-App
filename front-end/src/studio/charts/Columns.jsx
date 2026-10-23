import { useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { formatAxis, formatCount } from '../format';
import Tooltip from './Tooltip';
import { useWidth } from './useWidth';
import styles from '../../stylesheets/studio/Charts.module.css';

const MARGIN = { top: 8, right: 8, bottom: 22, left: 36 };

/** Thin columns from one baseline, each its own hover target (one series, one hue). */
export default function Columns({ items, height = 160, valueName, formatLabel }) {
  const [ref, width] = useWidth();
  const [active, setActive] = useState(null);
  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = height - MARGIN.top - MARGIN.bottom;
  const max = Math.max(1, ...items.map((item) => item.value));
  const y = scaleLinear().domain([0, max]).nice(3).range([innerHeight, 0]);
  const slot = items.length ? innerWidth / items.length : 0;
  const barWidth = Math.min(24, Math.max(2, slot - 2));
  const step = Math.max(1, Math.ceil(items.length / Math.max(2, Math.floor(innerWidth / 70))));

  return (
    <div className={styles.chart} ref={ref} onPointerLeave={() => setActive(null)}>
      {width > 0 && (
        <svg width={width} height={height} className={styles.svg} aria-hidden="true">
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {y.ticks(3).map((tick) => (
              <g key={tick} transform={`translate(0,${y(tick)})`}>
                <line x2={innerWidth} className={tick === 0 ? styles.baseline : styles.grid} />
                <text x={-8} dy="0.32em" className={styles.yTick}>
                  {formatAxis(tick)}
                </text>
              </g>
            ))}
            {items.map((item, i) => {
              const x = i * slot + (slot - barWidth) / 2;
              const barHeight = innerHeight - y(item.value);
              const radius = Math.min(4, barWidth / 2, barHeight);
              return (
                <g key={item.key} onPointerEnter={() => setActive(i)}>
                  <rect x={i * slot} width={slot} height={innerHeight} className={styles.hit} />
                  {item.value > 0 && (
                    <path
                      className={`${styles.column} ${active === i ? styles.columnActive : ''}`}
                      d={`M${x},${innerHeight} V${y(item.value) + radius} q0,-${radius} ${radius},-${radius} H${x + barWidth - radius} q${radius},0 ${radius},${radius} V${innerHeight} Z`}
                    />
                  )}
                  {i % step === 0 && (
                    <text x={x + barWidth / 2} y={innerHeight + 16} className={styles.xTick}>
                      {formatLabel(item.label)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      )}
      {active !== null && items[active] && (
        <Tooltip
          x={MARGIN.left + active * slot + slot / 2}
          y={MARGIN.top + y(items[active].value)}
          width={width}
          title={formatLabel(items[active].label, true)}
          rows={[{ name: valueName, value: formatCount(items[active].value) }]}
        />
      )}
    </div>
  );
}
