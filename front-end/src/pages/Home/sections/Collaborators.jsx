import Marquee from '@/reusable-components/Marquee';
import SectionHeader from '@/reusable-components/SectionHeader';
import { COLLABORATORS } from '@/data/collaborators';
import { HOME_SECTIONS } from '@/data/home';
import { reveal } from '@/utils/reveal';
import styles from '../../../stylesheets/Collaborators.module.css';

function LogoCard({ collaborator, hidden }) {
  const { name, logo, width, height, url } = collaborator;
  const image = (
    <img src={logo} alt={hidden ? '' : name} width={width} height={height} loading="lazy" />
  );
  return url ? (
    <a
      href={url}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={hidden ? -1 : undefined}
    >
      {image}
    </a>
  ) : (
    <span className={styles.card}>{image}</span>
  );
}

export default function Collaborators() {
  const { title, description } = HOME_SECTIONS.collaborators;
  return (
    <section className={styles.section} aria-labelledby="collaborators-title">
      <SectionHeader id="collaborators-title" title={title} description={description} />
      <div ref={reveal} className={styles.rail}>
        <Marquee
          items={COLLABORATORS}
          getKey={(c) => c.id}
          label={title}
          duration={70}
          renderItem={(collaborator, hidden) => (
            <LogoCard collaborator={collaborator} hidden={hidden} />
          )}
        />
      </div>
    </section>
  );
}
