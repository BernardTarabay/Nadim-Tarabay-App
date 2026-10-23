import { line } from 'd3-shape';
import styles from '../../stylesheets/studio/Charts.module.css';

const WIDTH = 96;
const HEIGHT = 28;

/** The trend behind a stat tile: context in gray, the latest step in the accent. */
export default function Sparkline({ values }) {
  if (values.length < 2) return null;
  const max = Math.max(1, ...values);
  const x = (i) => 2 + (i / (values.length - 1)) * (WIDTH - 6);
  const y = (v) => HEIGHT - 3 - (v / max) * (HEIGHT - 6);
  const draw = line()
    .x((_, i) => x(i))
    .y((v) => y(v));
  const last = values.length - 1;
  return (
    <svg width={WIDTH} height={HEIGHT} className={styles.sparkline} aria-hidden="true">
      <path d={draw(values)} className={styles.sparkContext} />
      <path
        d={draw(values.slice(-2)) ?? ''}
        transform={`translate(${x(last - 1) - x(0)},0)`}
        className={styles.sparkAccent}
      />
      <circle cx={x(last)} cy={y(values[last])} r={3} className={styles.sparkDot} />
    </svg>
  );
}
