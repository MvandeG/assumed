import { ReactNode, useState } from 'react';
import { t } from '../copy/en';
import { useHint } from '../lib/hints';
import { StepLayout } from './StepLayout';
import { Field, Hint } from './ui';

interface WriterProps {
  initial?: string;
  onDone: (text: string) => void;
  onBack: () => void;
  backLabel?: string;
  dots?: ReactNode;
  /** Shown above the prompt, e.g. when switching modes. */
  notice?: string;
}

function joinScene(where: string, feel: string) {
  const a = where.trim();
  const b = feel.trim();
  if (!a) return b;
  if (!b) return a;
  return /[.!?:;]$/.test(a) ? `${a} ${b}` : `${a}. ${b}`;
}

export function SceneWriter({ initial = '', onDone, onBack, backLabel, dots, notice }: WriterProps) {
  // With an existing scene, go straight to the editable result.
  const [startedAt] = useState(initial.trim() ? 2 : 0);
  const [step, setStep] = useState(startedAt);
  const [where, setWhere] = useState('');
  const [feel, setFeel] = useState('');
  const [scene, setScene] = useState(initial);

  const whereHint = useHint(where, { mode: 'scene', length: false });
  const feelHint = useHint(feel, { mode: 'scene', length: false });
  const sceneHint = useHint(scene, { mode: 'scene' });

  const back = () => (step === startedAt ? onBack() : setStep(step - 1));
  const label = step === startedAt ? backLabel : t.common.back;
  const Notice = notice && step === startedAt ? <p className="text-[15px] text-muted">{notice}</p> : null;

  if (step === 0)
    return (
      <StepLayout
        onBack={back}
        backLabel={label}
        dots={dots}
        footer={
          <button type="button" className="btn-primary" disabled={!where.trim()} onClick={() => setStep(1)}>
            {t.common.next}
          </button>
        }
      >
        {Notice}
        <label htmlFor="scene-where" className="serif-lg">{t.sceneWriter.step1}</label>
        <Field id="scene-where" value={where} onChange={(e) => setWhere(e.target.value)} placeholder={t.sceneWriter.step1Example} autoFocus />
        <Hint text={whereHint} />
      </StepLayout>
    );

  if (step === 1)
    return (
      <StepLayout
        onBack={back}
        backLabel={label}
        dots={dots}
        footer={
          <button
            type="button"
            className="btn-primary"
            disabled={!feel.trim()}
            onClick={() => {
              setScene(joinScene(where, feel));
              setStep(2);
            }}
          >
            {t.common.next}
          </button>
        }
      >
        <label htmlFor="scene-feel" className="serif-lg">{t.sceneWriter.step2}</label>
        <Field id="scene-feel" value={feel} onChange={(e) => setFeel(e.target.value)} placeholder={t.sceneWriter.step2Example} autoFocus />
        <Hint text={feelHint} />
      </StepLayout>
    );

  return (
    <StepLayout
      onBack={back}
      backLabel={label}
      dots={dots}
      footer={
        <button type="button" className="btn-primary" disabled={!scene.trim()} onClick={() => onDone(scene.trim())}>
          {t.common.thisIsIt}
        </button>
      }
    >
      {Notice}
      <label htmlFor="scene-full" className="serif-lg">{t.sceneWriter.step3}</label>
      <Field id="scene-full" value={scene} onChange={(e) => setScene(e.target.value)} placeholder={t.modes.scene.placeholder} />
      <Hint text={sceneHint} />
    </StepLayout>
  );
}

export function PhraseWriter({ initial = '', onDone, onBack, backLabel, dots, notice }: WriterProps) {
  const [phrase, setPhrase] = useState(initial);
  const hint = useHint(phrase, { mode: 'phrase' });
  return (
    <StepLayout
      onBack={onBack}
      backLabel={backLabel}
      dots={dots}
      footer={
        <button type="button" className="btn-primary" disabled={!phrase.trim()} onClick={() => onDone(phrase.trim())}>
          {t.common.thisIsIt}
        </button>
      }
    >
      {notice ? <p className="text-[15px] text-muted">{notice}</p> : null}
      <label htmlFor="phrase" className="serif-lg">{t.phraseWriter.prompt}</label>
      <Field id="phrase" value={phrase} onChange={(e) => setPhrase(e.target.value)} placeholder={t.modes.phrase.placeholder} autoFocus />
      <div className="flex items-start justify-between gap-3">
        <Hint text={hint} />
        <button
          type="button"
          className="shrink-0 rounded-full border border-line px-4 py-2 text-[14px] text-muted transition-colors duration-300 hover:text-ink"
          onClick={() => setPhrase(t.phraseWriter.coue)}
        >
          {t.phraseWriter.coueChip}
        </button>
      </div>
    </StepLayout>
  );
}
