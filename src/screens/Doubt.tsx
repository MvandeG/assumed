import { useEffect, useState } from 'react';
import type { Go } from '../App';
import { t } from '../copy/en';
import { textFor, useStore } from '../data/store';

// Uses the active desire, or the most recently sealed one. Nothing is stored.
export function Doubt({ go }: { go: Go }) {
  const store = useStore();
  const options = [...(store.active ? [store.active] : []), ...store.sealed];
  const [id, setId] = useState(options[0]?.id);
  const [phase, setPhase] = useState<'show' | 'pick' | 'after'>('show');

  useEffect(() => {
    if (phase !== 'after') return;
    const tid = window.setTimeout(() => go({ name: 'home' }), 2000);
    return () => window.clearTimeout(tid);
  }, [phase, go]);

  const desire = options.find((d) => d.id === id);
  if (!desire) return null;
  const { text, mode } = textFor(desire, store.data.settings.mode);

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#0a090b]">
      <div className="safe fade-in mx-auto flex min-h-full w-full max-w-col flex-col">
        {phase === 'after' ? (
          <div className="fade-in flex flex-1 items-center justify-center">
            <p className="font-serif text-[30px]">{t.doubt.after}</p>
          </div>
        ) : phase === 'pick' ? (
          <div className="fade-in flex flex-1 flex-col justify-center gap-3 py-8">
            {options.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`rounded-card border bg-surface/60 p-5 text-left font-serif text-[22px] transition-colors duration-300 hover:border-muted ${d.id === id ? 'border-muted' : 'border-line'}`}
                onClick={() => {
                  setId(d.id);
                  setPhase('show');
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="flex min-h-[44px] items-center">
              <button type="button" className="btn-quiet -ml-4" onClick={() => go({ name: 'home' })}>
                {t.common.back}
              </button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-10 py-8 text-center">
              <p className="text-[17px] text-muted">{t.doubt.intro}</p>
              <p className="font-serif text-[30px] leading-snug">{text}</p>
              <p className="text-[17px]">{t.modes[mode].doubt}</p>
            </div>
            <div className="flex flex-col items-center gap-2 pb-2">
              <button type="button" className="btn-primary" onClick={() => setPhase('after')}>
                {t.doubt.done}
              </button>
              {options.length > 1 && (
                <button type="button" className="btn-quiet" onClick={() => setPhase('pick')}>
                  {t.doubt.different}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
