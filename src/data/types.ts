export type Mode = 'scene' | 'phrase';

export interface Settings {
  mode: Mode;
  reminderTime: string | null;
  onboarded: boolean;
}

export interface Desire {
  id: string;
  label: string;
  scene: string;
  phrase: string;
  status: 'active' | 'sealed';
  createdAt: number;
  sealedAt: number | null;
}

export interface Impulse {
  id: string;
  text: string;
  doneAt: number | null;
}

export interface AppData {
  settings: Settings;
  desires: Desire[];
  impulses: Impulse[];
}

export const defaultSettings: Settings = { mode: 'scene', reminderTime: null, onboarded: false };
