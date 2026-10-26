import { ReactNode, useRef, useState } from 'react';
import type { Go, Route } from '../App';
import { t } from '../copy/en';
import { Confirm, Screen, TopBar } from '../components/ui';
import { parseImport, toExportJson } from '../data/db';
import { useStore } from '../data/store';
import { AppData, Mode } from '../data/types';
import { downloadFile } from '../lib/download';
import { downloadReminder } from '../lib/ics';

function Section({ title, help, children }: { title: string; help: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b border-line py-6 last:border-0">
      <h2 className="text-[17px] font-medium">{title}</h2>
      {children}
      <p className="text-[14px] text-muted">{help}</p>
    </section>
  );
}

const smallBtn = 'rounded-full border border-line px-5 py-2.5 text-[15px] transition-colors duration-300 hover:border-muted';

export function Settings({ go, switchMode }: { go: Go; switchMode: (target: Mode, back: Route) => Promise<void> }) {
  const store = useStore();
  const { mode, reminderTime } = store.data.settings;
  const [time, setTime] = useState(reminderTime ?? '22:30');
  const [pendingImport, setPendingImport] = useState<AppData | null>(null);
  const [importError, setImportError] = useState(false);
  const [askWipe, setAskWipe] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const onFile = async (file: File | undefined) => {
    setImportError(false);
    if (!file) return;
    try {
      setPendingImport(parseImport(await file.text()));
    } catch {
      setImportError(true);
    }
    if (fileInput.current) fileInput.current.value = '';
  };

  return (
    <Screen>
      <TopBar onBack={() => go({ name: 'home' })} />
      <h1 className="serif-lg pt-6">{t.settings.title}</h1>

      <Section title={t.settings.mode} help={t.settings.modeHelp}>
        <div className="grid grid-cols-2 gap-1 rounded-full border border-line p-1" role="radiogroup" aria-label={t.settings.mode}>
          {(['scene', 'phrase'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => switchMode(m, { name: 'settings' })}
              className={`min-h-[44px] rounded-full text-[16px] transition-colors duration-300 ${mode === m ? 'bg-surface text-ink' : 'text-muted'}`}
            >
              {t.modes[m].name}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t.settings.reminder} help={t.settings.reminderHelp}>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="time"
            aria-label={t.settings.reminder}
            className="field w-auto py-2 font-sans text-[18px]"
            value={time}
            onChange={(e) => setTime(e.target.value || '22:30')}
          />
          <button
            type="button"
            className={smallBtn}
            onClick={() => {
              store.setReminderTime(time);
              downloadReminder(time);
            }}
          >
            {t.settings.reminderAdd}
          </button>
        </div>
      </Section>

      <section className="border-b border-line">
        <button
          type="button"
          className="flex w-full items-center justify-between py-6 text-left"
          onClick={() => go({ name: 'sealed' })}
        >
          <span className="flex flex-col gap-3">
            <span className="text-[17px] font-medium">{t.settings.sealed}</span>
            <span className="text-[14px] text-muted">{t.settings.sealedHelp}</span>
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-muted">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      <Section title={t.settings.data} help={t.settings.dataHelp}>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={smallBtn}
            onClick={() => {
              const day = new Date().toISOString().slice(0, 10);
              downloadFile(toExportJson(store.data), `assumed-${day}.json`, 'application/json');
            }}
          >
            {t.settings.export}
          </button>
          <button type="button" className={smallBtn} onClick={() => fileInput.current?.click()}>
            {t.settings.import}
          </button>
          <button type="button" className={`${smallBtn} text-muted`} onClick={() => setAskWipe(true)}>
            {t.settings.deleteAll}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
        {importError && <p className="text-[15px] text-muted">{t.settings.importError}</p>}
      </Section>

      {pendingImport && (
        <Confirm
          message={t.settings.importConfirm}
          confirmLabel={t.settings.importReplace}
          onCancel={() => setPendingImport(null)}
          onConfirm={async () => {
            await store.importData(pendingImport);
            setPendingImport(null);
            go(pendingImport.settings.onboarded ? { name: 'home' } : { name: 'onboarding' });
          }}
        />
      )}
      {askWipe && (
        <Confirm
          message={t.settings.deleteAllConfirm}
          confirmLabel={t.settings.deleteAll}
          onCancel={() => setAskWipe(false)}
          onConfirm={async () => {
            await store.wipeAll();
            go({ name: 'onboarding' });
          }}
        />
      )}
    </Screen>
  );
}
