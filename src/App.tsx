import { useCallback, useState } from 'react';
import { t } from './copy/en';
import { PhraseWriter, SceneWriter } from './components/Writers';
import { useStore } from './data/store';
import { Mode } from './data/types';
import { Bedtime } from './screens/Bedtime';
import { Doubt } from './screens/Doubt';
import { Edit } from './screens/Edit';
import { Home } from './screens/Home';
import { How } from './screens/How';
import { Onboarding } from './screens/Onboarding';
import { Seal } from './screens/Seal';
import { Sealed } from './screens/Sealed';
import { Settings } from './screens/Settings';
import { Impulses, Rewrite, Tools } from './screens/Tools';

export type Route =
  | { name: 'onboarding' }
  | { name: 'new' }
  | { name: 'home' }
  | { name: 'edit' }
  | { name: 'switch'; target: Mode; prev: Mode; back: Route }
  | { name: 'bedtime' }
  | { name: 'seal' }
  | { name: 'doubt' }
  | { name: 'tools' }
  | { name: 'rewrite' }
  | { name: 'impulses' }
  | { name: 'how' }
  | { name: 'settings' }
  | { name: 'sealed' };

export type Go = (route: Route) => void;

export default function App() {
  const store = useStore();
  const [route, setRoute] = useState<Route>(() =>
    store.data.settings.onboarded ? { name: 'home' } : { name: 'onboarding' },
  );
  const go = useCallback<Go>((r) => {
    setRoute(r);
    window.scrollTo(0, 0);
  }, []);

  /**
   * Switch modes without ever deleting text. If the active desire has nothing for the
   * new mode yet, open that mode's writer; cancelling reverts the mode.
   */
  const switchMode = useCallback(
    async (target: Mode, back: Route) => {
      const prev = store.data.settings.mode;
      if (prev === target) return;
      await store.setMode(target);
      if (store.active && !store.active[target].trim()) go({ name: 'switch', target, prev, back });
    },
    [store, go],
  );

  switch (route.name) {
    case 'onboarding':
      return <Onboarding key="full" variant="full" onFinish={() => go({ name: 'home' })} />;
    case 'new':
      return <Onboarding key="new" variant="new" onFinish={() => go({ name: 'home' })} onCancel={() => go({ name: 'home' })} />;
    case 'home':
      return <Home go={go} />;
    case 'edit':
      return store.active ? <Edit key={store.data.settings.mode} go={go} switchMode={switchMode} /> : <Home go={go} />;
    case 'switch': {
      const { target, prev, back } = route;
      const props = {
        onBack: async () => {
          await store.setMode(prev);
          go(back);
        },
        backLabel: t.common.cancel,
        notice: t.modes[target].kept,
        onDone: async (text: string) => {
          if (store.active) await store.updateDesire(store.active.id, { [target]: text });
          go(back);
        },
      };
      return target === 'scene' ? <SceneWriter key="s" {...props} /> : <PhraseWriter key="p" {...props} />;
    }
    case 'bedtime':
      return <Bedtime go={go} />;
    case 'seal':
      return <Seal go={go} />;
    case 'doubt':
      return <Doubt go={go} />;
    case 'tools':
      return <Tools go={go} />;
    case 'rewrite':
      return <Rewrite go={go} />;
    case 'impulses':
      return <Impulses go={go} />;
    case 'how':
      return <How go={go} />;
    case 'settings':
      return <Settings go={go} switchMode={switchMode} />;
    case 'sealed':
      return <Sealed go={go} />;
  }
}
