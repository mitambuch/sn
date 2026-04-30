// ═══════════════════════════════════════════════════
// useScrollEngine — context + hook split out of ScrollEngine.tsx
//
// WHAT: The React context object and consumer hook for the smooth-
//       scroll engine. Lives in its own file so ScrollEngine.tsx can
//       export only the provider component (react-refresh hygiene).
// WHEN: Imported by ScrollEngine.tsx (provider) and any consumer
//       hook/component that needs to read scroll state or trigger
//       freeze/resume.
// ═══════════════════════════════════════════════════

import { createContext, useContext } from 'react';

export interface ScrollEngineState {
  /** Current scrollY in px. */
  scrollY: number;
  /** 0–1 progress over the document height. */
  progress: number;
  /** Block scroll for `ms` milliseconds. Programmatic scroll still works. */
  freeze: (ms: number) => void;
  /** Cancel any active freeze. */
  resume: () => void;
}

export const ScrollEngineContext = createContext<ScrollEngineState | null>(null);

export const useScrollEngine = (): ScrollEngineState => {
  const ctx = useContext(ScrollEngineContext);
  if (!ctx) throw new Error('useScrollEngine() must be inside <ScrollEngine>');
  return ctx;
};
