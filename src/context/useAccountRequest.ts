// ═══════════════════════════════════════════════════
// useAccountRequest — hook to open the global ConciergeRequestWizard
//
// USAGE:
//   const { openRequest } = useAccountRequest();
//   <button onClick={() => openRequest()}>Nouvelle demande</button>
//   <button onClick={() => openRequest('timepiece')}>Garde-temps</button>
// ═══════════════════════════════════════════════════

import {
  AccountRequestModalContext,
  type AccountRequestModalContextValue,
} from '@context/AccountRequestModalContext';
import { useContext } from 'react';

export const useAccountRequest = (): AccountRequestModalContextValue => {
  const ctx = useContext(AccountRequestModalContext);
  if (!ctx) {
    throw new Error('useAccountRequest must be used within an <AccountRequestModalProvider>');
  }
  return ctx;
};
