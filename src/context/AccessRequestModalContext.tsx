// ═══════════════════════════════════════════════════
// AccessRequestModalContext — global provider for the access form
//
// WHAT: Mounts <AccessRequestModal> once at the landing root. Any CTA
//       across the page (Hero, IndexOverlay, TerminalBar, Access
//       section) opens the form directly via useAccessRequestModal()
//       instead of scrolling to #s08. Pair with the LoginModalContext
//       so the two cooptation surfaces (request / sign-in) live as
//       sibling modals at the same level.
// WHEN: Wrap inside <LoginModalProvider> (or alongside it) at the top
//       of the landing tree.
// ═══════════════════════════════════════════════════

import { AccessRequestModal } from '@features/access/AccessRequestModal';
import { createContext, type ReactNode, useCallback, useMemo, useState } from 'react';

type Mode = 'request' | 'code';

export interface AccessRequestModalContextValue {
  isOpen: boolean;
  openAccessRequest: (mode?: Mode) => void;
  closeAccessRequest: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components -- context object consumed by useAccessRequestModal hook in a sibling file
export const AccessRequestModalContext = createContext<AccessRequestModalContextValue | null>(null);

export const AccessRequestModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('request');

  const openAccessRequest = useCallback((next: Mode = 'request') => {
    setMode(next);
    setIsOpen(true);
  }, []);

  const closeAccessRequest = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, openAccessRequest, closeAccessRequest }),
    [isOpen, openAccessRequest, closeAccessRequest],
  );

  return (
    <AccessRequestModalContext.Provider value={value}>
      {children}
      <AccessRequestModal isOpen={isOpen} onClose={closeAccessRequest} initialMode={mode} />
    </AccessRequestModalContext.Provider>
  );
};
