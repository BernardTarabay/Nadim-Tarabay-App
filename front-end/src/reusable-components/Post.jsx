import BackLink from '@/reusable-components/BackLink';
import Prose from '@/reusable-components/Prose';
import styles from '../stylesheets/Post.module.css';

function Gallery({ images, className }) {
  return (
    <div className={`${styles.gallery} ${className}`} data-count={images.length}>
      {images.map((image) => (
        <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
      ))}
    </div>
  );
}

function Section({ section }) {
  const inner = (
    <section className={`l-container ${styles[section.type]}`}>
      <div className={styles.sectionText}>
        <h2 className={styles.sectionTitle}>{section.title}</h2>
        <Prose paragraphs={section.paragraphs} />
      </div>
      <Gallery images={section.images} className={styles.sectionGallery} />
    </section>
  );
  return section.band ? <div className={styles.band}>{inner}</div> : inner;
}

export default function Post({ title, back, meta, lead, sections = [], children }) {
  return (
    <article className={styles.post}>
      <header className={`l-container ${styles.lead}`}>
        <BackLink to={back.to} label={back.label} />
        <h1 className={styles.title}>{title}</h1>
        {meta && <p className={styles.meta}>{meta}</p>}
        <div className={styles.leadMedia}>
          <Gallery images={lead.images} className={styles.leadGallery} />
          <Prose paragraphs={lead.paragraphs} />
        </div>
        {children}
      </header>
      {sections.map((section) => (
        <Section key={section.title} section={section} />
      ))}
    </article>
  );
}
