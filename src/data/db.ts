import { get, set, clear } from 'idb-keyval';
import { AppData, Desire, Impulse, Settings, defaultSettings } from './types';

const K = { settings: 'settings', desires: 'desires', impulses: 'impulses' } as const;
const DAY = 24 * 60 * 60 * 1000;

export async function loadAll(): Promise<AppData> {
  const [settings, desires, impulses] = await Promise.all([
    get<Settings>(K.settings),
    get<Desire[]>(K.desires),
    get<Impulse[]>(K.impulses),
  ]);
  const now = Date.now();
  const fresh = (impulses ?? []).filter((i) => i.doneAt === null || now - i.doneAt < DAY);
  if (impulses && fresh.length !== impulses.length) await set(K.impulses, fresh);
  return {
    settings: { ...defaultSettings, ...settings },
    desires: desires ?? [],
    impulses: fresh,
  };
}

export const saveSettings = (s: Settings) => set(K.settings, s);
export const saveDesires = (d: Desire[]) => set(K.desires, d);
export const saveImpulses = (i: Impulse[]) => set(K.impulses, i);

export async function replaceAll(data: AppData) {
  await clear();
  await Promise.all([saveSettings(data.settings), saveDesires(data.desires), saveImpulses(data.impulses)]);
}

export const wipe = () => clear();

// Export / import as one JSON file.

const FORMAT = 'assumed';

export function toExportJson(data: AppData): string {
  return JSON.stringify({ format: FORMAT, version: 1, ...data }, null, 2);
}

const isStr = (v: unknown): v is string => typeof v === 'string';
const isNumOrNull = (v: unknown) => v === null || typeof v === 'number';

export function parseImport(text: string): AppData {
  const raw = JSON.parse(text);
  if (!raw || raw.format !== FORMAT) throw new Error('format');
  const s = raw.settings;
  if (!s || (s.mode !== 'scene' && s.mode !== 'phrase')) throw new Error('settings');
  const settings: Settings = {
    mode: s.mode,
    reminderTime: isStr(s.reminderTime) ? s.reminderTime : null,
    onboarded: s.onboarded === true,
  };
  if (!Array.isArray(raw.desires) || !Array.isArray(raw.impulses)) throw new Error('lists');
  const desires: Desire[] = raw.desires.map((d: Desire) => {
    if (!isStr(d.id) || !isStr(d.label) || !isStr(d.scene) || !isStr(d.phrase)) throw new Error('desire');
    if (d.status !== 'active' && d.status !== 'sealed') throw new Error('desire');
    if (typeof d.createdAt !== 'number' || !isNumOrNull(d.sealedAt)) throw new Error('desire');
    return { id: d.id, label: d.label, scene: d.scene, phrase: d.phrase, status: d.status, createdAt: d.createdAt, sealedAt: d.sealedAt };
  });
  // Keep the invariant: at most one active desire.
  let seenActive = false;
  for (const d of desires) {
    if (d.status !== 'active') continue;
    if (seenActive) {
      d.status = 'sealed';
      d.sealedAt = d.sealedAt ?? Date.now();
    }
    seenActive = true;
  }
  const impulses: Impulse[] = raw.impulses.map((i: Impulse) => {
    if (!isStr(i.id) || !isStr(i.text) || !isNumOrNull(i.doneAt)) throw new Error('impulse');
    return { id: i.id, text: i.text, doneAt: i.doneAt };
  });
  return { settings, desires, impulses };
}
