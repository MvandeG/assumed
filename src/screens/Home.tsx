import { useState } from 'react';
import type { Go } from '../App';
import { t } from '../copy/en';
import { Confirm, Screen } from '../components/ui';
import { textFor, useStore } from '../data/store';

export function Home({ go }: { go: Go }) {
  const store = useStore();
  const { active, sealed } = store;
  const [menu, setMenu] = useState(false);
  const [askSeal, setAskSeal] = useState(false);

  // Only one desire can be active at a time.
  const startNew = () => (active ? setAskSeal(true) : go({ name: 'new' }));

  return (
    <Screen>
      <header className="relative flex min-h-[44px] items-center justify-between">
        <span className="font-serif text-[20px] text-muted">{t.appName}</span>
        <button
          type="button"
          aria-label={t.common.menu}
          aria-expanded={menu}
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors duration-300 hover:text-ink"
          onClick={() => setMenu((m) => !m)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M3 7h16M3 15h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        {menu && (
          <>
            <button type="button" aria-label={t.common.close} className="fixed inset-0 z-10 cursor-default" onClick={() => setMenu(false)} />
            <nav className="fade-in absolute right-0 top-12 z-20 flex w-56 flex-col rounded-card border border-line bg-surface py-2">
              {(
                [
                  ['tools', t.home.menuTools],
                  ['how', t.home.menuHow],
                  ['settings', t.home.menuSettings],
                ] as const
              ).map(([name, label]) => (
                <button key={name} type="button" className="px-5 py-3 text-left text-[16px] transition-colors duration-300 hover:text-accent" onClick={() => go({ name })}>
                  {label}
                </button>
              ))}
            </nav>
          </>
        )}
      </header>

      <main className="flex flex-1 flex-col justify-center gap-8 py-10">
        {active ? (
          <>
            <button type="button" onClick={() => go({ name: 'edit' })} className="rounded-card border border-line bg-surface p-6 text-left transition-colors duration-300 hover:border-muted">
              <span className="block font-serif text-[32px] leading-tight">{active.label}</span>
              <span className="mt-3 line-clamp-2 block font-serif text-[20px] leading-snug text-muted">
                {textFor(active, store.data.settings.mode).text}
              </span>
            </button>
            <button type="button" className="btn-primary" onClick={() => go({ name: 'bedtime' })}>
              {t.home.begin}
            </button>
          </>
        ) : sealed.length > 0 ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="font-serif text-[28px] leading-tight">{t.home.allSealed}</p>
            <button type="button" className="btn-quiet underline decoration-line underline-offset-4" onClick={startNew}>
              {t.home.startNew}
            </button>
          </div>
        ) : (
          <button type="button" className="btn-primary" onClick={startNew}>
            {t.home.startNew}
          </button>
        )}
      </main>

      <footer className="flex min-h-[44px] justify-center">
        {(active || sealed.length > 0) && (
          <button type="button" className="btn-quiet" onClick={() => go({ name: 'doubt' })}>
            {t.home.doubt}
          </button>
        )}
      </footer>

      {askSeal && active && (
        <Confirm
          message={t.home.sealFirst}
          confirmLabel={t.home.sealIt}
          onCancel={() => setAskSeal(false)}
          onConfirm={() => go({ name: 'seal' })}
        />
      )}
    </Screen>
  );
}
