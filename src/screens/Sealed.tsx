import { useState } from 'react';
import type { Go } from '../App';
import { t } from '../copy/en';
import { Confirm, Screen, TopBar } from '../components/ui';
import { textFor, useStore } from '../data/store';

const link = 'btn-quiet min-h-[36px] px-0 text-[14px]';

export function Sealed({ go }: { go: Go }) {
  const store = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [toRestore, setToRestore] = useState<string | null>(null);

  // Only one desire can be active, so restoring seals the current one.
  const restore = async (id: string) => {
    await store.restore(id);
    go({ name: 'home' });
  };

  return (
    <Screen>
      <TopBar onBack={() => go({ name: 'settings' })} />
      <h1 className="serif-lg pt-6">{t.settings.sealed}</h1>
      <p className="pb-4 pt-2 text-[17px] text-muted">{t.settings.sealedHelp}</p>
      {store.sealed.length === 0 && <p className="text-[15px] text-muted">{t.settings.sealedEmpty}</p>}
      <ul className="flex flex-col">
        {store.sealed.map((d) => (
          <li key={d.id} className="border-b border-line py-4">
            <p className="font-serif text-[22px]">{d.label}</p>
            {open === d.id && (
              <p className="fade-in mt-2 font-serif text-[20px] leading-snug text-muted">
                {textFor(d, store.data.settings.mode).text}
              </p>
            )}
            <div className="mt-1 flex gap-5">
              <button type="button" className={link} onClick={() => setOpen(open === d.id ? null : d.id)}>
                {open === d.id ? t.settings.hide : t.settings.read}
              </button>
              <button type="button" className={link} onClick={() => (store.active ? setToRestore(d.id) : restore(d.id))}>
                {t.settings.restore}
              </button>
              <button type="button" className={link} onClick={() => setToDelete(d.id)}>
                {t.settings.delete}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {toRestore && (
        <Confirm
          message={t.home.sealFirst}
          confirmLabel={t.home.sealIt}
          onCancel={() => setToRestore(null)}
          onConfirm={() => restore(toRestore)}
        />
      )}
      {toDelete && (
        <Confirm
          message={t.settings.deleteOne}
          confirmLabel={t.settings.delete}
          onCancel={() => setToDelete(null)}
          onConfirm={async () => {
            await store.deleteDesire(toDelete);
            setToDelete(null);
          }}
        />
      )}
    </Screen>
  );
}
