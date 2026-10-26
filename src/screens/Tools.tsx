import { useState } from 'react';
import type { Go } from '../App';
import { t } from '../copy/en';
import { StepLayout } from '../components/StepLayout';
import { Field, Screen, TopBar } from '../components/ui';
import { useStore } from '../data/store';

export function Tools({ go }: { go: Go }) {
  return (
    <Screen>
      <TopBar onBack={() => go({ name: 'home' })} />
      <div className="flex flex-col gap-3 py-8">
        <h1 className="serif-lg">{t.tools.title}</h1>
        <p className="mb-4 text-[17px] text-muted">{t.tools.intro}</p>
        {(
          [
            ['rewrite', t.tools.rewrite.name],
            ['impulses', t.tools.impulses.name],
          ] as const
        ).map(([name, label]) => (
          <button
            key={name}
            type="button"
            className="rounded-card border border-line bg-surface p-5 text-left font-serif text-[22px] transition-colors duration-300 hover:border-muted"
            onClick={() => go({ name })}
          >
            {label}
          </button>
        ))}
      </div>
    </Screen>
  );
}

/** Goddard's revision. Both texts live only in this component and are gone after Done. */
export function Rewrite({ go }: { go: Go }) {
  const [step, setStep] = useState(0);
  const [old, setOld] = useState('');
  const [fresh, setFresh] = useState('');
  const back = step === 0 ? () => go({ name: 'tools' }) : () => setStep(step - 1);

  if (step === 0)
    return (
      <StepLayout
        onBack={back}
        footer={<button type="button" className="btn-primary" disabled={!old.trim()} onClick={() => setStep(1)}>{t.common.next}</button>}
      >
        <label htmlFor="rw-old" className="serif-lg">{t.tools.rewrite.step1}</label>
        <Field id="rw-old" value={old} onChange={(e) => setOld(e.target.value)} autoFocus />
      </StepLayout>
    );

  if (step === 1)
    return (
      <StepLayout
        onBack={back}
        footer={<button type="button" className="btn-primary" disabled={!fresh.trim()} onClick={() => setStep(2)}>{t.common.next}</button>}
      >
        <label htmlFor="rw-new" className="serif-lg">{t.tools.rewrite.step2}</label>
        <Field id="rw-new" value={fresh} onChange={(e) => setFresh(e.target.value)} autoFocus />
      </StepLayout>
    );

  return (
    <StepLayout
      onBack={back}
      footer={
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setOld('');
            setFresh('');
            go({ name: 'tools' });
          }}
        >
          {t.common.done}
        </button>
      }
    >
      <p className="font-serif text-[24px] leading-snug">{fresh}</p>
      <p className="text-[17px] text-muted">{t.tools.rewrite.step3}</p>
    </StepLayout>
  );
}

export function Impulses({ go }: { go: Go }) {
  const store = useStore();
  const [text, setText] = useState('');

  const add = async () => {
    if (!text.trim()) return;
    await store.addImpulse(text.trim());
    setText('');
  };

  return (
    <Screen>
      <TopBar onBack={() => go({ name: 'tools' })} />
      <div className="flex flex-col gap-6 py-8">
        <h1 className="serif-lg">{t.tools.impulses.intro}</h1>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <input
            className="field flex-1 font-sans text-[17px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.tools.impulses.placeholder}
            aria-label={t.tools.impulses.name}
          />
          <button type="submit" className="btn-primary w-auto px-6" disabled={!text.trim()}>
            {t.tools.impulses.add}
          </button>
        </form>
        <ul className="flex flex-col">
          {store.data.impulses.map((i) => (
            <li key={i.id} className="flex items-center gap-3 border-b border-line py-3">
              <button
                type="button"
                role="checkbox"
                aria-checked={i.doneAt !== null}
                aria-label={t.tools.impulses.tick}
                onClick={() => store.toggleImpulse(i.id)}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${i.doneAt ? 'border-accent bg-accent text-bg' : 'border-muted'}`}
              >
                {i.doneAt && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7.5l2.5 2.5L11 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className={`flex-1 text-[17px] transition-colors duration-300 ${i.doneAt ? 'text-muted line-through decoration-line' : ''}`}>{i.text}</span>
              <button
                type="button"
                aria-label={t.tools.impulses.remove}
                onClick={() => store.removeImpulse(i.id)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-300 hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  );
}
