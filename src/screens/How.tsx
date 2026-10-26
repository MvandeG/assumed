import { useRef, useState } from 'react';
import type { Go } from '../App';
import { t } from '../copy/en';
import { Dots, Screen, TopBar } from '../components/ui';

export function How({ go }: { go: Go }) {
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const cards = t.how.cards;

  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <Screen>
      <TopBar onBack={() => go({ name: 'home' })} />
      <h1 className="sr-only">{t.how.title}</h1>
      <div
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar -mx-4 flex flex-1 snap-x snap-mandatory overflow-x-auto"
      >
        {cards.map((c, i) => (
          <section key={c.title} className="flex w-full shrink-0 snap-center flex-col justify-center px-4 py-8" aria-label={`${i + 1} / ${cards.length}`}>
            <div className="rounded-card border border-line bg-surface p-7">
              <h2 className="mb-4 font-serif text-[28px] leading-tight">{c.title}</h2>
              <p className="font-serif text-[20px] leading-relaxed text-ink/85">{c.body}</p>
            </div>
          </section>
        ))}
      </div>
      <div className="flex flex-col gap-4 pb-2">
        <button
          type="button"
          className="btn-primary"
          onClick={() => (index < cards.length - 1 ? goTo(index + 1) : go({ name: 'home' }))}
        >
          {index < cards.length - 1 ? t.common.next : t.common.done}
        </button>
        <Dots count={cards.length} index={index} />
      </div>
    </Screen>
  );
}
