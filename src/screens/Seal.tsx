import { useState } from 'react';
import type { Go } from '../App';
import { t } from '../copy/en';
import { Screen, TopBar } from '../components/ui';
import { textFor, useStore } from '../data/store';
import { prefersReducedMotion } from '../lib/platform';

export function Seal({ go }: { go: Go }) {
  const store = useStore();
  const [fading, setFading] = useState(false);
  const [desire] = useState(store.active);

  if (!desire) return null;
  const { text } = textFor(desire, store.data.settings.mode);

  const seal = () => {
    setFading(true);
    window.setTimeout(async () => {
      await store.seal(desire.id);
      go({ name: 'home' });
    }, prefersReducedMotion() ? 300 : 2000);
  };

  return (
    <Screen>
      <TopBar onBack={fading ? undefined : () => go({ name: 'edit' })} />
      <div
        className={`flex flex-1 flex-col justify-center gap-8 py-8 transition-opacity ease-in-out ${fading ? 'opacity-0' : 'opacity-100'}`}
        style={{ transitionDuration: '2000ms' }}
      >
        <p className="font-serif text-[30px] leading-tight">{desire.label}</p>
        <p className="font-serif text-[24px] leading-snug text-ink/90">{text}</p>
        <p className="text-[17px] text-muted">{t.seal.body}</p>
      </div>
      <div className="pb-2">
        <button type="button" className="btn-primary" onClick={seal} disabled={fading}>
          {t.seal.button}
        </button>
      </div>
    </Screen>
  );
}
