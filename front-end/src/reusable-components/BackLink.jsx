import { Link } from 'react-router-dom';
import SlideArrow from './SlideArrow';
import styles from '../stylesheets/BackLink.module.css';

export default function BackLink({ to, label }) {
  return (
    <Link to={to} className={styles.link} aria-label={label} data-arrow-host>
      <SlideArrow direction="left" />
    </Link>
  );
}
