import Icon from './Icon';
import styles from '../stylesheets/SlideArrow.module.css';

export default function SlideArrow({ direction = 'right' }) {
  return (
    <span className={`${styles.window} ${styles[direction]}`} aria-hidden="true">
      <span className={styles.track}>
        <Icon name="arrow-right" size={26} />
        <Icon name="arrow-right" size={26} />
      </span>
    </span>
  );
}
