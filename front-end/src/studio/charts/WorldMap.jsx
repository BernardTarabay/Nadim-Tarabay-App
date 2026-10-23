import { useMemo, useState } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import codes from '../world/countryCodes.json';
import { countryName, formatCount } from '../format';
import Tooltip from './Tooltip';
import { useWidth } from './useWidth';
import styles from '../../stylesheets/studio/Charts.module.css';

const ANTARCTICA = '010';
const COUNTRIES = feature(world, world.objects.countries).features.filter(
  (f) => f.id !== ANTARCTICA,
);
const COLLECTION = { type: 'FeatureCollection', features: COUNTRIES };
const STEPS = 7;

/**
 * Countries shaded by visitors (one hue; a square-root scale so smaller audiences still show),
 * or cities as dots sized by visitors.
 */
export default function WorldMap({ countries, cities, mode, onSelectCountry }) {
  const [ref, width] = useWidth();
  const [active, setActive] = useState(null);
  const height = Math.round(width * 0.48);

  const { path, projection } = useMemo(() => {
    const projected = geoNaturalEarth1().fitSize([width, height], COLLECTION);
    return { projection: projected, path: geoPath(projected) };
  }, [width, height]);

  const byCode = new Map(countries.map((row) => [row.value, row.visitors]));
  const max = Math.max(1, ...countries.map((row) => row.visitors));
  const cityMax = Math.max(1, ...cities.map((row) => row.visitors));
  const stepOf = (value) => Math.min(STEPS - 1, Math.floor(Math.sqrt(value / max) * STEPS));

  return (
    <div className={styles.chart} ref={ref} onPointerLeave={() => setActive(null)}>
      {width > 0 && (
        <svg width={width} height={height} className={styles.svg} aria-hidden="true">
          {COUNTRIES.map((country) => {
            const code = codes[country.id];
            const visitors = byCode.get(code) ?? 0;
            const shaded = mode === 'countries' && visitors > 0;
            return (
              <path
                key={country.id}
                d={path(country) ?? ''}
                className={`${styles.country} ${shaded && onSelectCountry ? styles.clickable : ''}`}
                style={{ fill: shaded ? `var(--seq-${stepOf(visitors)})` : 'var(--empty)' }}
                onPointerMove={(event) => {
                  if (mode !== 'countries') return;
                  const box = event.currentTarget.ownerSVGElement.getBoundingClientRect();
                  setActive({
                    x: event.clientX - box.left,
                    y: event.clientY - box.top,
                    title: countryName(code ?? ''),
                    value: visitors,
                  });
                }}
                onClick={() => shaded && onSelectCountry?.(code)}
              />
            );
          })}
          {mode === 'cities' &&
            cities.map((city) => {
              const point = projection([city.longitude, city.latitude]);
              if (!point || city.latitude === null) return null;
              const r = 4 + Math.sqrt(city.visitors / cityMax) * 10;
              return (
                <circle
                  key={`${city.country}-${city.value}`}
                  cx={point[0]}
                  cy={point[1]}
                  r={r}
                  className={styles.cityDot}
                  onPointerEnter={() =>
                    setActive({
                      x: point[0],
                      y: point[1],
                      title: `${city.value}, ${countryName(city.country)}`,
                      value: city.visitors,
                    })
                  }
                />
              );
            })}
        </svg>
      )}
      {active && (
        <Tooltip
          x={active.x}
          y={active.y}
          width={width}
          title={active.title}
          rows={[{ name: 'visitors', value: formatCount(active.value) }]}
        />
      )}
      {mode === 'countries' && (
        <div className={styles.scale} aria-hidden="true">
          <span>Fewer visitors</span>
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} className={styles.scaleStep} style={{ background: `var(--seq-${i})` }} />
          ))}
          <span>More</span>
        </div>
      )}
    </div>
  );
}
