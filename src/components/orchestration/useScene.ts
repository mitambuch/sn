// ═══════════════════════════════════════════════════
// useScene — context + hook split out of SceneDirector.tsx
//
// WHAT: The React context object, named-act type, and consumer hook
//       for the timeline orchestrator. Lives in its own file so
//       SceneDirector.tsx exports only the provider component
//       (react-refresh hygiene).
// WHEN: Imported by SceneDirector.tsx (provider), ActStage (to push
//       the centered act), and any act/effect that needs to know the
//       current narrative position.
// ═══════════════════════════════════════════════════

import { createContext, useContext } from 'react';

export const ACT_NAMES = [
  'Threshold',
  'Apparition',
  'Murmurs',
  'Stillness',
  'Reversal',
  'Doorway',
] as const;

export type ActName = (typeof ACT_NAMES)[number];

export interface SceneState {
  /** The act currently centered in the viewport. */
  currentAct: ActName;
  /** Whether the user has crossed the Threshold (acte 0 → acte 1). */
  hasCrossedThreshold: boolean;
  /** Mark the threshold as crossed — called by Threshold on hold-click. */
  crossThreshold: () => void;
  /** Set the centered act, called from each act's intersection observer. */
  setCurrentAct: (act: ActName) => void;
}

export const SceneContext = createContext<SceneState | null>(null);

export const useScene = (): SceneState => {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error('useScene() must be inside <SceneDirector>');
  return ctx;
};
