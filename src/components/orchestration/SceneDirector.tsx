// ═══════════════════════════════════════════════════
// SceneDirector — chef d'orchestre of the 6-act experience
//
// WHAT: Holds the active-act state and exposes it via SceneContext.
//       Wraps children with ScrollEngine + CursorField so any
//       descendant can subscribe to scroll, advance scenes, or query
//       which act is centered. The hook + context + types live in
//       `useScene.ts` (react-refresh hygiene).
// WHEN: Mounted at the root of the landing (pages/Home.tsx). Single
//       instance — never nest.
// ═══════════════════════════════════════════════════

import { CursorField } from '@components/orchestration/CursorField';
import { QuickDock } from '@components/orchestration/QuickDock';
import { ScrollEngine } from '@components/orchestration/ScrollEngine';
import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import type { ActName, SceneState } from './useScene';
import { SceneContext } from './useScene';

interface SceneDirectorProps {
  children: ReactNode;
  /** Click handler for the QuickDock "ÉCRIRE" entry — should open the drawer. */
  onWrite?: () => void;
}

export const SceneDirector = ({ children, onWrite }: SceneDirectorProps) => {
  const [currentAct, setCurrentAct] = useState<ActName>('Threshold');
  const [hasCrossedThreshold, setHasCrossedThreshold] = useState(false);

  const crossThreshold = useCallback(() => setHasCrossedThreshold(true), []);

  const value = useMemo<SceneState>(
    () => ({ currentAct, hasCrossedThreshold, crossThreshold, setCurrentAct }),
    [currentAct, hasCrossedThreshold, crossThreshold],
  );

  return (
    <SceneContext.Provider value={value}>
      <ScrollEngine>
        <CursorField />
        <QuickDock onWrite={onWrite} />
        {children}
      </ScrollEngine>
    </SceneContext.Provider>
  );
};
