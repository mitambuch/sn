// ═══════════════════════════════════════════════════
// AccountRequestModalContext — global ConciergeRequestWizard mount
//
// WHAT: Lifts the ConciergeRequestWizard up to the AppLayout level so
//       it can be triggered from any account surface (bottom nav FAB,
//       dashboard CTA, sidebar action, command palette, etc.) without
//       per-page local state duplication. The hook lives in a sibling
//       file (useAccountRequest) to satisfy the react-refresh
//       "only-export-components" lint constraint.
// WHEN: Wrap the AppShell tree inside AppLayout.
// ═══════════════════════════════════════════════════

import {
  ConciergeRequestWizard,
  type WizardCategory,
} from '@features/concierge-request/ConciergeRequestWizard';
import { createContext, type ReactNode, useCallback, useMemo, useState } from 'react';

export interface AccountRequestModalContextValue {
  isOpen: boolean;
  openRequest: (category?: WizardCategory) => void;
  closeRequest: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components -- context object is consumed by useAccountRequest hook in a sibling file
export const AccountRequestModalContext = createContext<AccountRequestModalContextValue | null>(
  null,
);

export const AccountRequestModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState<WizardCategory | undefined>(undefined);

  const openRequest = useCallback((category?: WizardCategory) => {
    setInitialCategory(category);
    setIsOpen(true);
  }, []);

  const closeRequest = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, openRequest, closeRequest }),
    [isOpen, openRequest, closeRequest],
  );

  return (
    <AccountRequestModalContext.Provider value={value}>
      {children}
      <ConciergeRequestWizard
        open={isOpen}
        onClose={closeRequest}
        {...(initialCategory && { initialCategory })}
      />
    </AccountRequestModalContext.Provider>
  );
};
