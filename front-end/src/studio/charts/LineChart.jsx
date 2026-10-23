import { useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { area, curveMonotoneX, line } from 'd3-shape';
import { formatAxis } from '../format';
import Tooltip from './Tooltip';
import { useWidth } from './useWidth';
import styles from '../../stylesheets/studio/Charts.module.css';

const MARGIN = { top: 12, right: 16, bottom: 28, left: 44 };

/**
 * Lines over time on one axis. The first series is the subject (accent hue + area wash); any
 * others are context. `labels` are the x positions; `series[i].labels` can override them for the
 * tooltip (the previous period's own dates).
 */
export default function LineChart({
  series,
  labels,
  formatLabel,
  formatLongLabel,
  formatValue,
  height = 260,
  title,
}) {
  const [ref, width] = useWidth();
  const [active, setActive] = useState(null);
  const count = labels.length;
  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const max = Math.max(1, ...series.flatMap((s) => s.values.slice(0, count)));
  const y = scaleLinear().domain([0, max]).nice(4).range([innerHeight, 0]);
  const x = (i) => (count <= 1 ? innerWidth / 2 : (i / (count - 1)) * innerWidth);
  const drawLine = line()
    .x((_, i) => x(i))
    .y((v) => y(v))
    .curve(curveMonotoneX);
  const drawArea = area()
    .x((_, i) => x(i))
    .y0(innerHeight)
    .y1((v) => y(v))
    .curve(curveMonotoneX);
  const step = Math.max(1, Math.ceil(count / Math.max(2, Math.floor(innerWidth / 90))));

  const indexAt = (clientX, rect) => {
    const position = clientX - rect.left - MARGIN.left;
    return Math.max(0, Math.min(count - 1, Math.round((position / innerWidth) * (count - 1))));
  };

  const onKeyDown = (event) => {
    const moves = { ArrowLeft: -1, ArrowRight: 1, Home: -Infinity, End: Infinity };
    if (event.key === 'Escape') return setActive(null);
    if (!(event.key in moves)) return undefined;
    event.preventDefault();
    const from = active ?? (moves[event.key] > 0 ? -1 : count);
    return setActive(Math.max(0, Math.min(count - 1, from + moves[event.key])));
  };

  const [subject] = series;
  const last = subject.values.length - 1;

  return (
    <div className={styles.chart} ref={ref}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          className={styles.svg}
          role="img"
          aria-label={`${title}. Use the left and right arrow keys to read values.`}
          tabIndex={0}
          onPointerMove={(event) =>
            setActive(indexAt(event.clientX, event.currentTarget.getBoundingClientRect()))
          }
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
        >
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {y.ticks(4).map((tick) => (
              <g key={tick} transform={`translate(0,${y(tick)})`}>
                <line x2={innerWidth} className={tick === 0 ? styles.baseline : styles.grid} />
                <text x={-8} dy="0.32em" className={styles.yTick}>
                  {formatAxis(tick)}
                </text>
              </g>
            ))}
            {labels.map((label, i) =>
              i % step === 0 ? (
                <text key={label} x={x(i)} y={innerHeight + 18} className={styles.xTick}>
                  {formatLabel(label)}
                </text>
              ) : null,
            )}
            <path
              d={drawArea(subject.values.slice(0, count))}
              style={{ fill: subject.color }}
              className={styles.wash}
            />
            {[...series].reverse().map((s) => (
              <path
                key={s.key}
                d={drawLine(s.values.slice(0, count))}
                style={{ stroke: s.color }}
                className={styles.line}
              />
            ))}
            {active === null && last >= 0 && (
              <circle
                cx={x(last)}
                cy={y(subject.values[last])}
                r={4}
                style={{ fill: subject.color }}
                className={styles.dot}
              />
            )}
            {active !== null && (
              <g>
                <line x1={x(active)} x2={x(active)} y2={innerHeight} className={styles.crosshair} />
                {series.map((s) =>
                  s.values[active] === undefined ? null : (
                    <circle
                      key={s.key}
                      cx={x(active)}
                      cy={y(s.values[active])}
                      r={4}
                      style={{ fill: s.color }}
                      className={styles.dot}
                    />
                  ),
                )}
              </g>
            )}
          </g>
        </svg>
      )}
      {active !== null && (
        <Tooltip
          x={MARGIN.left + x(active)}
          y={MARGIN.top + y(Math.max(...series.map((s) => s.values[active] ?? 0)))}
          width={width}
          title={formatLongLabel(labels[active])}
          rows={series
            .filter((s) => s.values[active] !== undefined)
            .map((s) => ({
              name: s.labels ? `${s.name}, ${formatLongLabel(s.labels[active])}` : s.name,
              value: formatValue(s.values[active]),
              color: s.color,
            }))}
        />
      )}
    </div>
  );
}
