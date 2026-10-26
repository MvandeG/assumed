import { ReactNode } from 'react';
import { Screen, TopBar } from './ui';

/** Shared frame for one-question screens: quiet back link, content, one main action, optional dots. */
export function StepLayout({
  onBack,
  backLabel,
  dots,
  children,
  footer,
}: {
  onBack?: () => void;
  backLabel?: string;
  dots?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <Screen>
      <TopBar onBack={onBack} label={backLabel} />
      <div className="flex flex-1 flex-col justify-center gap-6 py-8">{children}</div>
      <div className="flex flex-col gap-4 pb-2">
        {footer}
        {dots}
      </div>
    </Screen>
  );
}
