import { useState } from 'react';
import { useAudioPlayer } from '@/audio/useAudioPlayer';
import ScoreBook from '@/reusable-components/ScoreBook';
import PageHero from '@/reusable-components/PageHero';
import ScoreDetailPanel from '@/reusable-components/ScoreDetailPanel';
import ScoreViewer from '@/reusable-components/ScoreViewer';
import FilterTabs from '@/reusable-components/FilterTabs';
import Icon from '@/reusable-components/Icon';
import { SCORE_FAMILIES, SCORES, SCORES_PAGE } from '@/data/scores';
import styles from '../../stylesheets/ScoresPage.module.css';

const pad = (n) => String(n).padStart(2, '0');
const tabId = (id) => `scores-tab-${id}`;
const panelId = (id) => `scores-panel-${id}`;

export default function ScoresPage() {
  const { play, currentTrack } = useAudioPlayer();
  const [selected, setSelected] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [family, setFamily] = useState('all');
  const list = family === 'all' ? SCORES : SCORES.filter((item) => item.family === family);

  const filter = (id) => {
    setFamily(id);
    setSelected(null);
  };

  const [followedTrack, setFollowedTrack] = useState(currentTrack?.id);
  if (currentTrack?.id !== followedTrack) {
    setFollowedTrack(currentTrack?.id);
    const playing = list.findIndex((item) => item.track?.id === currentTrack?.id);
    if (selected !== null && playing !== -1 && !fullscreen) setSelected(playing);
  }
  const score = selected === null ? null : list[selected];
  const position = selected ?? 0;

  const open = (index) => {
    setSelected(index);
    if (list[index].track) play(list[index].track);
  };

  const close = () => {
    const id = score?.id;
    setSelected(null);
    setTimeout(() => document.querySelector(`[data-score="${id}"]`)?.focus());
  };

  return (
    <>
      <PageHero title={SCORES_PAGE.title} image={SCORES_PAGE.hero} />

      <div className={`l-container ${styles.page}`}>
        <div className={styles.intro}>
          <p className={styles.introText}>
            {SCORES_PAGE.intro[0]}
            <br />
            {SCORES_PAGE.intro[1]}
          </p>
          <div className={styles.pager}>
            <span className={styles.position} aria-live="polite">
              {pad(position + 1)} / {pad(list.length)}
            </span>
            <button
              type="button"
              className={styles.pagerButton}
              onClick={() => open(position - 1)}
              disabled={position === 0}
              aria-label="Previous score"
              data-audio-control
            >
              <Icon name="chevron-left" size={20} />
            </button>
            <button
              type="button"
              className={styles.pagerButton}
              onClick={() => open(position + 1)}
              disabled={position === list.length - 1}
              aria-label="Next score"
              data-audio-control
            >
              <Icon name="chevron-right" size={20} />
            </button>
          </div>
        </div>

        <div className={styles.filters}>
          <FilterTabs
            label="Filter scores by forces"
            tabs={SCORE_FAMILIES}
            value={family}
            onChange={filter}
            tabId={tabId}
            panelId={panelId}
          />
        </div>

        <div
          id={panelId(family)}
          role="tabpanel"
          aria-labelledby={tabId(family)}
          className={`${styles.collection} ${score ? styles.open : ''}`}
        >
          <div className={styles.library}>
            {list.map((item, index) => (
              <ScoreBook
                key={item.id}
                score={item}
                selected={index === selected}
                onSelect={() => open(index)}
              />
            ))}
          </div>
          {score && (
            <ScoreDetailPanel
              score={score}
              onClose={close}
              onFullscreen={() => setFullscreen(true)}
            />
          )}
        </div>
      </div>

      {score && fullscreen && (
        <ScoreViewer
          work={score}
          onClose={() => setFullscreen(false)}
          onLeave={() => {
            setFullscreen(false);
            setSelected(null);
          }}
        />
      )}
    </>
  );
}
