import { useId, useState } from 'react';
import { youtubeIdFrom } from '@shared/content';
import styles from '../../stylesheets/studio/Editor.module.css';

/** A new, empty value shaped like the schema field (for "Add"). */
export function emptyValue(field) {
  if (field.type === 'group') {
    return Object.fromEntries(
      Object.entries(field.fields).map(([key, child]) => [key, emptyValue(child)]),
    );
  }
  if (field.type === 'list') return [];
  if (field.type === 'boolean') return false;
  return field.optional ? null : '';
}

const errorFor = (errors, path) =>
  errors.filter((error) => error.path === path).map((error) => error.message);

function Message({ messages, id }) {
  if (messages.length === 0) return null;
  return (
    <p id={id} className={styles.fieldError}>
      {messages.join(' ')}
    </p>
  );
}

function Input({ field, value, onChange, path, errors, readOnly }) {
  const id = useId();
  const messages = errorFor(errors, path);
  const describedBy = messages.length ? `${id}-error` : undefined;
  const common = {
    id,
    readOnly,
    'aria-invalid': messages.length ? true : undefined,
    'aria-describedby': describedBy,
  };

  let control;
  if (field.type === 'boolean') {
    return (
      <label className={styles.check}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          disabled={readOnly}
          onChange={(event) => onChange(event.target.checked)}
        />
        {field.label}
      </label>
    );
  }
  if (field.type === 'choice' && field.readonly) {
    return (
      <p className={styles.readonly}>
        <span className={styles.labelText}>{field.label}</span> {field.names?.[value] ?? value}
      </p>
    );
  }
  if (field.type === 'text' && field.multiline) {
    control = (
      <textarea
        {...common}
        value={value ?? ''}
        maxLength={field.max}
        rows={Math.min(8, Math.max(2, Math.ceil((value ?? '').length / 90)))}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  } else if (field.type === 'number') {
    control = (
      <input
        {...common}
        type="number"
        inputMode="numeric"
        min={field.min}
        max={field.max}
        value={value ?? ''}
        onChange={(event) =>
          onChange(
            event.target.value === '' ? (field.optional ? null : '') : Number(event.target.value),
          )
        }
      />
    );
  } else {
    control = (
      <input
        {...common}
        type={field.type === 'url' ? 'url' : 'text'}
        value={value ?? ''}
        maxLength={field.type === 'text' ? field.max : 500}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  const videoId = field.type === 'youtube' ? youtubeIdFrom(value) : null;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.labelText}>
        {field.label}
        {field.optional && <span className={styles.optional}> optional</span>}
      </label>
      {control}
      {field.type === 'text' && field.max > 60 && (
        <span className={styles.counter}>
          {(value ?? '').length} / {field.max}
        </span>
      )}
      {videoId && (
        <span className={styles.video}>
          <img
            src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
            alt=""
            width="120"
            height="68"
          />
          Video {videoId}
        </span>
      )}
      <Message messages={messages} id={describedBy} />
    </div>
  );
}

function List({ field, value, onChange, path, errors, readOnly }) {
  const items = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState(() =>
    field.fixed && items.length <= 6 ? items.map((_, i) => i) : [],
  );
  const messages = errorFor(errors, path);

  const update = (next) => onChange(next);
  const move = (from, by) => {
    const to = from + by;
    const next = [...items];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setOpen((current) => current.map((i) => (i === from ? to : i === to ? from : i)));
    update(next);
  };
  const remove = (index) => {
    setOpen((current) => current.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
    update(items.filter((_, i) => i !== index));
  };
  const add = () => {
    setOpen((current) => [0, ...current.map((i) => i + 1)]);
    update([emptyValue(field.item), ...items]);
  };
  const hasError = (index) =>
    errors.some((error) => error.path.startsWith(path ? `${path}.${index}` : String(index)));

  return (
    <fieldset className={styles.list}>
      <legend>
        {field.label} <span className={styles.optional}>({items.length})</span>
      </legend>
      {!field.fixed && !readOnly && items.length < field.max && (
        <button type="button" className={styles.add} onClick={add}>
          + Add at the top
        </button>
      )}
      <Message messages={messages} />
      <ol className={styles.items}>
        {items.map((item, index) => {
          const itemPath = path ? `${path}.${index}` : String(index);
          const expanded = open.includes(index);
          const title = field.itemLabel?.(item) || 'New item';
          return (
            <li key={index} className={`${styles.item} ${hasError(index) ? styles.itemError : ''}`}>
              <div className={styles.itemBar}>
                <button
                  type="button"
                  className={styles.itemToggle}
                  aria-expanded={expanded}
                  onClick={() =>
                    setOpen((current) =>
                      expanded ? current.filter((i) => i !== index) : [...current, index],
                    )
                  }
                >
                  <span aria-hidden="true">{expanded ? '▾' : '▸'}</span> {title}
                </button>
                {!readOnly && (
                  <span className={styles.itemTools}>
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${title} up`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label={`Move ${title} down`}
                    >
                      ↓
                    </button>
                    {!field.fixed && (
                      <button
                        type="button"
                        onClick={() => window.confirm(`Remove “${title}”?`) && remove(index)}
                        disabled={items.length <= field.min}
                      >
                        Remove
                      </button>
                    )}
                  </span>
                )}
              </div>
              {expanded && (
                <div className={styles.itemBody}>
                  <Field
                    field={field.item}
                    value={item}
                    path={itemPath}
                    errors={errors}
                    readOnly={readOnly}
                    onChange={(next) => update(items.map((old, i) => (i === index ? next : old)))}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </fieldset>
  );
}

export default function Field({ field, value, onChange, path = '', errors, readOnly }) {
  if (field.type === 'list')
    return (
      <List
        field={field}
        value={value}
        onChange={onChange}
        path={path}
        errors={errors}
        readOnly={readOnly}
      />
    );
  if (field.type === 'group') {
    const source = value && typeof value === 'object' ? value : {};
    const body = Object.entries(field.fields).map(([key, child]) => (
      <Field
        key={key}
        field={child}
        value={source[key]}
        path={path ? `${path}.${key}` : key}
        errors={errors}
        readOnly={readOnly}
        onChange={(next) => onChange({ ...source, [key]: next })}
      />
    ));
    return field.label ? (
      <fieldset className={styles.group}>
        <legend>{field.label}</legend>
        {body}
      </fieldset>
    ) : (
      <div className={styles.fields}>{body}</div>
    );
  }
  return (
    <Input
      field={field}
      value={value}
      onChange={onChange}
      path={path}
      errors={errors}
      readOnly={readOnly}
    />
  );
}
