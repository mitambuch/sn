// ═══════════════════════════════════════════════════
// LoginModalContext — provider mounts the global LoginModal once
//
// WHAT: Context value + Provider component. The hook lives in a sibling
//       file (useLoginModal) to satisfy the react-refresh constraint
//       ("only export components in a *.tsx file").
// WHEN: Wrap the landing tree (typically inside Home or higher).
// ═══════════════════════════════════════════════════

import { LoginModal } from '@features/access/LoginModal';
import { createContext, type ReactNode, useCallback, useMemo, useState } from 'react';

export interface LoginModalContextValue {
  isOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components -- context object is consumed by useLoginModal hook in a sibling file
export const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export const LoginModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLogin = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(() => ({ isOpen, openLogin, closeLogin }), [isOpen, openLogin, closeLogin]);

  return (
    <LoginModalContext.Provider value={value}>
      {children}
      <LoginModal isOpen={isOpen} onClose={closeLogin} />
    </LoginModalContext.Provider>
  );
};
