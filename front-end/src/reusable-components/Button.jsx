import { Link } from 'react-router-dom';
import styles from '../stylesheets/Button.module.css';

export default function Button({
  variant = 'light',
  font = 'display',
  block = false,
  to,
  href,
  className,
  children,
  ...rest
}) {
  const cls = [styles.button, styles[variant], styles[font], block && styles.block, className]
    .filter(Boolean)
    .join(' ');
  if (to) {
    return (
      <Link to={to} className={cls} viewTransition {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
