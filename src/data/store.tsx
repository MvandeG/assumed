import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as db from './db';
import { AppData, Desire, Impulse, Mode, Settings, defaultSettings } from './types';

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

interface Store {
  data: AppData;
  active: Desire | null;
  sealed: Desire[]; // most recently sealed first
  setMode: (mode: Mode) => Promise<void>;
  setReminderTime: (time: string | null) => Promise<void>;
  setOnboarded: () => Promise<void>;
  upsertActive: (patch: Partial<Pick<Desire, 'label' | 'scene' | 'phrase'>>) => Promise<void>;
  updateDesire: (id: string, patch: Partial<Pick<Desire, 'label' | 'scene' | 'phrase'>>) => Promise<void>;
  seal: (id: string) => Promise<void>;
  restore: (id: string) => Promise<void>;
  deleteDesire: (id: string) => Promise<void>;
  addImpulse: (text: string) => Promise<void>;
  toggleImpulse: (id: string) => Promise<void>;
  removeImpulse: (id: string) => Promise<void>;
  importData: (data: AppData) => Promise<void>;
  wipeAll: () => Promise<void>;
}

const Ctx = createContext<Store | null>(null);

const empty: AppData = { settings: defaultSettings, desires: [], impulses: [] };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const ref = useRef<AppData>(empty);

  useEffect(() => {
    db.loadAll()
      .then((d) => {
        ref.current = d;
        setData(d);
      })
      .catch(() => setData(empty));
  }, []);

  const commitSettings = useCallback(async (s: Settings) => {
    ref.current = { ...ref.current, settings: s };
    setData(ref.current);
    await db.saveSettings(s);
  }, []);

  const commitDesires = useCallback(async (d: Desire[]) => {
    ref.current = { ...ref.current, desires: d };
    setData(ref.current);
    await db.saveDesires(d);
  }, []);

  const commitImpulses = useCallback(async (i: Impulse[]) => {
    ref.current = { ...ref.current, impulses: i };
    setData(ref.current);
    await db.saveImpulses(i);
  }, []);

  const store = useMemo<Store | null>(() => {
    if (!data) return null;
    const active = data.desires.find((d) => d.status === 'active') ?? null;
    const sealed = data.desires
      .filter((d) => d.status === 'sealed')
      .sort((a, b) => (b.sealedAt ?? 0) - (a.sealedAt ?? 0));

    const patchDesire = (id: string, fn: (d: Desire) => Desire) =>
      commitDesires(ref.current.desires.map((d) => (d.id === id ? fn(d) : d)));

    return {
      data,
      active,
      sealed,
      setMode: (mode) => commitSettings({ ...ref.current.settings, mode }),
      setReminderTime: (reminderTime) => commitSettings({ ...ref.current.settings, reminderTime }),
      setOnboarded: () => commitSettings({ ...ref.current.settings, onboarded: true }),
      upsertActive: (patch) => {
        const current = ref.current.desires.find((d) => d.status === 'active');
        if (current) return patchDesire(current.id, (d) => ({ ...d, ...patch }));
        const fresh: Desire = {
          id: uid(),
          label: '',
          scene: '',
          phrase: '',
          ...patch,
          status: 'active',
          createdAt: Date.now(),
          sealedAt: null,
        };
        return commitDesires([...ref.current.desires, fresh]);
      },
      updateDesire: (id, patch) => patchDesire(id, (d) => ({ ...d, ...patch })),
      seal: (id) => patchDesire(id, (d) => ({ ...d, status: 'sealed', sealedAt: Date.now() })),
      restore: (id) =>
        // Restoring makes this the one active desire; any other active one is sealed.
        commitDesires(
          ref.current.desires.map((d) => {
            if (d.id === id) return { ...d, status: 'active', sealedAt: null };
            if (d.status === 'active') return { ...d, status: 'sealed', sealedAt: Date.now() };
            return d;
          }),
        ),
      deleteDesire: (id) => commitDesires(ref.current.desires.filter((d) => d.id !== id)),
      addImpulse: (text) => commitImpulses([...ref.current.impulses, { id: uid(), text, doneAt: null }]),
      toggleImpulse: (id) =>
        commitImpulses(
          ref.current.impulses.map((i) => (i.id === id ? { ...i, doneAt: i.doneAt ? null : Date.now() } : i)),
        ),
      removeImpulse: (id) => commitImpulses(ref.current.impulses.filter((i) => i.id !== id)),
      importData: async (next) => {
        await db.replaceAll(next);
        ref.current = next;
        setData(next);
      },
      wipeAll: async () => {
        await db.wipe();
        ref.current = empty;
        setData(empty);
      },
    };
  }, [data, commitDesires, commitImpulses, commitSettings]);

  if (!store) return null;
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
}

/** The text and mode to show for a desire, falling back to the other field when the preferred one is empty. */
export function textFor(desire: Desire, mode: Mode): { text: string; mode: Mode } {
  const preferred = mode === 'scene' ? desire.scene : desire.phrase;
  if (preferred.trim()) return { text: preferred, mode };
  const other: Mode = mode === 'scene' ? 'phrase' : 'scene';
  return { text: other === 'scene' ? desire.scene : desire.phrase, mode: other };
}
