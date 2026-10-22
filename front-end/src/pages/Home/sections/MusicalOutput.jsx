import { useState } from 'react';
import WorkCard from '@/reusable-components/WorkCard';
import ScoreViewer from '@/reusable-components/ScoreViewer';
import FilterTabs from '@/reusable-components/FilterTabs';
import SectionHeader from '@/reusable-components/SectionHeader';
import { HOME_SECTIONS } from '@/data/home';
import { WORK_CATEGORIES, worksByCategory } from '@/data/works';
import styles from '../../../stylesheets/MusicalOutput.module.css';

const tabId = (id) => `output-tab-${id}`;
const panelId = (id) => `output-panel-${id}`;

export default function MusicalOutput() {
  const { title, description } = HOME_SECTIONS.output;
  const [category, setCategory] = useState(WORK_CATEGORIES[0].id);
  const [scoreWork, setScoreWork] = useState(null);

  return (
    <section className={styles.section} aria-labelledby="output-title">
      <SectionHeader id="output-title" title={title} description={description}>
        <div className={styles.tabs}>
          <FilterTabs
            label="Filter works by type"
            tabs={WORK_CATEGORIES}
            value={category}
            onChange={setCategory}
            tabId={tabId}
            panelId={panelId}
          />
        </div>
      </SectionHeader>

      <div
        id={panelId(category)}
        role="tabpanel"
        aria-labelledby={tabId(category)}
        className={styles.grid}
      >
        {worksByCategory(category).map((work) => (
          <WorkCard key={work.id} work={work} onViewScore={setScoreWork} />
        ))}
      </div>

      {scoreWork && <ScoreViewer work={scoreWork} onClose={() => setScoreWork(null)} />}
    </section>
  );
}
