import ContactButton from '@/reusable-components/ContactButton';
import { CREDITS } from '@/data/credits';
import { HOME_SECTIONS } from '@/data/home';
import { reveal } from '@/utils/reveal';
import styles from '../../../stylesheets/RecentCredits.module.css';

const COLUMNS = [
  { key: 'role', label: 'Role', mobileLabel: 'Role' },
  { key: 'date', label: 'Date', mobileLabel: 'Year' },
  { key: 'venue', label: 'Client / Venue', mobileLabel: 'Client / Venue' },
];

export default function RecentCredits() {
  return (
    <section className={styles.section} aria-labelledby="credits-title">
      <h2 ref={reveal} id="credits-title" className={styles.title}>
        {HOME_SECTIONS.credits.title}
      </h2>
      <table ref={reveal} className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Project</th>
            {COLUMNS.map((column) => (
              <th key={column.key} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CREDITS.map((credit) => (
            <tr key={`${credit.project}-${credit.date}`}>
              <th scope="row">
                {credit.project}
                {credit.upcoming && ' upcoming'}
              </th>
              {COLUMNS.map((column) => (
                <td key={column.key} data-label={column.mobileLabel}>
                  {credit[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ContactButton variant="dark" className={styles.cta} />
    </section>
  );
}
