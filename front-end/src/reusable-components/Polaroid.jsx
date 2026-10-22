import Picture from './Picture';
import styles from '../stylesheets/Polaroid.module.css';

export default function Polaroid({ src, alt, className = '' }) {
  return (
    <figure className={`${styles.polaroid} ${className}`}>
      <Picture src={src} alt={alt} className={styles.image} />
    </figure>
  );
}
