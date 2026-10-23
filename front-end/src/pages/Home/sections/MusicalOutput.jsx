import { useState } from 'react';
import Button from '@/reusable-components/Button';
import WorkCard from '@/reusable-components/WorkCard';
import ScoreViewer from '@/reusable-components/ScoreViewer';
import SectionHeader from '@/reusable-components/SectionHeader';
import { PATHS } from '@/config/site';
import { HOME_SECTIONS } from '@/data/home';
import { HIGHLIGHTS } from '@/data/works';
import styles from '../../../stylesheets/MusicalOutput.module.css';

export default function MusicalOutput() {
  const { title, description, cta } = HOME_SECTIONS.output;
  const [scoreWork, setScoreWork] = useState(null);

  return (
    <section className={styles.section} aria-labelledby="output-title">
      <SectionHeader id="output-title" title={title} description={description} />

      <div className={styles.grid}>
        {HIGHLIGHTS.map((work) => (
          <WorkCard key={work.id} work={work} onViewScore={setScoreWork} />
        ))}
      </div>

      <Button to={PATHS.scores} variant="outline" font="sans" className={styles.cta}>
        {cta}
      </Button>

      {scoreWork && <ScoreViewer work={scoreWork} onClose={() => setScoreWork(null)} />}
    </section>
  );
}
