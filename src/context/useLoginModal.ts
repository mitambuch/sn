// ═══════════════════════════════════════════════════
// useLoginModal — hook to open/close the global LoginModal
//
// USAGE:
//   const { openLogin } = useLoginModal();
//   <button onClick={openLogin}>Espace privé</button>
// ═══════════════════════════════════════════════════

import { LoginModalContext, type LoginModalContextValue } from '@context/LoginModalContext';
import { useContext } from 'react';

export const useLoginModal = (): LoginModalContextValue => {
  const ctx = useContext(LoginModalContext);
  if (!ctx) {
    throw new Error('useLoginModal must be used within a <LoginModalProvider>');
  }
  return ctx;
};
