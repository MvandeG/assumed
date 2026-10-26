import { useState } from 'react';
import type { Go } from '../App';
import { t } from '../copy/en';
import { Field, Hint, Screen, TopBar } from '../components/ui';
import { useStore } from '../data/store';
import { Mode } from '../data/types';
import { useHint } from '../lib/hints';

export function Edit({ go, switchMode }: { go: Go; switchMode: (target: Mode, back: { name: 'edit' }) => Promise<void> }) {
  const store = useStore();
  const active = store.active!;
  const mode = store.data.settings.mode;
  const other: Mode = mode === 'scene' ? 'phrase' : 'scene';

  const [label, setLabel] = useState(active.label);
  const [text, setText] = useState(active[mode]);
  const hint = useHint(text, { mode });

  const save = () => store.updateDesire(active.id, { label: label.trim() || active.label, [mode]: text.trim() });
  const valid = label.trim() !== '' && text.trim() !== '';

  return (
    <Screen>
      <TopBar onBack={() => go({ name: 'home' })} />
      <div className="flex flex-1 flex-col gap-6 py-8">
        <label className="flex flex-col gap-2">
          <span className="text-[15px] text-muted">{t.edit.labelField}</span>
          <input className="field" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={60} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[15px] text-muted">{mode === 'scene' ? t.edit.sceneField : t.edit.phraseField}</span>
          <Field value={text} onChange={(e) => setText(e.target.value)} placeholder={t.modes[mode].placeholder} />
          <span className="text-[14px] text-muted">{t.edit.shaky}</span>
        </label>
        <Hint text={hint} />
        <button
          type="button"
          className="btn-quiet self-start -ml-4 underline decoration-line underline-offset-4"
          onClick={async () => {
            // Keep any edits made here, then switch. The screen remounts with the new mode's text.
            if (valid) await save();
            await switchMode(other, { name: 'edit' });
          }}
        >
          {t.modes[other].switchTo}
        </button>
      </div>
      <div className="flex flex-col gap-2 pb-2">
        <button
          type="button"
          className="btn-primary"
          disabled={!valid}
          onClick={async () => {
            await save();
            go({ name: 'home' });
          }}
        >
          {t.common.save}
        </button>
        <button
          type="button"
          className="btn-quiet"
          onClick={async () => {
            if (valid) await save();
            go({ name: 'seal' });
          }}
        >
          {t.edit.feelsDone}
        </button>
      </div>
    </Screen>
  );
}
