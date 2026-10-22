import styles from '../stylesheets/Prose.module.css';

export default function Prose({ paragraphs, className = '', children }) {
  return (
    <div className={`${styles.prose} ${className}`}>
      {paragraphs.map((text) => (
        <p key={text.slice(0, 40)}>{text}</p>
      ))}
      {children}
    </div>
  );
}
