import { ReactNode, TextareaHTMLAttributes, useEffect, useRef } from 'react';
import { t } from '../copy/en';

/** Single centred column with safe-area padding. */
export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`safe fade-in mx-auto flex min-h-full w-full max-w-col flex-col ${className}`}>{children}</div>
  );
}

/** Top row with a quiet back link on the left. */
export function TopBar({ onBack, right, label = t.common.back }: { onBack?: () => void; right?: ReactNode; label?: string }) {
  return (
    <div className="flex min-h-[44px] items-center justify-between">
      {onBack ? (
        <button type="button" className="btn-quiet -ml-4" onClick={onBack}>
          {label}
        </button>
      ) : (
        <span />
      )}
      {right}
    </div>
  );
}

export function Dots({ count, index }: { count: number; index: number }) {
  return (
    <div className="flex justify-center gap-2" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${i === index ? 'bg-ink' : 'bg-line'}`}
        />
      ))}
    </div>
  );
}

export function Hint({ text }: { text: string | null }) {
  return (
    <p className={`min-h-[22px] text-[15px] text-muted transition-opacity duration-500 ${text ? 'opacity-100' : 'opacity-0'}`} aria-live="polite">
      {text ?? ''}
    </p>
  );
}

/** Textarea that grows with its content. */
export function Field(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [props.value]);
  return <textarea ref={ref} rows={2} {...props} className={`field ${props.className ?? ''}`} />;
}

export function Confirm({
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" role="dialog" aria-modal="true">
      <div className="safe w-full max-w-col">
        <div className="rounded-card border border-line bg-surface p-6">
          <p className="mb-6 font-serif text-[22px] leading-snug">{message}</p>
          <div className="flex flex-col gap-2">
            <button type="button" className="btn-primary" onClick={onConfirm} autoFocus>
              {confirmLabel}
            </button>
            <button type="button" className="btn-quiet" onClick={onCancel}>
              {t.common.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
