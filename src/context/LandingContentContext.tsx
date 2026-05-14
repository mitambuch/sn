// ═══════════════════════════════════════════════════
// LandingContentContext — share Sanity landing fetch across sections
//
// WHAT: Wraps the Home tree, calls useLandingContent() once, and exposes
//       the result to all landing sections via context — so each
//       section can pull its editable copy from Sanity without
//       triggering a fresh fetch.
// WHEN: Mounted by Home (alongside LoginModalProvider /
//       AccessRequestModalProvider). Consumed via useLandingContext().
// FALLBACK: When Sanity is not configured the provider still works ; it
//       just yields { data: null, loading: false }. Section callers
//       must default to their i18n fallback string.
// ═══════════════════════════════════════════════════

import { useLandingContent } from '@hooks/useLandingContent';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

import type { SanityLanding } from '@/types/landing';

interface LandingContextValue {
  data: SanityLanding | null;
  loading: boolean;
}

const LandingContext = createContext<LandingContextValue>({ data: null, loading: false });

export const LandingContentProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading } = useLandingContent();
  const value = useMemo<LandingContextValue>(() => ({ data, loading }), [data, loading]);
  return <LandingContext.Provider value={value}>{children}</LandingContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- hook is colocated with the provider per i18n-sanity convention
export function useLandingContext(): LandingContextValue {
  return useContext(LandingContext);
}
