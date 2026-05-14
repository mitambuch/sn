// ═══════════════════════════════════════════════════
// useAccessRequestModal — hook to open the global access form
// ═══════════════════════════════════════════════════

import {
  AccessRequestModalContext,
  type AccessRequestModalContextValue,
} from '@context/AccessRequestModalContext';
import { useContext } from 'react';

export function useAccessRequestModal(): AccessRequestModalContextValue {
  const ctx = useContext(AccessRequestModalContext);
  if (!ctx) {
    throw new Error('useAccessRequestModal must be used within an AccessRequestModalProvider');
  }
  return ctx;
}
