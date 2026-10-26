import { useEffect, useState } from 'react';
import type { Go } from '../App';
import { t } from '../copy/en';
import { Screen } from '../components/ui';
import { textFor, useStore } from '../data/store';
import { prefersReducedMotion } from '../lib/platform';

export function Bedtime({ go }: { go: Go }) {
  const store = useStore();
  const [dark, setDark] = useState(false);

  // Fade to black over ~2 s, hold 3 s, then close to home. Nothing is logged.
  useEffect(() => {
    if (!dark) return;
    const fade = prefersReducedMotion() ? 0 : 2000;
    const id = window.setTimeout(() => go({ name: 'home' }), fade + 3000);
    return () => window.clearTimeout(id);
  }, [dark, go]);

  if (!store.active) return null;
  const { text, mode } = textFor(store.active, store.data.settings.mode);

  return (
    <>
      <Screen>
        <div className="flex min-h-[44px] items-center">
          <button type="button" className="btn-quiet -ml-4" onClick={() => go({ name: 'home' })}>
            {t.common.back}
          </button>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-10 py-8">
          <p className="text-[17px] leading-relaxed text-muted">{t.bedtime.relax}</p>
          <div className="flex flex-col gap-3">
            <p className="font-serif text-[28px] leading-snug">{text}</p>
            <p className="text-[15px] text-muted">{t.bedtime.readOnce}</p>
          </div>
          <p className="text-[17px] leading-relaxed">{t.modes[mode].bedtime}</p>
        </div>
        <div className="pb-2">
          <button type="button" className="btn-primary" onClick={() => setDark(true)} disabled={dark}>
            {t.bedtime.goodNight}
          </button>
        </div>
      </Screen>
      <div
        aria-hidden={!dark}
        className={`fixed inset-0 z-50 bg-black transition-opacity ease-in-out ${dark ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        style={{ transitionDuration: '2000ms' }}
      />
    </>
  );
}
