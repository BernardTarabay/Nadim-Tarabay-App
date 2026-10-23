import { useCallback, useEffect, useState } from 'react';
import { CONTENT } from '@shared/content';
import { api } from '../api';
import Field from './Field';
import styles from '../../stylesheets/studio/Editor.module.css';

const MODE_NOTES = {
  github: (repo) =>
    `Saving publishes: it commits the change to GitHub (${repo}) and Vercel rebuilds the live site in about a minute.`,
  local: () =>
    'Local mode: saving writes the file in this project folder and the dev site reloads at once. On the live site, saves publish through GitHub.',
  off: () =>
    'Editing is off on this server. Add GITHUB_TOKEN in Vercel to turn it on; until then you can look but not save.',
};

export default function Editor({ session, onUnauthorized }) {
  const [files, setFiles] = useState([]);
  const [key, setKey] = useState(null);
  const [loaded, setLoaded] = useState(null);
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState({ kind: 'idle' });
  const mode = session.editing;
  const readOnly = mode === 'off';
  // Only the document that belongs to the chosen file counts; a stale one is treated as loading.
  const doc = loaded?.key === key ? loaded : null;
  const dirty = doc && JSON.stringify(draft) !== JSON.stringify(doc.value);

  const fail = useCallback(
    (error) => {
      if (error.status === 401) onUnauthorized();
      setStatus({ kind: 'error', message: error.message, errors: error.errors ?? [] });
    },
    [onUnauthorized],
  );

  useEffect(() => {
    api.contentList().then((list) => {
      setFiles(list.files);
      setKey((current) => current ?? list.files[0]?.key ?? null);
    }, fail);
  }, [fail]);

  useEffect(() => {
    if (!key || readOnly) return undefined;
    let alive = true;
    api.content(key).then((content) => {
      if (!alive) return;
      setLoaded({ ...content, key });
      setDraft(content.value);
    }, fail);
    return () => {
      alive = false;
    };
  }, [key, readOnly, fail]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const choose = (next) => {
    if (next === key) return;
    if (dirty && !window.confirm('Discard your unsaved changes?')) return;
    setStatus({ kind: 'idle' });
    setKey(next);
  };

  const save = async () => {
    setStatus({ kind: 'saving' });
    try {
      const saved = await api.saveContent(key, draft, doc.version);
      setLoaded({ ...doc, value: saved.value, version: saved.version });
      setDraft(saved.value);
      setStatus({ kind: 'saved', commit: saved.commit });
    } catch (error) {
      fail(error);
    }
  };

  const definition = key ? CONTENT[key] : null;
  const errors = status.kind === 'error' ? status.errors : [];

  return (
    <div className={styles.editor}>
      <nav className={styles.files} aria-label="Content">
        <h1 className={styles.filesTitle}>Edit site</h1>
        <ul>
          {files.map((file) => (
            <li key={file.key}>
              <button
                type="button"
                aria-current={file.key === key ? 'true' : undefined}
                onClick={() => choose(file.key)}
              >
                <strong>{file.label}</strong>
                <span>{file.description}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className={styles.note}>{MODE_NOTES[mode](session.repo)}</p>
        <p className={styles.note}>
          Bigger changes (new pages, new kinds of sections, images) are better made in the code,
          where they can be checked before going live.
        </p>
      </nav>

      <section className={styles.form} aria-label={definition?.label ?? 'Editor'}>
        {readOnly && <p className={styles.banner}>{MODE_NOTES.off()}</p>}
        {!readOnly && !doc && status.kind !== 'error' && <p className={styles.muted}>Loading…</p>}
        {doc && definition && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            <header className={styles.formHeader}>
              <div>
                <h2>{definition.label}</h2>
                <p className={styles.muted}>{definition.description}</p>
              </div>
              <div className={styles.saveBar}>
                {dirty && <span className={styles.unsaved}>Unsaved changes</span>}
                <button
                  type="button"
                  className={styles.secondary}
                  disabled={!dirty || status.kind === 'saving'}
                  onClick={() => setDraft(doc.value)}
                >
                  Undo changes
                </button>
                <button
                  type="submit"
                  className={styles.primary}
                  disabled={!dirty || status.kind === 'saving'}
                >
                  {status.kind === 'saving'
                    ? 'Saving…'
                    : mode === 'github'
                      ? 'Save & publish'
                      : 'Save'}
                </button>
              </div>
            </header>

            <div role="status" aria-live="polite">
              {status.kind === 'saved' && (
                <p className={styles.success}>
                  Saved.{' '}
                  {status.commit ? (
                    <>
                      The live site updates in about a minute.{' '}
                      <a href={status.commit.url} target="_blank" rel="noreferrer">
                        See the commit ↗
                      </a>
                    </>
                  ) : (
                    'The file in this folder is updated.'
                  )}
                </p>
              )}
              {status.kind === 'error' && (
                <p className={styles.failure}>
                  {status.message}
                  {status.errors?.length > 0 && ` (${status.errors.length} to fix, marked below)`}
                </p>
              )}
            </div>

            <Field
              field={definition.schema}
              value={draft}
              onChange={setDraft}
              errors={errors}
              readOnly={readOnly}
            />
          </form>
        )}
      </section>
    </div>
  );
}
