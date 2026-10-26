import { useMemo, useState } from 'react';
import { t } from '../copy/en';
import { PhraseWriter, SceneWriter } from '../components/Writers';
import { StepLayout } from '../components/StepLayout';
import { Dots } from '../components/ui';
import { useStore } from '../data/store';
import { Mode } from '../data/types';
import { downloadReminder } from '../lib/ics';
import { isInstalled, platform } from '../lib/platform';

type Step = 'welcome' | 'how' | 'choose' | 'name' | 'write' | 'reminder' | 'install' | 'ready';

/**
 * "full" is the first run (steps 1–8). "new" is "Start something new" (choose, name, write).
 */
export function Onboarding({ variant, onFinish, onCancel }: { variant: 'full' | 'new'; onFinish: () => void; onCancel?: () => void }) {
  const store = useStore();
  const steps = useMemo<Step[]>(() => {
    if (variant === 'new') return ['choose', 'name', 'write'];
    const all: Step[] = ['welcome', 'how', 'choose', 'name', 'write', 'reminder', 'install', 'ready'];
    return isInstalled() ? all.filter((s) => s !== 'install') : all;
  }, [variant]);

  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>(store.data.settings.mode);
  const [label, setLabel] = useState(variant === 'full' ? store.active?.label ?? '' : '');
  const [time, setTime] = useState(store.data.settings.reminderTime ?? '22:30');

  const step = steps[index];
  const next = () => setIndex((i) => Math.min(i + 1, steps.length - 1));
  const back = index === 0 ? onCancel : () => setIndex((i) => i - 1);
  const dots = <Dots count={steps.length} index={index} />;

  const saveText = async (text: string) => {
    await store.setMode(mode);
    await store.upsertActive({ label: label.trim(), [mode]: text });
    if (variant === 'new') onFinish();
    else next();
  };

  switch (step) {
    case 'welcome':
      return (
        <StepLayout dots={dots} footer={<button type="button" className="btn-primary" onClick={next}>{t.onboarding.welcome.button}</button>}>
          <h1 className="font-serif text-[34px] leading-tight">{t.onboarding.welcome.title}</h1>
          <p className="text-[17px] leading-relaxed text-muted">{t.onboarding.welcome.body}</p>
        </StepLayout>
      );

    case 'how':
      return (
        <StepLayout onBack={back} dots={dots} footer={<button type="button" className="btn-primary" onClick={next}>{t.onboarding.how.button}</button>}>
          <div className="flex flex-col gap-5">
            {t.onboarding.how.lines.map((line) => (
              <p key={line} className="font-serif text-[23px] leading-snug">{line}</p>
            ))}
          </div>
        </StepLayout>
      );

    case 'choose':
      return (
        <StepLayout onBack={back} dots={dots} footer={<p className="text-center text-[15px] text-muted">{t.onboarding.choose.note}</p>}>
          <h1 className="serif-lg">{t.onboarding.choose.title}</h1>
          <div className="flex flex-col gap-3">
            {(['scene', 'phrase'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  next();
                }}
                className={`rounded-card border bg-surface p-5 text-left transition-colors duration-300 hover:border-accent ${m === mode ? 'border-muted' : 'border-line'}`}
              >
                <span className="mb-1 block font-serif text-[22px]">{t.modes[m].name}</span>
                <span className="block text-[16px] leading-snug text-muted">{t.onboarding.choose[m]}</span>
              </button>
            ))}
          </div>
        </StepLayout>
      );

    case 'name':
      return (
        <StepLayout
          onBack={back}
          dots={dots}
          footer={<button type="button" className="btn-primary" disabled={!label.trim()} onClick={next}>{t.common.next}</button>}
        >
          <label htmlFor="label" className="flex flex-col gap-2">
            <span className="serif-lg">{t.onboarding.name.title}</span>
            <span className="text-[17px] text-muted">{t.onboarding.name.body}</span>
          </label>
          <input
            id="label"
            className="field"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && label.trim() && next()}
            placeholder={t.onboarding.name.placeholder}
            autoFocus
            maxLength={60}
          />
        </StepLayout>
      );

    case 'write': {
      const initial = variant === 'full' ? store.active?.[mode] ?? '' : '';
      const props = { initial, onDone: saveText, onBack: back!, dots };
      return mode === 'scene' ? <SceneWriter key="scene" {...props} /> : <PhraseWriter key="phrase" {...props} />;
    }

    case 'reminder':
      return (
        <StepLayout
          onBack={back}
          dots={dots}
          footer={
            <>
              <button type="button" className="btn-secondary" onClick={() => {
                store.setReminderTime(time);
                downloadReminder(time);
                next();
              }}>
                {t.onboarding.reminder.add}
              </button>
              <button type="button" className="btn-primary" onClick={next}>{t.onboarding.reminder.skip}</button>
            </>
          }
        >
          <label htmlFor="time" className="serif-lg">{t.onboarding.reminder.title}</label>
          <input
            id="time"
            type="time"
            className="field w-auto self-start font-sans text-[22px]"
            value={time}
            onChange={(e) => setTime(e.target.value || '22:30')}
          />
        </StepLayout>
      );

    case 'install': {
      const lines = t.onboarding.install[platform()];
      return (
        <StepLayout
          onBack={back}
          dots={dots}
          footer={
            <>
              <button type="button" className="btn-primary" onClick={next}>{t.onboarding.install.done}</button>
              <button type="button" className="btn-quiet" onClick={next}>{t.onboarding.install.later}</button>
            </>
          }
        >
          <h1 className="serif-lg">{t.onboarding.install.title}</h1>
          <ol className="flex flex-col gap-2 text-[17px] text-muted">
            {lines.map((l, i) => (
              <li key={l}>{i + 1}. {l}</li>
            ))}
          </ol>
        </StepLayout>
      );
    }

    case 'ready':
      return (
        <StepLayout
          onBack={back}
          dots={dots}
          footer={
            <button type="button" className="btn-primary" onClick={async () => {
              await store.setOnboarded();
              onFinish();
            }}>
              {t.onboarding.ready.button}
            </button>
          }
        >
          <h1 className="font-serif text-[30px] leading-tight">{t.onboarding.ready.title}</h1>
        </StepLayout>
      );
  }
}
